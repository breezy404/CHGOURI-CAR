// Client Contact Messages Controller
// CHGOURI CAR Marrakech Car Rental

const { Message } = require('../models');

/**
 * Submit a contact form message (Public)
 */
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez saisir votre nom, e-mail, téléphone et message.'
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject: subject || 'Sans objet',
      message
    });

    const emailService = require('../services/emailService');
    emailService.sendAdminNewContactMessageEmail(newMessage).catch(err => {
      console.error('Failed to send contact notification to admin:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.',
      contactMessage: newMessage
    });
  } catch (error) {
    console.error('Create message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message.'
    });
  }
};

/**
 * Fetch all submitted messages (Admin Only)
 */
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des messages.'
    });
  }
};

/**
 * Delete / Archive a client message (Admin Only)
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message introuvable.'
      });
    }

    await message.destroy();

    return res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès.'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la suppression du message.'
    });
  }
};
