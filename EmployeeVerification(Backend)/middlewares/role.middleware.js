// middlewares/role.middleware.js
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    console.log("✅ Role check for:", role);
    console.log("Allowed roles:", allowedRoles);

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
