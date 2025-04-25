// controllers/document.controller.js
const Document = require('../models/Document');
const User = require('../models/User');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail'); // or your email utility path
const uploadDocument = async (req, res) => {
  try {
    const { documentNumber, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const employeeId = req.user.employeeId.trim();
    const userProfile = await Employee.findOne({ employeeId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Validate only if it's Aadhar or PAN
    if (type === 'AADHAR' && userProfile.aadharNumber !== documentNumber) {
      return res.status(400).json({ message: 'Invalid Aadhar number' });
    }

    if (type === 'PAN' && userProfile.panNumber !== documentNumber) {
      return res.status(400).json({ message: 'Invalid PAN number' });
    }
    

    // Allow other types without checking the profile
    const newDoc = await Document.create({
      documentNumber,
      type,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
      verifiedStatus: 'PENDING'
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDoc
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading document' });
  }
};







const getPendingDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ verifiedStatus: 'PENDING' })
      .populate('uploadedBy', 'name employeeId'); // Populating the uploadedBy field with name and employeeId
      console.log(documents); // Log the documents

    res.status(200).json(documents); // Returning the documents
  } catch (err) {
    console.error('Error fetching pending documents:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyDocument = async (req, res) => {
  const documentId = req.params.id;
  const { verifiedStatus, comment } = req.body;

  // Ensure status is either 'APPROVED' or 'REJECTED'
  if (!['APPROVED', 'REJECTED'].includes(verifiedStatus)) {
    return res.status(400).json({ message: "Invalid verification status" });
  }

  try {
    // Find and update the document
    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      {
        verifiedStatus,
        comment: comment || '',
        verifiedBy: req.user.id
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // If document is rejected, send rejection email
    if (verifiedStatus === 'REJECTED') {
      const user = await User.findById(updatedDoc.uploadedBy);

      if (user && user.email) {
        const subject = '⚠️ Your document has been rejected by Manager';
        const message = `
Hello ${user.name || 'Employee'},

Your document (${updatedDoc.type}) has been rejected by the Manager.

❌ Status: Rejected
📄 Document Type: ${updatedDoc.type}
🔢 Document Number: ${updatedDoc.documentNumber}
📝 Comment: ${comment || 'No comment provided'}

Please review the comment and re-upload the document for further processing.

- Employee Verification Portal
        `;
        await sendEmail(user.email, subject, message);
      }
    }

    // Respond with success
    res.status(200).json({
      message: "Document status updated",
      document: updatedDoc
    });

  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const documents = await Document.find({ uploadedBy: userId })
      .populate('verifiedBy', 'name')         // Populate manager name
      .populate('finalVerifiedBy', 'name');   // Populate HR name

    console.log("Documents found:", documents.length);
    
    res.status(200).json({ documents });
  } catch (err) {
    console.error('Error fetching employee documents:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





const hrVerifyDocument = async (req, res) => {
  try {
    const { finalVerifiedStatus, finalComment } = req.body;
    const docId = req.params.id;
    const hrUserId = req.user.id;

    const document = await Document.findById(docId).populate('uploadedBy');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.finalVerifiedStatus = finalVerifiedStatus;
    document.finalComment = finalComment;
    document.finalVerifiedBy = new mongoose.Types.ObjectId(hrUserId);
    await document.save();

    // Fetch user from uploadedBy (which is a User ID)
    const user = await User.findById(document.uploadedBy);

    if (user && user.email) {
      let subject, message;

      // If document is approved, check if all documents are approved
      if (finalVerifiedStatus === 'APPROVED') {
        const allDocuments = await Document.find({ uploadedBy: document.uploadedBy });

        // Check if all documents are approved
        const allApproved = allDocuments.every(doc => doc.finalVerifiedStatus === 'APPROVED');

        if (allApproved) {
          subject = '🎉 Your document has been approved by HR!';
          message = `
Hello ${user.name || 'Employee'},

Your documents have been successfully verified and approved by the HR team.

✅ Status: Approved for all documents
📄 Document Type(s): ${allDocuments.map(doc => doc.type).join(', ')}
🔢 Document Number(s): ${allDocuments.map(doc => doc.documentNumber).join(', ')}

Thank you for submitting your documents.

- Employee Verification Portal
          `;
          await sendEmail(user.email, subject, message);
        }
      } else if (finalVerifiedStatus === 'REJECTED') {
        // Send email when the document is rejected
        subject = '⚠️ Your document has been rejected by HR';
        message = `
Hello ${user.name || 'Employee'},

Unfortunately, your document (${document.type}) has been rejected during the final HR verification process.

❌ Status: ${finalVerifiedStatus}
📄 Document Type: ${document.type}
🔢 Document Number: ${document.documentNumber}
📝 Comment: ${finalComment || 'No comment provided'}

Please review the comment and re-upload the document for further processing.

- Employee Verification Portal
        `;
        await sendEmail(user.email, subject, message);
      }
    }

    res.status(200).json({ message: 'Document reviewed by HR' });
  } catch (err) {
    console.error('Final verification error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getManagerApprovedDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ verifiedStatus: 'APPROVED' })
      .populate('uploadedBy', 'name employeeId'); // Populating the uploadedBy field with name and employeeId

    res.status(200).json(documents); // Returning the documents
  } catch (err) {
    console.error('Error fetching approved documents:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
//allow user to reupload documents 
const reuploadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      {
        fileUrl,
        verifiedStatus: 'PENDING', // reset statuses
        comment: '',
        verifiedBy: null,
        finalVerifiedStatus: 'PENDING',
        finalComment: '',
        finalVerifiedBy: null
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document reuploaded successfully', document: updatedDoc });
  } catch (error) {
    console.error('Error reuploading document:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Controller method to group documents by employee and their approval status
const getGroupedDocumentsForManager = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('uploadedBy', 'name employeeId email') // Adjust fields if needed
      .lean();

    const grouped = {};

    for (const doc of documents) {
      const empId = doc.uploadedBy?._id?.toString();
      if (!empId) continue;

      if (!grouped[empId]) {
        grouped[empId] = {
          employee: doc.uploadedBy,
          documents: []
        };
      }

      grouped[empId].documents.push(doc);
    }

    const response = Object.values(grouped).map(group => {
      const allApproved = group.documents.every(doc => doc.verifiedStatus === 'APPROVED');
      const hasPending = group.documents.some(doc => doc.verifiedStatus === 'PENDING');

      return {
        employee: group.employee,
        documents: group.documents,
        allApproved,
        hasPending
      };
    });

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching grouped documents:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getGroupedDocumentsForHR = async (req, res) => {
  try {
    const documents = await Document.find({ verifiedStatus: 'APPROVED' }) // filter only approved ones
      .populate('uploadedBy', 'name employeeId email')
      .lean();

    const grouped = {};

    // Group documents by employee ID
    for (const doc of documents) {
      const empId = doc.uploadedBy?._id?.toString();
      if (!empId) continue;

      if (!grouped[empId]) {
        grouped[empId] = {
          employee: doc.uploadedBy,
          documents: []
        };
      }

      grouped[empId].documents.push(doc);
    }

    // Prepare the response with pending and completed documents
    const response = Object.values(grouped).map(group => {
      const allHRReviewed = group.documents.every(doc =>
        doc.finalVerifiedStatus === 'APPROVED' || doc.finalVerifiedStatus === 'REJECTED'
      );

      const pendingHR = group.documents.some(doc =>
        doc.finalVerifiedStatus !== 'APPROVED' && doc.finalVerifiedStatus !== 'REJECTED'
      );

      return {
        employee: group.employee,
        documents: group.documents,
        allHRReviewed,
        pendingHR
      };
    });

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching HR documents:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const updateDocumentFinalStatus = async (req, res) => {
  try {
    const { documentId, finalVerifiedStatus, finalComment } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(finalVerifiedStatus)) {
      return res.status(400).json({ message: 'Invalid final status' });
    }

    const updated = await Document.findByIdAndUpdate(
      documentId,
      {
        finalVerifiedStatus,
        finalComment
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document updated successfully', document: updated });
  } catch (err) {
    console.error('Error updating document final status:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  uploadDocument,
  getPendingDocuments,
  verifyDocument,
  getMyDocuments,
  getManagerApprovedDocuments,
  getGroupedDocumentsForManager,
  hrVerifyDocument,
  getGroupedDocumentsForHR, // ✅ must be exported like this
  updateDocumentFinalStatus,
  reuploadDocument // ✅ must be exported like this
};
