const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { name, email, password, role, employeeId } = req.body;

  try {
    // Check if the email already exists in the database
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if the employeeId already exists in the database
    const existingEmployee = await User.findOne({ employeeId });
    if (existingEmployee) {
      console.log("User already exists with employeeId:", employeeId);
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      employeeId,
    });

    // Save the new user to the database
    await newUser.save();
    console.log("User registered successfully:", newUser);

    // Send success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Registration Error:", err);  // 👈 key line
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', req.body);  // Log the incoming data

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email ' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        employeeId: user.employeeId  // include employeeId in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { name: user.name, role: user.role, id: user._id } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
