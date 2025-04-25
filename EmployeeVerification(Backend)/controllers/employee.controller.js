const Employee = require('../models/Employee');

exports.createProfile = async (req, res) => {
  const { name, address, yearsOfExperience, previousCompanies, aadharNumber, panNumber } = req.body;

  try {
    console.log('Creating profile for:', req.user.employeeId);  // Debug log

    // Check if the employee profile already exists
    const existingEmployee = await Employee.findOne({ employeeId: req.user.employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Profile already created' });
    }

    // Check if the Aadhar number already exists in the database
    const existingAadhar = await Employee.findOne({ aadharNumber });
    if (existingAadhar) {
      return res.status(400).json({ message: 'Aadhar Number already exists' });
    }

    // Check if the PAN number already exists in the database
    const existingPan = await Employee.findOne({ panNumber });
    if (existingPan) {
      return res.status(400).json({ message: 'PAN Number already exists' });
    }

    // Create a new employee profile
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
