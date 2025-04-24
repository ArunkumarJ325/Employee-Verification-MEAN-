const Employee = require('../models/Employee');
const Document = require('../models/Document');
const VerificationLog = require('../models/VerificationLog');

const verifyByManager = async (req, res) => {
  const { employeeId, status, comment } = req.body;
  const verifiedBy = req.user.id;  // Assuming JWT auth middleware provides user ID

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Update employee status to APPROVED or REJECTED
    employee.status = status;
    await employee.save();

    // Log verification action
    const verificationLog = new VerificationLog({
      employeeId: employee._id,
      verifiedBy,
      role: 'MANAGER',
      action: status,
      comment
    });

    await verificationLog.save();
    res.json({ msg: 'Verification completed by manager' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { verifyByManager };
