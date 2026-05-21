// Booking Controller & Reservation Engine (Simplified Commercial version)
// CHGOURI CAR Marrakech Car Rental

const { Booking, Car } = require('../models');

/**
 * Create a new public booking request without client login/registration
 */
exports.createBooking = async (req, res) => {
  try {
    const { 
      carId, 
      customerName, 
      customerPhone, 
      customerEmail, 
      pickupDate, 
      returnDate, 
      pickupLocation,
      returnLocation
    } = req.body;

    // 1. Basic validation
    if (!carId || !customerName || !customerPhone || !customerEmail || !pickupDate || !returnDate || !pickupLocation || !returnLocation) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires du formulaire.'
      });
    }

    // 2. Fetch and validate car
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Le véhicule sélectionné n\'existe pas ou n\'est plus disponible.'
      });
    }

    // 3. Create booking record (pending by default)
    // Calculate total amount
    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);
    const days = Math.max(1, Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24)));
    const totalAmount = days * car.pricePerDay;

    const booking = await Booking.create({
      carId,
      customerName,
      customerPhone,
      customerEmail,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      totalAmount,
      bookingStatus: 'pending'
    });

    // Fetch the booking with associated Car for the email
    const bookingWithCar = await Booking.findByPk(booking.id, { include: ['car'] });

    // Send the email asynchronously
    const emailService = require('../services/emailService');
    
    // Email to Client
    emailService.sendBookingRequestEmail(bookingWithCar, days).catch(err => {
      console.error('Failed to send booking request email to client:', err);
    });

    // Email to Admin
    emailService.sendAdminNewBookingEmail(bookingWithCar, days).catch(err => {
      console.error('Failed to send booking notification to admin:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Votre demande de réservation a été enregistrée avec succès. Notre équipe vous contactera sous peu pour finaliser les détails.',
      bookingId: booking.id
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'enregistrement de votre demande de réservation.'
    });
  }
};
