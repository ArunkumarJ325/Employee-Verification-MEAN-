const express = require('express');
const { verifyByManager } = require('../controllers/verification.controller');
const router = express.Router();

// Manager verification
router.post('/manager', verifyByManager);

module.exports = router;
