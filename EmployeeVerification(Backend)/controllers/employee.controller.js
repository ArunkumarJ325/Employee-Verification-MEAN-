const Employee = require('../models/Employee');

exports.createProfile = async (req, res) => {
  const { name, address, yearsOfExperience, previousCompanies, aadharNumber, panNumber } = req.body;

  try {
    console.log('Creating profile for:', req.user.employeeId);  // Debug log

    const existingEmployee = await Employee.findOne({ employeeId: req.user.employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Profile already created' });
    }

    const newEmployee = new Employee({
      employeeId: req.user.employeeId,
      name,
      address,
      yearsOfExperience,
      previousCompanies,
      aadharNumber,
      panNumber,
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee profile created successfully', employee: newEmployee });
  } catch (err) {
    console.error('Error creating profile:', err);  // Debug log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('Fetching profile for:', req.user.employeeId);  // Debug log
    const employee = await Employee.findOne({ employeeId: req.user.employeeId });

    if (!employee) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ employee });
  } catch (err) {
    console.error('Error fetching profile:', err);  // Debug log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
