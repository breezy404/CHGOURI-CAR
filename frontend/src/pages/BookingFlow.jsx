// Simple & Clean Reservation Request Component
// CHGOURI CAR Marrakech Car Rental

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, User, Phone, Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../context/AuthContext';
import { normalizeImages } from '../utils/imageHelper';

export default function BookingFlow() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const urlCarId = searchParams.get('carId');

  // Form Fields
  const [formData, setFormData] = useState({
    carId: urlCarId || '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Aéroport de Marrakech-Ménara ✈️'
  });

  // State Management
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch active fleet cars for the dropdown list
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/cars`, { params: { status: 'active' } })
      .then(res => {
        if (res.data.success) {
          setCars(res.data.cars);
          // If a car ID was pre-selected in URL, set the selected car details
          if (urlCarId) {
            const preCar = res.data.cars.find(c => c.id.toString() === urlCarId.toString());
            if (preCar) {
              setSelectedCar(preCar);
              setFormData(prev => ({ ...prev, carId: preCar.id.toString() }));
            }
          }
        }
      })
      .catch(err => {
        console.error('Failed to load fleet cars:', err);
        setErrorMsg('Impossible de récupérer la liste des véhicules.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlCarId]);

  // Update selected car summary card when selection changes
  const handleCarChange = (e) => {
    const cid = e.target.value;
    setFormData(prev => ({ ...prev, carId: cid }));
    const preCar = cars.find(c => c.id.toString() === cid.toString());
    setSelectedCar(preCar || null);
  };

  // Submit reservation form to public api
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    if (!formData.carId) {
      setErrorMsg('Veuillez sélectionner un véhicule dans la liste.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/bookings`, formData);
      if (res.data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.data.message || 'Une erreur est survenue lors de l\'enregistrement.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Erreur de connexion avec le serveur. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate dynamic WhatsApp message link for this booking
  const getWhatsAppLink = () => {
    const carName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : 'Voiture';
    const datesStr = formData.pickupDate && formData.returnDate ? `${formData.pickupDate} au ${formData.returnDate}` : 'dates flexibles';
    const text = `Bonjour, je veux réserver cette voiture:\nCar: ${carName}\nDates: ${datesStr}\nLocation: Marrakech`;
    return `https://wa.me/212661901873?text=${encodeURIComponent(text)}`;
  };

  const getFirstCarImage = (imageUrlString) => {
    return normalizeImages(imageUrlString)[0];
  };

  if (submitted) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6 mx-4">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-[#265fad] mx-auto border-2 border-green-100 scale-105 animate-bounce">
            <CheckCircle2 size={48} className="text-[#265fad]" />
          </div>
          
          <h3 className="text-2xl font-extrabold text-slate-900">
            Demande Reçue !
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed">
            Merci <strong>{formData.customerName}</strong>. Votre demande de réservation a été enregistrée avec succès. Notre équipe vous contactera sous peu par téléphone ou WhatsApp pour valider la disponibilité.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <div><span className="font-bold">Client :</span> {formData.customerName}</div>
            <div><span className="font-bold">Véhicule :</span> {selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : 'Voiture'}</div>
            <div><span className="font-bold">Départ :</span> {formData.pickupDate}</div>
            <div><span className="font-bold">Retour :</span> {formData.returnDate}</div>
            <div><span className="font-bold">Lieu de prise :</span> {formData.pickupLocation}</div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Finaliser via WhatsApp 🟢
            </a>
            
            <Link
              to="/"
              className="text-slate-400 hover:text-brand-red text-xs font-semibold underline"
            >
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Réserver Votre Véhicule</h2>
          <p className="text-slate-500 text-sm mt-1">
            Remplissez ce formulaire simple. Notre équipe vous recontactera manuellement sous 10 minutes.
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-xl mb-6 text-sm font-semibold text-brand-red">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form container */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Car Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Choisir la voiture</label>
                {loading ? (
                  <div className="w-full bg-slate-50 h-10 animate-pulse rounded-xl"></div>
                ) : (
                  <select
                    value={formData.carId}
                    onChange={handleCarChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                  >
                    <option value="">-- Sélectionnez un véhicule --</option>
                    {cars.map(c => (
                       <option key={c.id} value={c.id.toString()}>
                        {c.brand} {c.model}
                       </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      required
                      placeholder="Ex: Mohamed Alami"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Téléphone (WhatsApp)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        required
                        placeholder="Ex: +212 600-000000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Adresse E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        required
                        placeholder="alami@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates & Locations */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Date de Départ</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                      <input
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Date de Retour</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Lieu de prise en charge</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:border-brand-blue"
                    >
                      <option value="Aéroport de Marrakech-Ménara ✈️">Aéroport de Marrakech-Ménara ✈️</option>
                      <option value="Gare Ferroviaire de Marrakech 🚊">Gare Ferroviaire de Marrakech 🚊</option>
                      <option value="Gueliz Centre-ville 🏢">Gueliz Centre-ville 🏢</option>
                      <option value="Livraison Hôtel / Riad 🏨">Livraison Hôtel / Riad 🏨</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-red hover:bg-brand-redAccent text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-wider"
              >
                {submitting ? 'Traitement...' : 'Soumettre ma Demande'}
                <ChevronRight size={16} />
              </button>

            </form>
          </div>

          {/* Sidebar Selected Car Details */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2 uppercase tracking-wider">
              Véhicule Sélectionné
            </h3>

            {selectedCar ? (
              <div className="space-y-4">
                <img
                  src={getFirstCarImage(selectedCar.imageUrl)}
                  alt={selectedCar.brand}
                  className="w-full h-40 object-cover rounded-xl bg-slate-50"
                />
                
                <div className="space-y-1">
                  <h4 className="font-extrabold text-lg text-slate-900">{selectedCar.brand} {selectedCar.model}</h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase">{selectedCar.category}</p>
                </div>

                <p className="text-xs text-slate-400 italic">
                  💡 L'assistance et la livraison à l'aéroport sont entièrement gratuites.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                Aucun véhicule sélectionné. Veuillez en choisir un dans la liste à gauche.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
