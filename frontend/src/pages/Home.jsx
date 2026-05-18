// Landing / Home Page Component
// CHGOURI CAR Marrakech Car Rental

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, MapPin, Sparkles, Shield, Compass, ChevronDown, Check } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';

export default function Home() {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();

  // Search form state
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dropoffDate, setDropoffDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [pickupLocation, setPickupLocation] = useState('Aéroport de Marrakech-Ménara');
  const [dropoffLocation, setDropoffLocation] = useState('Aéroport de Marrakech-Ménara');

  // Car fleet state
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cars`);
        if (response.data.success) {
          setCars(response.data.cars);
        }
      } catch (error) {
        console.error('Failed to load fleet:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/booking?pickupDate=${pickupDate}&returnDate=${dropoffDate}&pickupLocation=${encodeURIComponent(pickupLocation)}`);
  };

  const handleCarSelect = (car) => {
    navigate(`/booking?carId=${car.id}`);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Comment se déroule la livraison à l'Aéroport de Marrakech ?",
      a: "La livraison est 100% gratuite et simplifiée. Un agent CHGOURI CAR vous attendra à la sortie du terminal des arrivées de l'Aéroport de Marrakech-Ménara avec une pancarte à votre nom. Les formalités du contrat de location et le paiement du solde se feront sur place en moins de 10 minutes."
    },
    {
      q: "Quels sont les documents obligatoires à fournir ?",
      a: "Pour récupérer votre véhicule, vous devez obligatoirement présenter un permis de conduire original en cours de validité (plus de 2 ans d'ancienneté) et une pièce d'identité originale (passeport pour les touristes étrangers ou carte nationale d'identité)."
    },
    {
      q: "Puis-je annuler ma réservation gratuitement ?",
      a: "Oui, l'annulation de votre réservation est entièrement gratuite jusqu'à 48 heures avant l'heure prévue de prise en charge du véhicule. Vous serez intégralement remboursé de l'acompte versé."
    },
    {
      q: "Comment fonctionne le système d'acompte de 30% ?",
      a: "Afin de bloquer définitivement le véhicule dans notre calendrier, vous payez 30% du montant total de la location en ligne de manière sécurisée (simulation de la passerelle marocaine CMI). Les 70% restants seront à régler lors de la livraison à Marrakech en espèces (Dirhams / Euros) ou par carte bancaire."
    }
  ];

  return (
    <div className="relative">
      
      {/* 1. Hero Section with dynamic background */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[580px] flex items-center">
        {/* Background Image Overlay with brand styling */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=1920"
            alt="Marrakech road scenic"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
        </div>

        {/* Content container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Titles */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-1.5 text-brand-red text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Location de Voitures Économiques</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-sans tracking-tight">
              {t('heroTitle').split('Marrakech')[0]}
              <span className="text-brand-red block sm:inline">Marrakech</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-1">
                <Check size={14} className="text-brand-red" />
                <span>Assistance 24/7</span>
              </div>
              <div className="flex items-center gap-1">
                <Check size={14} className="text-brand-red" />
                <span>Kilométrage Illimité</span>
              </div>
              <div className="flex items-center gap-1">
                <Check size={14} className="text-brand-red" />
                <span>Zéro Frais Cachés</span>
              </div>
            </div>

            {/* CTA Buttons in Hero */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => navigate('/vehicles')}
                className="bg-brand-red hover:bg-brand-redAccent text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-red/20 uppercase tracking-wider"
              >
                Voir les véhicules
              </button>
              <a 
                href="https://wa.me/212661901873?text=Bonjour,%20je%20souhaite%20louer%20un%20véhicule%20chez%20CHGOURI%20CAR%20à%20Marrakech."
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-pulse bg-green-500 hover:bg-green-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 uppercase tracking-wider flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.002-5.037-2.824-6.861-1.821-1.822-4.246-2.825-6.848-2.826-5.44.001-9.865 4.37-9.869 9.732-.001 1.761.472 3.483 1.371 5.002L1.997 22l6.237-1.635z"/>
                </svg>
                Contact WhatsApp
              </a>
            </div>
          </div>

          {/* Dynamic Search Widget - Glassmorphism */}
          <div className="lg:col-span-5 w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="glass-card rounded-2xl p-6 sm:p-8 w-full border border-white/20 text-slate-800 shadow-2xl relative overflow-hidden"
            >
              <h3 className="font-extrabold text-lg text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="text-brand-red" size={20} />
                {t('searchWidgetTitle')}
              </h3>

              <div className="space-y-4">
                
                {/* Pickup Location */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                    {t('pickupLocationLabel')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-brand-red" size={16} />
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    >
                      <option value="Aéroport de Marrakech-Ménara">{t('valAirport')}</option>
                      <option value="Agence Centre-Ville">{t('valAgency')}</option>
                      <option value="Livraison à votre Hôtel">{t('valHotel')}</option>
                    </select>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                    {t('dropoffLocationLabel')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-brand-red" size={16} />
                    <select
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    >
                      <option value="Aéroport de Marrakech-Ménara">{t('valAirport')}</option>
                      <option value="Agence Centre-Ville">{t('valAgency')}</option>
                      <option value="Livraison à votre Hôtel">{t('valHotel')}</option>
                    </select>
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                      {t('pickupDateLabel')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 text-brand-red" size={16} />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                      {t('dropoffDateLabel')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 text-brand-red" size={16} />
                      <input
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full btn-primary py-4 font-bold text-sm uppercase tracking-wider rounded-xl mt-4"
                >
                  {t('searchBtn')}
                </button>

              </div>
            </form>
          </div>

        </div>
      </div>

      {/* 1.5 Services Showcase Section */}
      <div className="py-16 bg-white border-b border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-brand-blue font-extrabold text-xs uppercase tracking-widest bg-brand-blue/10 px-3.5 py-1.5 rounded-full inline-block">
              {t('servicesTitle')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Que cherchez-vous à faire aujourd'hui ?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xs md:text-sm font-medium">
              {t('servicesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Service 1: Car Rental */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-all group text-left">
              <div className="space-y-4">
                <div className="p-3 bg-brand-blue/10 rounded-2xl w-fit text-brand-blue">
                  <Compass size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {t('serviceRentalTitle')}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                  {t('serviceRentalDesc')}
                </p>
              </div>
              <button 
                onClick={() => navigate('/vehicles')}
                className="btn-blue text-xs font-bold py-3.5 px-5 rounded-xl w-fit mt-6 uppercase tracking-wider flex items-center gap-1.5"
              >
                Découvrir la flotte
              </button>
            </div>

            {/* Service 2: Tourist Circuits */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-all group text-left">
              <div className="space-y-4">
                <div className="p-3 bg-brand-red/10 rounded-2xl w-fit text-brand-red">
                  <Compass size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {t('serviceCircuitsTitle')}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                  {t('serviceCircuitsDesc')}
                </p>
              </div>
              <button 
                onClick={() => navigate('/about')}
                className="btn-primary text-xs font-bold py-3.5 px-5 rounded-xl w-fit mt-6 uppercase tracking-wider flex items-center gap-1.5"
              >
                Explorer nos circuits
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Economy Car Fleet List */}
      <div id="fleet" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('fleetTitle')}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t('fleetSubtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            <span className="text-slate-400 font-semibold text-sm">Chargement de notre flotte...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car) => {
              let carFeatures = [];
              try {
                carFeatures = Array.isArray(car.features) 
                  ? car.features 
                  : JSON.parse(car.features || "[]");
              } catch (e) {
                carFeatures = typeof car.features === 'string' ? car.features.split(',') : [];
              }

              const getFirstCarImage = (imageUrlString) => {
                let rawUrl = '';
                try {
                  if (imageUrlString && imageUrlString.startsWith('[')) {
                    const arr = JSON.parse(imageUrlString);
                    rawUrl = arr[0] || 'placeholder.jpg';
                  } else {
                    rawUrl = imageUrlString || 'placeholder.jpg';
                  }
                } catch (e) {
                  rawUrl = imageUrlString || 'placeholder.jpg';
                }
                if (rawUrl && rawUrl.startsWith('/uploads')) {
                  return `http://localhost:5000${rawUrl}`;
                }
                return rawUrl;
              };

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-premium group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  
                  {/* Photo area */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={getFirstCarImage(car.imageUrl)}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-brand-dark/95 text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {car.category}
                    </span>
                  </div>

                  {/* Body description */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 mb-1">
                        {car.brand} {car.model}
                      </h3>

                      {/* Mini attributes list */}
                      <div className="flex flex-wrap gap-2 my-4">
                        {carFeatures.slice(0, 3).map((feat, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price structure & CTA */}
                    <div className="border-t border-slate-100 pt-4 mt-4">
                      <button
                        onClick={() => handleCarSelect(car)}
                        className="w-full text-center bg-brand-red/5 hover:bg-brand-red text-brand-red hover:text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 uppercase tracking-wider block"
                      >
                        {t('btnSelect')}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Why Choose Us Section */}
      <div id="why-us" className="bg-slate-900 py-20 text-white scroll-mt-20 relative overflow-hidden">
        
        {/* Visual premium background nodes */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-red-800/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t('whyTitle')}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              {t('whySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Box 1 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-8 space-y-4 hover:border-brand-red/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                <Compass size={24} />
              </div>
              <h3 className="font-extrabold text-lg">{t('why1Title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t('why1Desc')}</p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-8 space-y-4 hover:border-brand-red/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                <Shield size={24} />
              </div>
              <h3 className="font-extrabold text-lg">{t('why2Title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t('why2Desc')}</p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-8 space-y-4 hover:border-brand-red/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                <Sparkles size={24} />
              </div>
              <h3 className="font-extrabold text-lg">{t('why3Title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t('why3Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Accordion FAQ Section */}
      <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Foire Aux Questions (FAQ)
          </h2>
          <p className="text-slate-400 text-sm">
            Tout ce qu'il faut savoir avant de louer votre voiture économique à Marrakech
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-brand-red transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180 text-brand-red' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-slate-500 text-sm border-t border-slate-50 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
