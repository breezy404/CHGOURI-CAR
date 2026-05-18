// JWT Authentication & Authorization Middleware
// CHGOURI CAR Marrakech Car Rental

const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Protect routes - Verification of JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token d\'authentification manquant.'
      });
    }

    // 2. Verify token signature securely using env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_chgouri_key_marrakech_2026_9988');

    // 3. Check if user still exists in database, explicitly EXCLUDING password hash
    const currentUser = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash', 'password_hash'] }
    });

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'L\'utilisateur détenteur de ce jeton n\'existe plus.'
      });
    }

    // 4. Grant access and store secure user details in req.user
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('JWT Auth Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Jeton de sécurité invalide ou expiré.'
    });
  }
};

/**
 * Restrict access to specific roles (e.g. Admin only)
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists and if their role is in the permitted roles array
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Vous n\'avez pas les autorisations de niveau administrateur nécessaires.'
      });
    }
    next();
  };
};
