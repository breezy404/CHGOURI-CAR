// Email Service using Brevo API
// CHGOURI CAR Marrakech Car Rental

const axios = require('axios');
require('dotenv').config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SMTP_FROM_EMAIL || 'chgouricar@gmail.com';
const SENDER_NAME = process.env.SMTP_FROM_NAME || 'CHGOURI CAR Marrakech';
const LOGO_URL = 'https://res.cloudinary.com/dvppe25pp/image/upload/v1779306384/chgouri-car/assets/logo.png';

/**
 * Helper to send email via Brevo API
 */
const sendBrevoEmail = async (to, subject, htmlContent, attachment = null) => {
  if (!BREVO_API_KEY) {
    console.log('🚨 [EMAIL SERVICE] Simulation. No Brevo API Key found.');
    console.log(`➡️ Recipient: ${to}`);
    console.log(`➡️ Subject: ${subject}`);
    return;
  }

  try {
    const payload = {
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    if (attachment) {
      payload.attachment = [attachment];
    }

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log(`📨 Email sent successfully via Brevo to ${to}. ID: ${response.data.messageId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to send email via Brevo:', error.response?.data || error.message);
  }
};

/**
 * Sends a 6-digit OTP code to the user for password reset or email change.
 */
exports.sendOTPVerificationEmail = async (email, otpCode, context = 'Password Reset') => {
  const subject = `Code de Vérification - CHGOURI CAR`;
  const actionText = context === 'Password Reset' 
    ? 'réinitialiser votre mot de passe administrateur'
    : 'changer votre adresse e-mail';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #ffffff; text-align: center; padding: 25px 20px; border-bottom: 3px solid #ee3942;">
        <img src="${LOGO_URL}" alt="CHGOURI CAR Logo" style="height: 60px; object-fit: contain;">
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Bonjour,</h2>
        <p>Vous avez demandé à <strong>${actionText}</strong> sur la plateforme CHGOURI CAR.</p>
        <p>Veuillez utiliser le code de vérification à 6 chiffres ci-dessous. Ce code expire dans 15 minutes.</p>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #cbd5e1;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ee3942;">${otpCode}</span>
        </div>

        <p style="font-size: 13px; color: #64748b;">Si vous n'avez pas demandé cette action, veuillez ignorer cet e-mail. Vos informations restent sécurisées.</p>
      </div>
      <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CHGOURI CAR - Marrakech</p>
      </div>
    </div>
  `;

  await sendBrevoEmail(email, subject, htmlContent);
};

/**
 * Sends a rental reservation confirmation email to the client with the PDF invoice attached.
 */
exports.sendBookingConfirmationEmail = async (booking, pdfBuffer) => {
  const clientName = booking.user.name;
  const clientEmail = booking.user.email;
  const carName = `${booking.car.brand} ${booking.car.model}`;
  
  // Extract first car image or use default
  let carImageUrl = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600';
  try {
    const images = JSON.parse(booking.car.image_url);
    if (images && images.length > 0) {
      carImageUrl = images[0];
    }
  } catch (e) {
    // Keep default if JSON parse fails
  }

  const invoiceNum = booking.invoiceNumber;
  const totalPrice = parseFloat(booking.totalPrice).toFixed(2);
  const depositPrice = parseFloat(booking.depositAmount).toFixed(2);
  const balancePrice = (parseFloat(booking.totalPrice) - parseFloat(booking.depositAmount)).toFixed(2);

  const subject = `Confirmation de Réservation / Booking Confirmation #${invoiceNum} - CHGOURI CAR`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header with Logo -->
      <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #ee3942;">
        <img src="${LOGO_URL}" alt="CHGOURI CAR Logo" style="height: 60px; object-fit: contain;">
      </div>
      
      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #0f172a; margin-top: 0;">Bonjour ${clientName},</h2>
        <p>Votre réservation est <strong>confirmée</strong> ! Nous vous remercions pour votre confiance en CHGOURI CAR.</p>
        
        <!-- Car Image & Details -->
        <div style="text-align: center; margin: 25px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
           <img src="${carImageUrl}" alt="${carName}" style="width: 100%; height: 200px; object-fit: cover;">
           <div style="padding: 15px;">
             <h3 style="margin: 0; color: #ee3942; font-size: 18px;">${carName}</h3>
             <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">${booking.car.category}</p>
           </div>
        </div>
        
        <!-- Summary Box -->
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ee3942;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 15px;">DÉTAILS DE LA RÉSERVATION</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">N° Facture:</td>
              <td style="padding: 8px 0; text-align: right;">#${invoiceNum}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Date de Départ:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.pickupDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Lieu de Départ:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.pickupLocation}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Date de Retour:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.returnDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Lieu de Retour:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.returnLocation}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0 8px 0; font-weight: 600; color: #64748b; border-top: 1px dashed #cbd5e1;">Total Général:</td>
              <td style="padding: 12px 0 8px 0; text-align: right; font-weight: bold; color: #0f172a;">${totalPrice} MAD</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Acompte Payé:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #10b981;">${depositPrice} MAD</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">Reste à payer sur place:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #ee3942; font-size: 16px;">${balancePrice} MAD</td>
            </tr>
          </table>
        </div>

        <p><strong>Rappel :</strong> Votre reçu de paiement et la facture officielle sont joints à cet e-mail au format PDF.</p>
        
        <!-- WhatsApp Button -->
        <div style="text-align: center; margin: 35px 0 15px 0;">
          <a href="https://wa.me/212661901873?text=Bonjour%20CHGOURI%20CAR,%20je%20vous%20contacte%20concernant%20ma%20reservation%20%23${invoiceNum}" 
             style="background-color: #25d366; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.4);">
             Besoin d'aide ? Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-weight: bold; color: #64748b;">CHGOURI CAR - Marrakech, Maroc</p>
        <p style="margin: 5px 0 0 0;">Tél : +212 6 61 90 18 73 | +212 6 67 94 73 81</p>
        <p style="margin: 5px 0 0 0;">Email : chgouricar@gmail.com | Site : www.chgouricar.com</p>
      </div>
    </div>
  `;

  let attachment = null;
  if (pdfBuffer) {
    attachment = {
      name: `facture_chgouri_car_${invoiceNum}.pdf`,
      content: pdfBuffer.toString('base64')
    };
  }

  await sendBrevoEmail(clientEmail, subject, htmlContent, attachment);
};

/**
 * Sends a booking request acknowledgment email (Public Flow)
 */
exports.sendBookingRequestEmail = async (booking, days) => {
  const clientName = booking.customerName;
  const clientEmail = booking.customerEmail;
  const carName = booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Véhicule';
  
  let carImageUrl = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600';
  if (booking.car && booking.car.imageUrl) {
    try {
      const images = JSON.parse(booking.car.imageUrl);
      if (images && images.length > 0) carImageUrl = images[0];
      else if (typeof booking.car.imageUrl === 'string' && booking.car.imageUrl.startsWith('http')) carImageUrl = booking.car.imageUrl;
    } catch (e) {
      if (typeof booking.car.imageUrl === 'string' && booking.car.imageUrl.startsWith('http')) carImageUrl = booking.car.imageUrl;
    }
  }

  const subject = `Votre Commande CHGOURI CAR - ${carName}`;
  const totalAmount = booking.totalAmount ? `${booking.totalAmount} MAD` : 'En attente';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #ffffff; text-align: center; padding: 20px; border-bottom: 3px solid #ee3942;">
        <img src="${LOGO_URL}" alt="CHGOURI CAR Logo" style="height: 60px; object-fit: contain;">
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Merci pour votre commande, ${clientName} !</h2>
        <p style="font-size: 15px;">Nous avons bien reçu votre demande de réservation. Voici le récapitulatif détaillé de votre commande. Notre équipe vous contactera très rapidement pour confirmer la disponibilité.</p>
        
        <div style="text-align: center; margin: 25px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
           <img src="${carImageUrl}" alt="${carName}" style="width: 100%; height: 200px; object-fit: cover;">
           <div style="padding: 15px;">
             <h3 style="margin: 0; color: #ee3942; font-size: 20px; font-weight: 800;">${carName}</h3>
           </div>
        </div>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin: 20px 0; border-left: 4px solid #ee3942;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">DÉTAILS DE LA COMMANDE #${booking.id}</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; border-bottom: 1px dashed #cbd5e1;">Lieu de prise en charge:</td>
              <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #cbd5e1; font-weight: bold;">${booking.pickupLocation}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; border-bottom: 1px dashed #cbd5e1;">Lieu de récupération:</td>
              <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #cbd5e1; font-weight: bold;">${booking.returnLocation}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; border-bottom: 1px dashed #cbd5e1;">Date de Départ:</td>
              <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #cbd5e1; font-weight: bold;">${booking.pickupDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; border-bottom: 1px dashed #cbd5e1;">Date de Retour:</td>
              <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #cbd5e1; font-weight: bold;">${booking.returnDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; border-bottom: 1px dashed #cbd5e1;">Durée:</td>
              <td style="padding: 10px 0; text-align: right; border-bottom: 1px dashed #cbd5e1; font-weight: bold;">${days} jour(s)</td>
            </tr>
            <tr>
              <td style="padding: 15px 0 5px 0; font-weight: 800; color: #0f172a; font-size: 18px;">Total Estimé:</td>
              <td style="padding: 15px 0 5px 0; text-align: right; font-weight: 900; color: #ee3942; font-size: 20px;">${totalAmount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 35px 0 15px 0;">
          <a href="https://wa.me/212661901873" style="background-color: #25d366; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
             Finaliser sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  await sendBrevoEmail(clientEmail, subject, htmlContent);
};

/**
 * Sends a notification email to the Admin for a new booking
 */
exports.sendAdminNewBookingEmail = async (booking, days) => {
  const { User } = require('../models');
  const adminUser = await User.findOne({ where: { role: 'admin' } });
  const adminEmail = adminUser ? adminUser.email : (process.env.SMTP_FROM_EMAIL || 'zakariaoukhamou11@gmail.com');

  const carName = booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Véhicule';
  
  const subject = `🚨 NOUVELLE COMMANDE : ${carName}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0f172a; text-align: center; padding: 20px; border-bottom: 3px solid #ee3942;">
        <h1 style="color: white; margin: 0; font-size: 24px;">NOUVELLE RÉSERVATION</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #0f172a; margin-top: 0;">Un nouveau client a passé commande !</h2>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Client</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${booking.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Téléphone</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #25d366;"><a href="https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}">${booking.customerPhone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Email</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${booking.customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Véhicule</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${carName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Dates</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">Du ${booking.pickupDate} au ${booking.returnDate} (${days} jours)</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Prise en charge</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${booking.pickupLocation}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Récupération</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${booking.returnLocation}</td>
          </tr>
        </table>

        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">Connectez-vous à votre tableau de bord pour accepter ou annuler cette demande.</p>
      </div>
    </div>
  `;

  await sendBrevoEmail(adminEmail, subject, htmlContent);
};

/**
 * Sends a notification email to the Client for a booking status update
 */
exports.sendStatusUpdateEmail = async (booking, newStatus) => {
  const clientName = booking.customerName;
  const clientEmail = booking.customerEmail;
  const carName = booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Véhicule';
  
  let subject = `Mise à jour de votre réservation - CHGOURI CAR`;
  let statusText = '';
  let statusColor = '#0f172a';
  let messageText = '';

  if (newStatus === 'confirmed') {
    subject = `✅ Réservation Confirmée - CHGOURI CAR`;
    statusText = 'CONFIRMÉE';
    statusColor = '#25d366'; // Green
    messageText = 'Excellente nouvelle ! Votre réservation a été confirmée par notre équipe. Nous vous attendons avec impatience le jour de la prise en charge.';
  } else if (newStatus === 'cancelled') {
    subject = `❌ Réservation Annulée - CHGOURI CAR`;
    statusText = 'ANNULÉE';
    statusColor = '#ee3942'; // Red
    messageText = "Votre réservation a été annulée. Si vous n'êtes pas à l'origine de cette annulation ou si vous souhaitez reprogrammer, n'hésitez pas à nous contacter.";
  } else {
    return; // Don't send email for 'contacted' or 'pending'
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #ffffff; text-align: center; padding: 20px; border-bottom: 3px solid #ee3942;">
        <img src="${LOGO_URL}" alt="CHGOURI CAR Logo" style="height: 60px; object-fit: contain;">
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Bonjour ${clientName},</h2>
        
        <div style="text-align: center; margin: 25px 0;">
          <div style="display: inline-block; padding: 10px 20px; background-color: ${statusColor}15; border: 2px solid ${statusColor}; border-radius: 8px; color: ${statusColor}; font-weight: 900; font-size: 20px; letter-spacing: 2px;">
            ${statusText}
          </div>
        </div>

        <p style="font-size: 15px;">${messageText}</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">RAPPEL DE VOTRE COMMANDE #${booking.id}</h3>
          <p style="margin: 5px 0;"><strong>Véhicule :</strong> ${carName}</p>
          <p style="margin: 5px 0;"><strong>Dates :</strong> Du ${booking.pickupDate} au ${booking.returnDate}</p>
          <p style="margin: 5px 0;"><strong>Prise en charge :</strong> ${booking.pickupLocation}</p>
          <p style="margin: 5px 0;"><strong>Récupération :</strong> ${booking.returnLocation}</p>
        </div>

        <div style="text-align: center; margin: 35px 0 15px 0;">
          <a href="https://wa.me/212661901873" style="background-color: #25d366; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
             Nous contacter sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  await sendBrevoEmail(clientEmail, subject, htmlContent);
};

/**
 * Sends a notification email to the Admin for a new contact message
 */
exports.sendAdminNewContactMessageEmail = async (contactMessage) => {
  const { User } = require('../models');
  const adminUser = await User.findOne({ where: { role: 'admin' } });
  const adminEmail = adminUser ? adminUser.email : (process.env.SMTP_FROM_EMAIL || 'zakariaoukhamou11@gmail.com');
  
  const subject = `📧 NOUVEAU MESSAGE : ${contactMessage.subject}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0f172a; text-align: center; padding: 20px; border-bottom: 3px solid #ee3942;">
        <h1 style="color: white; margin: 0; font-size: 24px;">NOUVEAU MESSAGE CLIENT</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #0f172a; margin-top: 0;">Vous avez reçu une nouvelle demande de contact.</h2>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Nom</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${contactMessage.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Téléphone</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #25d366;"><a href="https://wa.me/${contactMessage.phone.replace(/[^0-9]/g, '')}">${contactMessage.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Email</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${contactMessage.email}">${contactMessage.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: 600; background: #f8fafc; border: 1px solid #e2e8f0;">Sujet</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${contactMessage.subject}</td>
          </tr>
        </table>

        <div style="background-color: #f1f5f9; border-left: 4px solid #ee3942; padding: 15px; margin-top: 25px;">
          <h3 style="margin-top: 0; font-size: 14px; color: #64748b; text-transform: uppercase;">Message :</h3>
          <p style="margin: 0; font-size: 15px; white-space: pre-wrap;">${contactMessage.message}</p>
        </div>

        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">Connectez-vous à votre tableau de bord (onglet Messages Clients) pour plus de détails.</p>
      </div>
    </div>
  `;

  await sendBrevoEmail(adminEmail, subject, htmlContent);
};
