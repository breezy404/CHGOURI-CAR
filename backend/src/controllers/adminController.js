// Admin Dashboard Analytics & Operations Controller (Simplified Commercial version)
// CHGOURI CAR Marrakech Car Rental

const { Booking, Car } = require('../models');

/**
 * Fetch simplified dashboard metrics (Total cars, total bookings, pending bookings)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Cars
    const totalCars = await Car.count();

    // 2. Total Bookings Count
    const totalBookings = await Booking.count();

    // 3. Pending Bookings Count
    const pendingBookings = await Booking.count({
      where: { bookingStatus: 'pending' }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalCars,
        totalBookings,
        pendingBookings
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques analytiques.'
    });
  }
};

/**
 * Fetch all reservations for the admin inbox table
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Car, as: 'car' }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Admin fetch bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations.'
    });
  }
};

/**
 * Manually update client booking status (pending -> contacted -> confirmed -> cancelled)
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation introuvable.'
      });
    }

    if (bookingStatus) {
      const validStatuses = ['pending', 'contacted', 'confirmed', 'cancelled'];
      if (!validStatuses.includes(bookingStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Statut de réservation invalide.'
        });
      }
      booking.bookingStatus = bookingStatus;
      await booking.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Statut de la réservation mis à jour avec succès.',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation.'
    });
  }
};
