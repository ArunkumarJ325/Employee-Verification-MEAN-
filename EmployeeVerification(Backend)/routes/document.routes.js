const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const verifyUser = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.config');
const allowRoles = require('../middlewares/role.middleware');

// Route to upload document
router.post(
    '/upload',
    verifyUser,  // JWT Authentication check first
    upload.single('file'),  // File upload
    documentController.uploadDocument  // Controller for handling the upload
  );
  
  router.get('/pending', verifyUser,allowRoles(['MANAGER']), documentController.getPendingDocuments);
  router.patch('/verify/:id', verifyUser, allowRoles(['MANAGER']), documentController.verifyDocument);
  // routes/document.routes.js
router.get('/my-documents', verifyUser, documentController.getMyDocuments);//this one is for employee to see what they uploaded
router.get(
  '/approved-manager',
  verifyUser,
  allowRoles(['HR','MANAGER']), // either manager or HR can view this
  documentController.getManagerApprovedDocuments
);
// HR-specific grouped document list with manager & HR review
router.get(
  '/hr/grouped-status',
  verifyUser,
  allowRoles(['HR']),
  documentController.getGroupedDocumentsForHR
);

// HR approves/rejects a document with final status and comment
router.patch(
  '/hr/final-review',
  verifyUser,
  allowRoles(['HR']),
  documentController.updateDocumentFinalStatus
);
router.patch(
  '/reupload/:id',
  verifyUser,
  allowRoles(['EMPLOYEE']),
  upload.single('file'),
  documentController.reuploadDocument
);

// Route to get grouped documents for manager
router.get(
  '/grouped-status',
  verifyUser,  // Make sure the user is authenticated
  allowRoles(['MANAGER']),  // Ensure only a manager can access this route
  documentController.getGroupedDocumentsForManager  // The function to handle the request
);


router.patch('/hr/verify/:id', verifyUser, allowRoles(['HR']), documentController.hrVerifyDocument);
module.exports = router;
