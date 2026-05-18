// Authentication Controllers (Register, Login, Profile)
// CHGOURI CAR Marrakech Car Rental

const { User } = require('../models');
const jwt = require('jsonwebtoken');

const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');

// Helper to sign JWT token
const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_chgouri_key_marrakech_2026_9988',
    { expiresIn: '1d' } // Enforced 1 day expiration
  );
};

// Rate limiter for login to prevent brute-force attacks
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { success: false, message: 'Trop de tentatives de connexion, veuillez réessayer après 15 minutes.' }
});

/**
 * Secure Admin Login (Mapped to /api/auth/login for frontend compatibility)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Input Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un e-mail et un mot de passe.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'e-mail invalide.'
      });
    }

    // 2. Find admin by email
    const admin = await User.findOne({ where: { email } });
    
    // Check if user exists
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    // 3. Add explicit role check for admin ONLY
    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé. Réservé aux administrateurs.' });
    }

    // 4. Compare password securely with bcrypt
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    // 5. Generate secure JWT
    const token = signToken(admin.id, admin.role);

    // 6. Return response matching React AuthContext expectations ({ token, user })
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de l\'authentification.'
    });
  }
};

/**
 * Get Profile of Authenticated User
 */
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile fetching error:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération du profil.'
    });
  }
};
