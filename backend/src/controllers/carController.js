// Car Fleet Controller (List, Details, Admin CRUD)
// CHGOURI CAR Marrakech Car Rental

const { Car, AvailabilityCalendar } = require('../models');
const { Op } = require('sequelize');

/**
 * List all active economy cars (supports date range filters & price limits)
 */
exports.getAllCars = async (req, res) => {
  try {
    const { startDate, endDate, maxPrice, status } = req.query;

    const queryOptions = {
      where: {
        status: status || 'active'
      }
    };

    // 1. Price Filtering
    if (maxPrice) {
      queryOptions.where.pricePerDay = {
        [Op.lte]: parseFloat(maxPrice)
      };
    }

    // 2. Real-Time Availability date filtering
    // If startDate and endDate are provided, we filter out cars that have any 'booked' or 'maintenance' lock during this range.
    if (startDate && endDate) {
      // Find all car IDs that are occupied
      const occupiedLocks = await AvailabilityCalendar.findAll({
        attributes: ['carId'],
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          },
          status: {
            [Op.in]: ['booked', 'maintenance']
          }
        },
        raw: true
      });

      const occupiedCarIds = occupiedLocks.map(lock => lock.carId);

      if (occupiedCarIds.length > 0) {
        queryOptions.where.id = {
          [Op.notIn]: occupiedCarIds
        };
      }
    }

    const cars = await Car.findAll(queryOptions);

    return res.status(200).json({
      success: true,
      count: cars.length,
      cars
    });
  } catch (error) {
    console.error('Error fetching cars list:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des véhicules.'
    });
  }
};

/**
 * Get single car details
 */
exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule introuvable.'
      });
    }

    return res.status(200).json({
      success: true,
      car
    });
  } catch (error) {
    console.error('Error fetching single car:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération du véhicule.'
    });
  }
};

/**
 * Create a new car (Admin Only)
 */
exports.createCar = async (req, res) => {
  try {
    const { brand, model, year, category, pricePerDay, pricePerWeek, pricePerMonth, imageUrl, features } = req.body;

    if (!brand || !model) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner toutes les caractéristiques obligatoires du véhicule (Marque, Modèle).'
      });
    }

    let finalImageUrl = imageUrl || '';
    if (req.files && req.files.length > 0) {
      const fileUrls = req.files.map(file => file.path);
      finalImageUrl = JSON.stringify(fileUrls);
    }

    let parsedFeatures = features || [];
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(f => f.trim()).filter(Boolean);
      }
    }

    const newCar = await Car.create({
      brand,
      model,
      year: year ? parseInt(year) : 2026,
      category: category || 'Economy',
      pricePerDay: pricePerDay ? parseFloat(pricePerDay) : 0,
      pricePerWeek: pricePerWeek ? parseFloat(pricePerWeek) : 0,
      pricePerMonth: pricePerMonth ? parseFloat(pricePerMonth) : 0,
      imageUrl: finalImageUrl,
      features: parsedFeatures,
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Véhicule ajouté avec succès !',
      car: newCar
    });
  } catch (error) {
    console.error('Error adding car:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'ajout du véhicule.'
    });
  }
};

/**
 * Edit car specifications (Admin Only)
 */
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule introuvable.'
      });
    }

    const { brand, model, year, category, pricePerDay, pricePerWeek, pricePerMonth, imageUrl, features, status } = req.body;

    let finalImageUrl = imageUrl;
    if (req.files && req.files.length > 0) {
      const fileUrls = req.files.map(file => file.path);
      finalImageUrl = JSON.stringify(fileUrls);
    }

    let parsedFeatures = features;
    if (features !== undefined) {
      if (typeof features === 'string') {
        try {
          parsedFeatures = JSON.parse(features);
        } catch (e) {
          parsedFeatures = features.split(',').map(f => f.trim()).filter(Boolean);
        }
      }
    }

    await car.update({
      brand: brand !== undefined ? brand : car.brand,
      model: model !== undefined ? model : car.model,
      year: year !== undefined && year !== '' ? parseInt(year) : car.year,
      category: category !== undefined ? category : car.category,
      pricePerDay: pricePerDay !== undefined && pricePerDay !== '' ? parseFloat(pricePerDay) : car.pricePerDay,
      pricePerWeek: pricePerWeek !== undefined && pricePerWeek !== '' ? parseFloat(pricePerWeek) : car.pricePerWeek,
      pricePerMonth: pricePerMonth !== undefined && pricePerMonth !== '' ? parseFloat(pricePerMonth) : car.pricePerMonth,
      imageUrl: finalImageUrl !== undefined ? finalImageUrl : car.imageUrl,
      features: parsedFeatures !== undefined ? parsedFeatures : car.features,
      status: status !== undefined ? status : car.status
    });

    return res.status(200).json({
      success: true,
      message: 'Véhicule mis à jour avec succès !',
      car
    });
  } catch (error) {
    console.error('Error updating car:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour du véhicule.'
    });
  }
};

/**
 * Delete / Archive car (Admin Only)
 */
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule introuvable.'
      });
    }

    // Instead of deleting from DB which breaks historical bookings, we archive the car by setting status to 'retired'
    await car.update({ status: 'retired' });

    return res.status(200).json({
      success: true,
      message: 'Véhicule archivé avec succès (le statut a été défini sur retraité).'
    });
  } catch (error) {
    console.error('Error archiving car:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'archivage du véhicule.'
    });
  }
};
