// Header / Navigation Component (Simplified Commercial version)
// CHGOURI CAR Marrakech Car Rental

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import logo from "./logo.png";
import { Menu, X, Globe, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, t, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-start">
              <img
                src={logo}
                alt="Chgouri Car"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-brand-blue font-semibold transition-colors">
              {t('navHome')}
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-brand-blue font-semibold transition-colors">
              {t('navAbout')}
            </Link>
            <Link to="/vehicles" className="text-slate-600 hover:text-brand-blue font-semibold transition-colors">
              {t('navFleet')}
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-brand-blue font-semibold transition-colors">
              {t('navContact')}
            </Link>

            {/* Language Toggler */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-slate-500 hover:text-brand-red border border-slate-200 hover:border-brand-red rounded-lg px-3 py-1.5 transition-all text-xs font-semibold uppercase"
            >
              <Globe size={14} />
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Auth status links (Admin ONLY) */}
            {user && user.role === 'admin' ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-slate-700 hover:text-brand-red font-medium transition-colors text-sm"
                >
                  <User size={16} className="text-brand-red" />
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-500 hover:text-brand-red text-sm transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-slate-500 hover:text-brand-red font-semibold transition-colors text-sm"
              >
                Connexion
              </Link>
            )}

            {/* Booking CTA */}
            <Link
              to="/booking"
              className="bg-brand-red hover:bg-brand-redAccent text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-brand-red/10"
            >
              {t('navBookNow')}
            </Link>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1 text-xs uppercase"
            >
              <Globe size={12} />
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-brand-red"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full left-0 px-4 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-brand-blue font-semibold text-lg"
          >
            {t('navHome')}
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-brand-blue font-semibold text-lg"
          >
            {t('navAbout')}
          </Link>
          <Link
            to="/vehicles"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-brand-blue font-semibold text-lg"
          >
            {t('navFleet')}
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-brand-blue font-semibold text-lg"
          >
            {t('navContact')}
          </Link>

          <hr className="border-slate-100" />

          {user && user.role === 'admin' ? (
            <div className="space-y-3">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-slate-800 font-semibold"
              >
                <User size={18} className="text-brand-red" />
                {user.name} (Admin)
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-red w-full text-left"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-slate-600 hover:text-brand-red font-medium"
            >
              Connexion Admin
            </Link>
          )}

          <Link
            to="/booking"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-brand-red hover:bg-brand-redAccent text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-red/10 text-center"
          >
            {t('navBookNow')}
          </Link>
        </div>
      )}
    </nav>
  );
}
