// Email Confirmation Service with PDF Attachment
// CHGOURI CAR Marrakech Car Rental

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create SMTP Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Enforce fallback if unconfigured
  if (!user || user === 'your_app_password') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: parseInt(port) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  });
};

/**
 * Sends a rental reservation confirmation email to the client with the PDF invoice attached.
 * @param {Object} booking - Sequelize Booking instance
 * @param {Buffer} pdfBuffer - PDF invoice buffer
 */
exports.sendBookingConfirmationEmail = async (booking, pdfBuffer) => {
  const transporter = createTransporter();

  const clientName = booking.user.name;
  const clientEmail = booking.user.email;
  const carName = `${booking.car.brand} ${booking.car.model}`;
  const pickupDate = booking.pickupDate;
  const dropoffDate = booking.dropoffDate;
  const invoiceNum = booking.invoiceNumber;
  const totalPrice = parseFloat(booking.totalPrice).toFixed(2);
  const depositPrice = parseFloat(booking.depositAmount).toFixed(2);
  const balancePrice = (parseFloat(booking.totalPrice) - parseFloat(booking.depositAmount)).toFixed(2);

  const subject = `Confirmation de Réservation / Booking Confirmation #${invoiceNum} - CHGOURI CAR`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background-color: #ee3942; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">CHGOURI CAR</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px;">Votre Partenaire Location à Marrakech</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${clientName},</h2>
        <p>Nous avons le plaisir de vous confirmer votre réservation de voiture chez <strong>CHGOURI CAR</strong>.</p>
        <p>Votre facture et reçu de paiement sont joints à cet e-mail au format PDF.</p>
        
        <!-- Summary Box -->
        <div style="background-color: #f8fafc; border-radius: 6px; padding: 15px; margin: 20px 0; border-left: 4px solid #ee3942;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 14px;">RÉSUMÉ DE LA RÉSERVATION</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #64748b;">Numéro de Facture:</td>
              <td style="padding: 5px 0; text-align: right;">#${invoiceNum}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #64748b;">Véhicule:</td>
              <td style="padding: 5px 0; text-align: right;">${carName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #64748b;">Date de Départ:</td>
              <td style="padding: 5px 0; text-align: right;">${pickupDate} (${booking.pickupLocation})</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #64748b;">Date de Retour:</td>
              <td style="padding: 5px 0; text-align: right;">${dropoffDate} (${booking.dropoffLocation})</td>
            </tr>
            <tr>
              <td style="padding: 10px 0 5px 0; font-weight: bold; color: #64748b; border-top: 1px dashed #cbd5e1;">Total Général:</td>
              <td style="padding: 10px 0 5px 0; text-align: right; font-weight: bold; color: #ee3942;">${totalPrice} MAD</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #64748b;">Acompte payé en ligne:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #10b981;">${depositPrice} MAD</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #1e293b;">Reste à payer sur place:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #1e293b;">${balancePrice} MAD</td>
            </tr>
          </table>
        </div>

        <p><strong>Remarque importante :</strong> Veuillez vous munir de votre permis de conduire (plus de 2 ans) et de votre pièce d'identité (passeport/carte nationale) lors de la livraison du véhicule.</p>

        <p>Si vous avez des questions, vous pouvez nous contacter directement sur WhatsApp en cliquant sur le bouton ci-dessous :</p>

        <!-- WhatsApp Button -->
        <div style="text-align: center; margin: 30px 0 15px 0;">
          <a href="https://wa.me/212661901873?text=Bonjour%20CHGOURI%20CAR,%20je%20vous%20contacte%20concernant%20ma%20reservation%20%23${invoiceNum}" 
             style="background-color: #25d366; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
             Discuter sur WhatsApp
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">CHGOURI CAR - Marrakech, Maroc</p>
        <p style="margin: 5px 0 0 0;">Tél : +212 6 61 90 18 73 | +212 6 67 94 73 81</p>
        <p style="margin: 5px 0 0 0;">Email : chgouricar@gmail.com | Site : www.chgouricar.com</p>
      </div>
    </div>
  `;

  // If unconfigured, print email content mock in development logs
  if (!transporter) {
    console.log('🚨 [EMAIL SERVICE - UNCONFIGURED] Simulated Booking Confirmation:');
    console.log(`➡️ Recipient: ${clientEmail} (${clientName})`);
    console.log(`➡️ Subject: ${subject}`);
    console.log(`➡️ Total Invoiced: ${totalPrice} MAD (Paid Deposit: ${depositPrice} MAD)`);
    console.log(`➡️ Invoice PDF generated with size: ${pdfBuffer.length} bytes`);
    return;
  }

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'CHGOURI CAR'}" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject,
    html: htmlContent,
    attachments: [
      {
        filename: `facture_chgouri_car_${invoiceNum}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent successfully to ${clientEmail}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send booking confirmation email:', error);
  }
};
