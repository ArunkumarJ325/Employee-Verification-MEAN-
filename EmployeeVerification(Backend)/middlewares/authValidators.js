const { body } = require('express-validator');

exports.registerValidation = [
  body('employeeId')
    .isLength({ min: 6, max: 6 }).withMessage('Employee ID must be exactly 6 digits')
    .isNumeric().withMessage('Employee ID must contain only digits'),

  body('email')
    .isEmail().withMessage('Invalid email'),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[\W_]/).withMessage('Password must contain a special character')
];
