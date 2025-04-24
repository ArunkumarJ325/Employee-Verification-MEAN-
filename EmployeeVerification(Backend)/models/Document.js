const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  documentNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['AADHAR', 'PAN', 'ADDRESS_PROOF', 'QUALIFICATION'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true // file storage URL/path
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Changed from Employee to User so it works for manager or HR
    default: null
  },
  comment: {
    type: String,
    default: ''
  },
  finalVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  finalVerifiedStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  finalComment: {
    type: String,
    default: ''
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
