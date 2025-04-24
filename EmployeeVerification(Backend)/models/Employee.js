const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  previousCompanies: {
    type: [String],  // Array of company names
    required: true
  },
  status: {
    type: String,
    enum: ['FRESH', 'APPROVED', 'REJECTED'],
    default: 'FRESH'
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true
  },
  panNumber: {
    type: String,
    required: true
  },
  addressProofId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  qualificationCertificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema,'employees');
