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
      pickupLocation 
    } = req.body;

    // 1. Basic validation
    if (!carId || !customerName || !customerPhone || !customerEmail || !pickupDate || !returnDate || !pickupLocation) {
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
    const booking = await Booking.create({
      carId,
      customerName,
      customerPhone,
      customerEmail,
      pickupDate,
      returnDate,
      pickupLocation,
      bookingStatus: 'pending'
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
