// Vehicles Page Component (Fleet Catalog with Multi-Image Sliders and Filters)
// CHGOURI CAR Marrakech Car Rental

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../context/AuthContext';
import { normalizeImages } from '../utils/imageHelper';
import { ChevronLeft, ChevronRight, Check, Compass, Eye, Filter, CalendarCheck, RotateCcw } from 'lucide-react';

// Sub-component to manage independent active image index states for each vehicle card
function CarCard({ car, onReserve, t }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const images = normalizeImages(car.imageUrl);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Safe parsing of features array
  const getFeatures = () => {
    try {
      if (typeof car.features === 'string') {
        return JSON.parse(car.features || '[]');
      }
      return car.features || [];
    } catch (e) {
      return [];
    }
  };

  const features = getFeatures();

  // Mapping specs from features array
  const hasAc = features.some(f => f.toLowerCase().includes('clim'));
  const isAuto = features.some(f => f.toLowerCase().includes('auto'));
  const isDiesel = features.some(f => f.toLowerCase().includes('diesel'));
  
  // Extract seats count (looks for number followed by "places" or "seats")
  const seatsMatch = features.find(f => f.toLowerCase().includes('place') || f.toLowerCase().includes('seat'));
  const seats = seatsMatch ? seatsMatch : "5 Places";

  // Pre-fill WhatsApp message text
  const whatsappText = `Bonjour, je souhaite me renseigner pour louer le véhicule ${car.brand} ${car.model} à Marrakech.`;
  const whatsappUrl = `https://wa.me/212661901873?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group">
      
      {/* Dynamic Image Carousel Frame */}
      <div className="relative h-56 overflow-hidden bg-slate-50">
        <img 
          src={images[activeImgIndex]} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-102"
        />

        {/* Carousel overlay selectors */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-1.5 rounded-full z-20 shadow backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-1.5 rounded-full z-20 shadow backdrop-blur-sm transition-all"
            >
              <ChevronRight size={16} />
            </button>

            {/* Micro Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    idx === activeImgIndex ? 'bg-brand-blue w-3' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-brand-dark/80 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm z-15">
          {car.category}
        </div>
      </div>

      {/* Vehicle Specs and Actions Frame */}
      <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
        
        {/* Model Title */}
        <div className="space-y-1">
          <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
            {car.brand} <span className="text-slate-500 font-medium">{car.model}</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            CHGOURI CAR Marrakech
          </span>
        </div>

        {/* Specifications grids */}
        <div className="grid grid-cols-2 gap-2.5 text-[11px] font-semibold text-slate-500">
          <div className="bg-slate-50 px-3 py-2 border border-slate-100 rounded-xl flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue"></span>
            <span>{t('specTransmission')} : {isAuto ? t('featuresAuto') : t('featuresManual')}</span>
          </div>
          <div className="bg-slate-50 px-3 py-2 border border-slate-100 rounded-xl flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue"></span>
            <span>{seats}</span>
          </div>
          <div className="bg-slate-50 px-3 py-2 border border-slate-100 rounded-xl flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue"></span>
            <span>{t('specAc')} : {hasAc ? "Oui" : "Non"}</span>
          </div>
          <div className="bg-slate-50 px-3 py-2 border border-slate-100 rounded-xl flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue"></span>
            <span>{isDiesel ? t('featuresDiesel') : t('featuresEssence')}</span>
          </div>
        </div>

        {/* Buttons actions */}
        <div className="flex gap-2 pt-2">
          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition-colors"
            title="Contact Direct WhatsApp"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.002-5.037-2.824-6.861-1.821-1.822-4.246-2.825-6.848-2.826-5.44.001-9.865 4.37-9.869 9.732-.001 1.761.472 3.483 1.371 5.002L1.997 22l6.237-1.635z"/>
            </svg>
          </a>

          {/* Reserve now */}
          <button
            onClick={() => onReserve(car)}
            className="flex-grow bg-brand-red hover:bg-brand-redAccent text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-brand-red/10 transition-all flex items-center justify-center gap-1.5"
          >
            <CalendarCheck size={14} />
            {t('btnReserveNow')}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function Vehicles() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // State elements
  const [fleet, setFleet] = useState([]);
  const [filteredFleet, setFilteredFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering criteria states
  const [filterBox, setFilterBox] = useState('all'); // 'all' | 'manual' | 'auto'
  const [filterFuel, setFilterFuel] = useState('all'); // 'all' | 'petrol' | 'diesel'

  // Fetch all active cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/cars`, { params: { status: 'active' } });
        if (res.data.success) {
          setFleet(res.data.cars);
          setFilteredFleet(res.data.cars);
        }
      } catch (err) {
        console.error('Cars fetch error:', err);
        setError(`Erreur: ${err.message}. Détails: ${err.response?.data?.message || 'Aucun détail du serveur'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Sync filters whenever criteria changes
  useEffect(() => {
    let result = [...fleet];

    // 1. Transmission Filter
    if (filterBox === 'manual') {
      result = result.filter(car => {
        let featuresArray = [];
        try { featuresArray = typeof car.features === 'string' ? JSON.parse(car.features) : (car.features || []); } 
        catch (e) { featuresArray = typeof car.features === 'string' ? car.features.split(',') : []; }
        return featuresArray.some(f => f.toLowerCase().includes('manuelle') || f.toLowerCase().includes('manual'));
      });
    } else if (filterBox === 'auto') {
      result = result.filter(car => {
        let featuresArray = [];
        try { featuresArray = typeof car.features === 'string' ? JSON.parse(car.features) : (car.features || []); } 
        catch (e) { featuresArray = typeof car.features === 'string' ? car.features.split(',') : []; }
        return featuresArray.some(f => f.toLowerCase().includes('auto'));
      });
    }

    // 2. Fuel Filter
    if (filterFuel === 'petrol') {
      result = result.filter(car => {
        let featuresArray = [];
        try { featuresArray = typeof car.features === 'string' ? JSON.parse(car.features) : (car.features || []); } 
        catch (e) { featuresArray = typeof car.features === 'string' ? car.features.split(',') : []; }
        return featuresArray.some(f => f.toLowerCase().includes('essence') || f.toLowerCase().includes('petrol'));
      });
    } else if (filterFuel === 'diesel') {
      result = result.filter(car => {
        let featuresArray = [];
        try { featuresArray = typeof car.features === 'string' ? JSON.parse(car.features) : (car.features || []); } 
        catch (e) { featuresArray = typeof car.features === 'string' ? car.features.split(',') : []; }
        return featuresArray.some(f => f.toLowerCase().includes('diesel'));
      });
    }

    setFilteredFleet(result);
  }, [filterBox, filterFuel, fleet]);

  // Clean filters
  const handleClearFilters = () => {
    setFilterBox('all');
    setFilterFuel('all');
  };

  // Redirect to simplified reservation form pre-selecting car
  const handleReserveCar = (car) => {
    navigate(`/booking?carId=${car.id}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-brand-blue font-extrabold text-xs uppercase tracking-widest bg-brand-blue/10 px-3.5 py-1.5 rounded-full inline-block">
            {t('navFleet')}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            {t('vehiclesTitle')}
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            {t('vehiclesSubtitle')}
          </p>
        </div>

        {/* Search and Filters Bar Component */}
        <div className="bg-white border border-slate-100 shadow-premium p-6 rounded-3xl space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            
            {/* Transmission filter button */}
            <div className="flex flex-col gap-1.5">
              <span>{t('filterTransmission')}</span>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setFilterBox('all')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                    filterBox === 'all' ? 'bg-brand-blue text-white shadow-sm' : 'hover:text-brand-blue'
                  }`}
                >
                  {t('filterAll')}
                </button>
                <button
                  onClick={() => setFilterBox('manual')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                    filterBox === 'manual' ? 'bg-brand-blue text-white shadow-sm' : 'hover:text-brand-blue'
                  }`}
                >
                  {t('filterTransmissionManual')}
                </button>
                <button
                  onClick={() => setFilterBox('auto')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                    filterBox === 'auto' ? 'bg-brand-blue text-white shadow-sm' : 'hover:text-brand-blue'
                  }`}
                >
                  {t('filterTransmissionAuto')}
                </button>
              </div>
            </div>

            {/* Fuel filter button */}
            <div className="flex flex-col gap-1.5">
              <span>{t('filterFuel')}</span>
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setFilterFuel('all')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                    filterFuel === 'all' ? 'bg-brand-blue text-white shadow-sm' : 'hover:text-brand-blue'
                  }`}
                >
                  {t('filterAll')}
                </button>
                <button
                  onClick={() => setFilterFuel('petrol')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                    filterFuel === 'petrol' ? 'bg-brand-blue text-white shadow-sm' : 'hover:text-brand-blue'
                  }`}
                >
                  {t('filterFuelPetrol')}
                </button>
                <button
                  onClick={() => setFilterFuel('diesel')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                    filterFuel === 'diesel' ? 'bg-brand-blue text-white shadow-sm' : 'hover:text-brand-blue'
                  }`}
                >
                  {t('filterFuelDiesel')}
                </button>
              </div>
            </div>

          </div>

          {/* Reset button */}
          {(filterBox !== 'all' || filterFuel !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-red border border-brand-red/20 hover:border-brand-red bg-brand-red/5 px-4 py-2.5 rounded-xl transition-all uppercase leading-none"
            >
              <RotateCcw size={13} />
              {t('filterClear')}
            </button>
          )}
        </div>

        {/* Catalog list grids */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-blue"></div>
            <span className="text-slate-400 font-bold text-sm">Chargement du catalogue CHGOURI CAR...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-2xl text-xs font-semibold text-brand-red text-center">
            {error}
          </div>
        ) : filteredFleet.length === 0 ? (
          <div className="bg-white border border-slate-100 shadow-premium p-12 rounded-3xl text-center space-y-3">
            <Compass className="text-slate-300 mx-auto" size={48} />
            <h3 className="font-extrabold text-slate-800 text-base">{t('noCarsFound')}</h3>
            <button
              onClick={handleClearFilters}
              className="btn-secondary py-2 px-4 text-xs font-bold"
            >
              {t('filterClear')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredFleet.map(car => (
              <CarCard 
                key={car.id} 
                car={car} 
                onReserve={handleReserveCar} 
                t={t}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
