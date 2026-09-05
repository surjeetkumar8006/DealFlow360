const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Normalize user role and allowed roles for flexible matching
    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted. Required role: [${allowedRoles.join(', ')}], Your role: '${req.user.role}'`
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
