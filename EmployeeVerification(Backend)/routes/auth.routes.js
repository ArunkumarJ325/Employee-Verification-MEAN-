const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');

const { registerValidation } = require('../middlewares/authValidators');
const { validationResult } = require('express-validator');


router.post('/register', registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return validation errors
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, registerUser);

router.post('/login', loginUser);

module.exports = router;
