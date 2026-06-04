// Admin Portal Component (Analytics, Bookings, Fleet CRUD, Messages)
// CHGOURI CAR Marrakech Car Rental

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../context/AuthContext';
import { normalizeImages } from '../utils/imageHelper';
import {
  LayoutDashboard,
  Car,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Mail,
  Upload,
  Calendar,
  MapPin,
  User,
  Phone,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import OTPInput from '../components/OTPInput';

// Feature options organized by category for the vehicle form chip selector
const FEATURES_OPTIONS = [
  { label: 'Transmission', icon: '⚙️', options: ['Manuelle', 'Automatique'] },
  { label: 'Carburant', icon: '⛽', options: ['Essence', 'Diesel'] },
  { label: 'Confort', icon: '❄️', options: ['Climatisation'] },
  { label: 'Capacité', icon: '👥', options: ['2 Places', '4 Places', '5 Places', '7 Places', '8 Places', '9 Places'] },

];

function AdminCarCard({ car, startEditCar, handleDeleteCar }) {
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

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="relative h-40 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <img
          src={images[activeImgIndex]}
          alt={car.brand}
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-1 rounded-full z-20 shadow backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-1 rounded-full z-20 shadow backdrop-blur-sm transition-all"
            >
              <ChevronRight size={14} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 w-1 rounded-full transition-all ${idx === activeImgIndex ? 'bg-brand-red w-2.5' : 'bg-slate-300'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-black text-slate-900 text-sm">{car.brand} {car.model}</h4>
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-50">
          <button
            onClick={() => startEditCar(car)}
            className="flex-grow flex items-center justify-center gap-1 text-slate-600 bg-slate-100 hover:bg-slate-200/80 py-2 rounded-xl text-[10px] font-extrabold transition-all"
          >
            <Edit size={12} />
            Modifier
          </button>
          <button
            onClick={() => handleDeleteCar(car.id)}
            className="flex-grow flex items-center justify-center gap-1 text-brand-red bg-red-50 hover:bg-red-100 py-2 rounded-xl text-[10px] font-extrabold transition-all"
          >
            <Trash2 size={12} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, token } = useAuth();

  // Dashboard Sub-Section views
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'bookings' | 'fleet' | 'messages' | 'settings'

  // Settings State
  const [emailChangeStep, setEmailChangeStep] = useState(0);
  const [newEmail, setNewEmail] = useState('');
  const [emailChangeOtp, setEmailChangeOtp] = useState('');

  // Global State data
  const [stats, setStats] = useState({ totalCars: 0, totalBookings: 0, pendingBookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fleet Car CRUD Modals State
  const [showCarModal, setShowCarModal] = useState(false);
  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    year: 2026,
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    imageUrl: '',
    features: ['Climatisation', 'Manuelle', 'Essence', '5 Places']
  });
  const [editingCarId, setEditingCarId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch Dashboard Stats Metrics
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/stats`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Impossible de charger les statistiques.');
    }
  };

  // Fetch Booking Inquiries
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/bookings`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Impossible de charger les réservations.');
    }
  };

  // Fetch Fleet list
  const fetchFleet = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cars`);
      if (res.data.success) {
        setFleet(res.data.cars);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Impossible de charger la flotte de véhicules.');
    }
  };

  // Fetch Client Contact Messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/messages`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Impossible de charger les messages clients.');
    }
  };

  // Load initial active tab data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      try {
        await Promise.all([
          fetchStats(),
          fetchBookings(),
          fetchFleet(),
          fetchMessages()
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync data refresh helper
  const handleRefresh = async () => {
    setActionLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchBookings(),
        fetchFleet(),
        fetchMessages()
      ]);
      setSuccessMessage('Données actualisées en temps réel.');
    } catch (err) {
      setErrorMessage('Erreur lors de la synchronisation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message client ?')) return;

    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await axios.delete(`${API_BASE_URL}/messages/${messageId}`);
      if (res.data.success) {
        setSuccessMessage(res.data.message);
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erreur lors de la suppression du message.');
    } finally {
      setActionLoading(false);
    }
  };

  // Multer Multi-file Upload for Fleet Photos
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles(files);
    setSuccessMessage(`${files.length} photo(s) sélectionnée(s) avec succès.`);
  };

  // Create or Update Car CRUD
  const handleCarSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('brand', carForm.brand || '');
    formData.append('model', carForm.model || '');
    formData.append('year', carForm.year || 2026);
    formData.append('pricePerDay', carForm.pricePerDay || 0);
    formData.append('pricePerWeek', carForm.pricePerWeek || 0);
    formData.append('pricePerMonth', carForm.pricePerMonth || 0);
    formData.append('imageUrl', carForm.imageUrl || '');

    // Features is already an array — stringify for backend
    const formattedFeatures = Array.isArray(carForm.features) ? carForm.features.filter(Boolean) : [];
    formData.append('features', JSON.stringify(formattedFeatures));

    // Append all selected image files under the 'images' key
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      let res;
      if (editingCarId) {
        // UPDATE
        res = await axios.put(`${API_BASE_URL}/cars/${editingCarId}`, formData);
      } else {
        // CREATE
        res = await axios.post(`${API_BASE_URL}/cars`, formData);
      }

      if (res.data.success) {
        setSuccessMessage(res.data.message);
        setShowCarModal(false);
        setCarForm({
          brand: '',
          model: '',
          year: 2026,
          pricePerDay: 0,
          pricePerWeek: 0,
          pricePerMonth: 0,
          imageUrl: '',
          features: ['Climatisation', 'Manuelle', 'Essence', '5 Places']
        });
        setSelectedFiles([]);
        setEditingCarId(null);
        fetchFleet();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Erreur lors de l\'enregistrement du véhicule.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal pre-filled with selected car data
  const startEditCar = (car) => {
    setEditingCarId(car.id);
    setSelectedFiles([]);
    let featuresArr = [];
    if (car.features) {
      if (Array.isArray(car.features)) {
        featuresArr = car.features;
      } else if (typeof car.features === 'string') {
        try {
          const parsed = JSON.parse(car.features);
          if (Array.isArray(parsed)) {
            featuresArr = parsed;
          } else {
            featuresArr = car.features.split(',').map(f => f.trim()).filter(Boolean);
          }
        } catch (e) {
          featuresArr = car.features.split(',').map(f => f.trim()).filter(Boolean);
        }
      }
    }

    setCarForm({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || 2026,
      pricePerDay: car.pricePerDay || 0,
      pricePerWeek: car.pricePerWeek || 0,
      pricePerMonth: car.pricePerMonth || 0,
      imageUrl: car.imageUrl || '',
      features: featuresArr
    });
    setShowCarModal(true);
  };

  // Delete Car CRUD
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?')) return;

    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await axios.delete(`${API_BASE_URL}/cars/${carId}`);
      if (res.data.success) {
        setSuccessMessage(res.data.message);
        fetchFleet();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Erreur lors de la suppression du véhicule.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle booking inquiry status (pending -> contacted -> confirmed -> cancelled)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await axios.put(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
        bookingStatus: newStatus
      });

      if (res.data.success) {
        setSuccessMessage('Statut de la réservation mis à jour.');
        fetchBookings();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Impossible de modifier le statut de la réservation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Request Email Change
  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    setActionLoading(true); setErrorMessage(''); setSuccessMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/request-email-change`, { newEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(res.data.message);
      setEmailChangeStep(1);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Erreur réseau.');
    } finally {
      setActionLoading(false);
    }
  };

  // Verify Email Change
  const handleVerifyEmailChange = async (e) => {
    e.preventDefault();
    setActionLoading(true); setErrorMessage(''); setSuccessMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-email-change`, { newEmail, otp: emailChangeOtp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('E-mail changé avec succès. Veuillez vous reconnecter avec votre nouvelle adresse.');
      setEmailChangeStep(0);
      setNewEmail('');
      setEmailChangeOtp('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Code invalide.');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleFeature = (feature) => {
    setCarForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const getFirstCarImage = (imageUrlString) => {
    return normalizeImages(imageUrlString)[0];
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen text-left font-admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Console CHGOURI CAR 🛠️</h1>
            <p className="text-slate-500 text-xs font-semibold uppercase mt-0.5 tracking-wider">
              Espace d'Administration • Marrakech, Maroc
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={actionLoading || loading}
            className="flex items-center gap-2 bg-brand-blue text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <RefreshCw size={14} className={actionLoading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Global Action Notifications Banner */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-[#265fad] p-4 rounded-xl text-xs font-bold text-[#265fad]">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-xl text-xs font-bold text-brand-red">
            {errorMessage}
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto bg-white p-1.5 border border-slate-100 rounded-2xl shadow-sm gap-1 no-scrollbar" style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl transition-all shrink-0 whitespace-nowrap ${activeTab === 'stats' ? 'bg-brand-red text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <LayoutDashboard size={14} />
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl transition-all relative shrink-0 whitespace-nowrap ${activeTab === 'bookings' ? 'bg-brand-red text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Calendar size={14} />
            Réservations Inscrits
            {stats.pendingBookings > 0 && (
              <span className="bg-brand-blue text-white text-[9px] font-black h-4 px-1.5 rounded-full flex items-center justify-center animate-pulse">
                {stats.pendingBookings}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl transition-all shrink-0 whitespace-nowrap ${activeTab === 'fleet' ? 'bg-brand-red text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Car size={14} />
            Gestion Flotte
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl transition-all shrink-0 whitespace-nowrap ${activeTab === 'messages' ? 'bg-brand-red text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Mail size={14} />
            Messages Clients
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold rounded-xl transition-all shrink-0 whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-red text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <SlidersHorizontal size={14} />
            Paramètres
          </button>
        </div>

        {/* Loading Overlay */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div>
            <span className="text-slate-400 font-bold text-xs uppercase">Chargement de la base de données...</span>
          </div>
        ) : (
          <div className="space-y-6">

            {/* TAB 1: Analytics / stats summary */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* 3 cards stats widget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                  {/* Card Total Cars */}
                  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                      <Car size={24} />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase">Flotte Active</span>
                      <span className="text-2xl font-black text-slate-800">{stats.totalCars}</span>
                    </div>
                  </div>

                  {/* Card Total Bookings */}
                  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      <LayoutDashboard size={24} />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase">Total Demandes</span>
                      <span className="text-2xl font-black text-slate-800">{stats.totalBookings}</span>
                    </div>
                  </div>

                  {/* Card Pending */}
                  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                      <RefreshCw size={24} />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase">En Attente</span>
                      <span className="text-2xl font-black text-slate-800">{stats.pendingBookings}</span>
                    </div>
                  </div>

                </div>

                {/* Short Manual Instruction Guide */}
                <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-50 pb-2">Guide d'Opérations CHGOURI CAR</h3>
                  <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                    <p>🟢 <strong>Flux Simplifié :</strong> Les réservations entrantes s'affichent sous l'onglet "Réservations". Prenez contact avec les clients directement via leur numéro de téléphone ou WhatsApp.</p>
                    <p>🔵 <strong>Mises à jour :</strong> Une fois le client contacté ou la réservation validée, modifiez manuellement le statut de la demande pour une meilleure gestion d'équipe.</p>
                    <p>🔴 <strong>Image de Flotte :</strong> Pour téléverser des images de voitures sur le serveur local, utilisez le bouton "Téléverser Image" dans le formulaire de véhicule.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Bookings Inbox List */}
            {activeTab === 'bookings' && (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-800">Inbox des Réservations</h3>
                  <span className="text-xs text-slate-400 font-bold">{bookings.length} demande(s) enregistrée(s)</span>
                </div>

                {bookings.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-semibold text-xs">
                    Aucune demande de réservation reçue pour le moment.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-100">
                          <th className="py-3.5 px-5">ID Ref</th>
                          <th className="py-3.5 px-5">Client Details</th>
                          <th className="py-3.5 px-5">Voiture</th>
                          <th className="py-3.5 px-5">Dates & Lieu</th>
                          <th className="py-3.5 px-5 text-center">Statut</th>
                          <th className="py-3.5 px-5 text-center">Action de Changement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(book => (
                          <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-5 font-bold text-slate-800">#{book.id}</td>
                            <td className="py-4 px-5 space-y-1">
                              <div className="font-extrabold text-slate-900 text-sm">{book.customerName}</div>
                              <div className="text-slate-500 font-medium">{book.customerEmail}</div>
                              <div className="text-brand-blue font-bold flex items-center gap-1">
                                <Phone size={12} /> {book.customerPhone}
                              </div>
                            </td>
                            <td className="py-4 px-5 font-bold text-slate-700">
                              {book.car ? `${book.car.brand} ${book.car.model}` : 'Véhicule supprimé'}
                            </td>
                            <td className="py-4 px-5 space-y-1">
                              <div className="font-extrabold text-slate-800">{book.pickupDate} au {book.returnDate}</div>
                              <div className="text-slate-400 font-semibold flex flex-col gap-1 mt-1 text-[10px]">
                                <span className="flex items-center gap-1"><MapPin size={10} /> Livr: {book.pickupLocation}</span>
                                <span className="flex items-center gap-1"><MapPin size={10} /> Récup: {book.returnLocation || book.pickupLocation}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <span className={`inline-block font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg border ${book.bookingStatus === 'pending'
                                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                                  : book.bookingStatus === 'contacted'
                                    ? 'bg-blue-50 text-brand-blue border-blue-200'
                                    : book.bookingStatus === 'confirmed'
                                      ? 'bg-green-50 text-emerald-600 border-green-200'
                                      : 'bg-red-50 text-brand-red border-red-200'
                                }`}>
                                {book.bookingStatus}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <select
                                value={book.bookingStatus}
                                onChange={(e) => handleUpdateBookingStatus(book.id, e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-[10px] font-bold focus:outline-none focus:border-brand-blue"
                              >
                                <option value="pending">En Attente</option>
                                <option value="contacted">Client Contacté</option>
                                <option value="confirmed">Confirmé</option>
                                <option value="cancelled">Annulé</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Fleet Management CRUD */}
            {activeTab === 'fleet' && (
              <div className="space-y-6">

                {/* Fleet action bar */}
                <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-slate-800">Gestion de la Flotte</h3>
                  <button
                    onClick={() => {
                      setEditingCarId(null);
                      setSelectedFiles([]);
                      setCarForm({
                        brand: '',
                        model: '',
                        year: 2026,
                        pricePerDay: 0,
                        pricePerWeek: 0,
                        pricePerMonth: 0,
                        imageUrl: '',
                        features: ['Climatisation', 'Manuelle', 'Essence', '5 Places']
                      });
                      setShowCarModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-redAccent text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Plus size={14} />
                    Ajouter un Véhicule
                  </button>
                </div>

                {/* Fleet Grid Showcase */}
                {fleet.length === 0 ? (
                  <div className="bg-white py-20 text-center text-slate-400 font-semibold text-xs border border-slate-100 rounded-2xl">
                    Aucun véhicule enregistré dans la base de données.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {fleet.map(car => (
                      <AdminCarCard
                        key={car.id}
                        car={car}
                        startEditCar={startEditCar}
                        handleDeleteCar={handleDeleteCar}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Messages log list */}
            {activeTab === 'messages' && (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-800">Inbox des Messages</h3>
                  <span className="text-xs text-slate-400 font-bold">{messages.length} message(s)</span>
                </div>

                {messages.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-semibold text-xs">
                    Aucun message reçu via le formulaire de contact.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-100">
                          <th className="py-3.5 px-5">Expéditeur Details</th>
                          <th className="py-3.5 px-5">Sujet</th>
                          <th className="py-3.5 px-5">Message</th>
                          <th className="py-3.5 px-5 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map(msg => (
                          <tr key={msg.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-5 space-y-1">
                              <div className="font-extrabold text-slate-900 text-sm">{msg.name}</div>
                              <div className="text-slate-500 font-medium">{msg.email}</div>
                              <div className="text-brand-blue font-bold">{msg.phone}</div>
                            </td>
                            <td className="py-4 px-5 font-bold text-slate-800">{msg.subject}</td>
                            <td className="py-4 px-5 text-slate-600 font-semibold leading-relaxed max-w-sm">
                              {msg.message}
                            </td>
                            <td className="py-4 px-5 text-center">
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-brand-red bg-red-50 hover:bg-red-100 p-2.5 rounded-xl transition-all"
                                title="Supprimer Message"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Settings / Profile */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-50 pb-3">Paramètres du Compte</h3>

                <div className="max-w-md">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Changer l'adresse E-mail</h4>
                  {emailChangeStep === 0 && (
                    <form onSubmit={handleRequestEmailChange} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Nouvelle Adresse E-mail</label>
                        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue" />
                      </div>
                      <button type="submit" disabled={actionLoading} className="bg-brand-blue hover:bg-[#265fad] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all">
                        {actionLoading ? 'Envoi...' : 'Demander le changement'}
                      </button>
                    </form>
                  )}
                  {emailChangeStep === 1 && (
                    <form onSubmit={handleVerifyEmailChange} className="space-y-4">
                      <p className="text-xs text-slate-500">Un code de vérification a été envoyé à {newEmail}.</p>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 text-center">Code OTP à 6 chiffres</label>
                        <OTPInput value={emailChangeOtp} onChange={setEmailChangeOtp} />
                      </div>
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <button type="submit" disabled={actionLoading} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all">
                          {actionLoading ? 'Vérification...' : 'Valider le changement'}
                        </button>
                        <button type="button" onClick={() => setEmailChangeStep(0)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Annuler</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Modal Window: Fleet Car Add/Edit */}
        {showCarModal && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6">

              <div className="border-b border-slate-50 pb-3">
                <h3 className="font-black text-slate-900 text-lg">
                  {editingCarId ? 'Modifier le Véhicule' : 'Ajouter un Véhicule'}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                  Fiche Technique du Véhicule
                </span>
              </div>

              <form onSubmit={handleCarSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Marque</label>
                    <input
                      type="text"
                      value={carForm.brand}
                      onChange={(e) => setCarForm(prev => ({ ...prev, brand: e.target.value }))}
                      required
                      placeholder="Ex: Dacia"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Modèle</label>
                    <input
                      type="text"
                      value={carForm.model}
                      onChange={(e) => setCarForm(prev => ({ ...prev, model: e.target.value }))}
                      required
                      placeholder="Ex: Logan"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">
                    Éléments Techniques
                    {carForm.features.length > 0 && (
                      <span className="ml-2 bg-brand-red text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        {carForm.features.length} sélectionné(s)
                      </span>
                    )}
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    {FEATURES_OPTIONS.map(category => (
                      <div key={category.label}>
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">
                          {category.icon} {category.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {category.options.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleFeature(opt)}
                              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${carForm.features.includes(opt)
                                  ? 'bg-brand-red text-white border-brand-red shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-red hover:text-brand-red'
                                }`}
                            >
                              {carForm.features.includes(opt) ? '✓ ' : ''}{opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {carForm.features.length === 0 && (
                      <p className="text-[10px] text-slate-400 font-semibold text-center py-2">
                        Sélectionnez au moins un élément technique
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload Image using Multer direct */}
                <div className="border border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-2">
                  <Upload size={24} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Images du Véhicule</span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="multer-upload-files"
                  />

                  <label
                    htmlFor="multer-upload-files"
                    className="bg-white border border-slate-200 hover:border-brand-blue rounded-lg py-1.5 px-3 font-semibold text-[10px] text-slate-700 cursor-pointer shadow-sm transition-all"
                  >
                    Sélectionner des Photos
                  </label>

                  {selectedFiles.length > 0 ? (
                    <div className="w-full mt-3 space-y-2">
                      <div className="text-[9px] text-[#265fad] font-bold max-w-xs truncate text-center mx-auto">
                        📸 {selectedFiles.length} photo(s) sélectionnée(s).
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                        {selectedFiles.map((file, idx) => (
                          <img
                            key={idx}
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="h-16 w-16 object-cover rounded-lg border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  ) : carForm.imageUrl ? (
                    <div className="w-full mt-3 space-y-2">
                      <div className="text-[9px] text-[#265fad] font-bold max-w-xs truncate text-center mx-auto">
                        📸 Photo(s) existante(s) conservée(s).
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                        {normalizeImages(carForm.imageUrl).map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt="preview"
                            className="h-16 w-16 object-cover rounded-lg border border-slate-200 opacity-80"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowCarModal(false)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-extrabold py-3 rounded-xl text-xs transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-1/2 bg-brand-red hover:bg-brand-redAccent text-white font-extrabold py-3 rounded-xl text-xs transition-all"
                  >
                    {actionLoading ? 'Sauvegarde...' : 'Valider'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
