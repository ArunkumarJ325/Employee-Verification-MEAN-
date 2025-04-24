const express = require('express');
const router = express.Router();
const { createProfile, getProfile } = require('../controllers/employee.controller');
const verifyUser = require('../middlewares/auth.middleware');  // Correct middleware import
const roleMiddleware = require('../middlewares/role.middleware');  // Correct middleware import
const User = require('../models/User');

// Route for creating a profile (only EMPLOYEE can access)
router.post('/profile', verifyUser, roleMiddleware(['EMPLOYEE']), createProfile);

// Route for getting a profile (only EMPLOYEE can access)
router.get('/profile', verifyUser, roleMiddleware(['EMPLOYEE']), getProfile);

//to fetch the name only 
router.get('/users/:employeeId', async (req, res) => {
    try {
      const { employeeId } = req.params;
      const user = await User.findOne({ employeeId });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);  // Return user data (including the name, etc.)
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
