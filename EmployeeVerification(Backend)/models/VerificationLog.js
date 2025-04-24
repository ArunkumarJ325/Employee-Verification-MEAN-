const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['MANAGER', 'HR'],
    required: true
  },
  action: {
    type: String,
    enum: ['APPROVED', 'REJECTED'],
    required: true
  },
  comment: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);
