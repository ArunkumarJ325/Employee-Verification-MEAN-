// src/app/models/document.model.ts
export interface Document {
    _id: string;  // Include _id field to match MongoDB
    documentNumber: string;
    type: string;
    fileUrl: string;
    uploadedBy: string;  // This could be a user ID that you resolve to a name
    verifiedStatus: string;  // PENDING, APPROVED, REJECTED
    verifiedBy: string | null;
    comment: string;
    finalVerifiedBy: string | null;
    finalVerifiedStatus: string;  // PENDING, APPROVED, REJECTED
    finalComment: string;
  }
  