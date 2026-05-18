// Footer Component
// CHGOURI CAR Marrakech Car Rental

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Corporate intro */}
          <div className="space-y-4">
            <span className="font-extrabold text-2xl tracking-wider text-white flex items-center gap-1.5">
              CHGOURI <span className="text-brand-red">CAR</span>
            </span>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-brand-red" />
              <span>Garantie Zéro Frais Cachés</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">
                  {t('navFleet')}
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  {t('navAbout')}
                </a>
              </li>
              <li>
                <Link to="/booking" className="hover:text-white transition-colors">
                  {t('navBookNow')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Address & Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Nos Points Relais
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-1.5">
                <MapPin size={16} className="text-brand-red shrink-0 mt-0.5" />
                <span>Aéroport Marrakech-Ménara (Livraison Terminal Gratuite)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin size={16} className="text-brand-red shrink-0 mt-0.5" />
                <span>Marrakech Centre-Ville (Guéliz)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin size={16} className="text-brand-red shrink-0 mt-0.5" />
                <span>Marrakech Zone Hôtelière (Livraison sur demande)</span>
              </li>
            </ul>
          </div>

          {/* Agency contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footerSupport')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-red" />
                <a href="tel:+212661901873" className="hover:text-white transition-colors">
                  +212 6 61 90 18 73
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-red" />
                <a href="tel:+212667947381" className="hover:text-white transition-colors">
                  +212 6 67 94 73 81
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-red" />
                <a href="mailto:chgouricar@gmail.com" className="hover:text-white transition-colors">
                  chgouricar@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        {/* Bottom footer bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
          <p>© {currentYear} CHGOURI CAR. Tous droits réservés.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Conditions Générales</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Mentions Légales</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">RGPD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
