// Authentication Controllers (Register, Login, Profile, OTP)
// CHGOURI CAR Marrakech Car Rental

const { User } = require('../models');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { sendOTPVerificationEmail } = require('../services/emailService');
const { cleanEnv } = require('../config/env');

// Helper to sign JWT token
const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    cleanEnv('JWT_SECRET', 'super_secret_chgouri_key_marrakech_2026_9988'),
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
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un e-mail et un mot de passe.' });
    }

    const admin = await User.findOne({ where: { email } });
    if (!admin) {
      console.warn(`[LOGIN] No user for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé. Réservé aux administrateurs.' });
    }

    const hash = admin.passwordHash || admin.getDataValue('password_hash');
    const isMatch = hash
      ? await bcrypt.compare(password, hash)
      : await admin.comparePassword(password);

    if (!isMatch) {
      console.warn(`[LOGIN] Bad password for: ${email}`);
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    const token = signToken(admin.id, admin.role);

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
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de l\'authentification.' });
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
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la récupération du profil.' });
  }
};

// Helper to generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Forgot Password - Generate OTP
 */
exports.forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'L\'adresse e-mail est requise.' });

    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Aucun compte administrateur trouvé avec cette adresse e-mail.' });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    try {
      await sendOTPVerificationEmail(user.email, otp, 'Password Reset');
    } catch (emailErr) {
      console.error('Brevo OTP send failed:', emailErr.message);
      return res.status(503).json({
        success: false,
        message:
          'Impossible d\'envoyer l\'e-mail (Brevo). Vérifiez BREVO_API_KEY sur Railway et que l\'expéditeur est validé dans Brevo.'
      });
    }

    return res.status(200).json({ success: true, message: 'Un code OTP a été envoyé à votre adresse e-mail.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la demande de réinitialisation.' });
  }
};

/**
 * Verify OTP
 */
exports.verifyOTP = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const otp = req.body.otp;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email et OTP requis.' });

    const user = await User.findOne({ where: { email, otpCode: otp } });
    if (!user || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Code OTP invalide ou expiré.' });
    }

    return res.status(200).json({ success: true, message: 'Code OTP vérifié avec succès.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du code.' });
  }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });

    const user = await User.findOne({ where: { email, otpCode: otp } });
    if (!user || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Code OTP invalide ou expiré.' });
    }

    user.passwordHash = newPassword; // Will be hashed by Sequelize hook beforeSave
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};

/**
 * Request Email Change (Logged in User)
 */
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ success: false, message: 'La nouvelle adresse e-mail est requise.' });

    // Check if new email is already taken
    const existingUser = await User.findOne({ where: { email: newEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cette adresse e-mail est déjà utilisée.' });
    }

    const user = await User.findByPk(req.user.id);
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    await sendOTPVerificationEmail(newEmail, otp, 'Email Change');

    return res.status(200).json({ success: true, message: 'Un code OTP a été envoyé à la nouvelle adresse e-mail.' });
  } catch (error) {
    console.error('Request email change error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la demande de changement d\'e-mail.' });
  }
};

/**
 * Verify Email Change (Logged in User)
 */
exports.verifyEmailChange = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    if (!newEmail || !otp) return res.status(400).json({ success: false, message: 'La nouvelle adresse e-mail et le code OTP sont requis.' });

    const user = await User.findByPk(req.user.id);
    if (user.otpCode !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Code OTP invalide ou expiré.' });
    }

    user.email = newEmail;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Adresse e-mail mise à jour avec succès.' });
  } catch (error) {
    console.error('Verify email change error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du code et mise à jour de l\'e-mail.' });
  }
};
