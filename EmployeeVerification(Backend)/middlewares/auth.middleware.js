const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  console.log("VerifyUser Middleware Reached");

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // Bearer <token>

  if (!token) {
    return res.status(403).json({ msg: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Save user info to request object
    console.log('Decoded JWT:', req.user);  // Debug log
    next();
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid token' });
  }
};

module.exports = verifyUser;
