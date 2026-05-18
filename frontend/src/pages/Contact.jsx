// Contact Page Component (Office Details & Contact Form Submissions)
// CHGOURI CAR Marrakech Car Rental

import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../context/AuthContext';
import { Phone, Mail, MapPin, Send, HelpCircle } from 'lucide-react';

export default function Contact() {
  const { t, locale } = useLanguage();

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await axios.post(`${API_BASE_URL}/messages`, formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t('contactError'));
    } finally {
      setLoading(false);
    }
  };

  const contactInfos = [
    {
      icon: <Phone className="text-brand-blue" size={24} />,
      title: t('contactPhone'),
      details: "+212 6 61 90 18 73",
      href: "tel:+212661901873"
    },
    {
      icon: <Mail className="text-brand-blue" size={24} />,
      title: t('contactEmail'),
      details: "contact@chgouricar.com",
      href: "mailto:contact@chgouricar.com"
    },
    {
      icon: <MapPin className="text-brand-blue" size={24} />,
      title: t('contactAddress'),
      details: t('contactAddressVal'),
      href: "https://maps.google.com/?q=N%C2%B0+124+Boulevard+Mohamed+V,+Gu%C3%A9liz,+Marrakech,+Maroc"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-brand-blue font-extrabold text-xs uppercase tracking-widest bg-brand-blue/10 px-3.5 py-1.5 rounded-full inline-block">
            {t('navContact')}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            {t('contactTitle')}
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            {t('contactSubtitle')}
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfos.map((info, idx) => (
            <a 
              key={idx}
              href={info.href}
              target={info.icon.props.className === "MapPin" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="bg-white border border-slate-100 shadow-premium p-6 rounded-3xl flex items-start gap-4 hover:shadow-lg hover:border-brand-blue/20 transition-all group"
            >
              <div className="p-3.5 bg-brand-blue/5 rounded-2xl group-hover:bg-brand-blue/10 transition-colors">
                {info.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{info.title}</h4>
                <p className="text-slate-500 font-semibold text-xs md:text-sm leading-relaxed">{info.details}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Form Panel */}
          <div className="bg-white border border-slate-100 shadow-premium p-8 rounded-3xl lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight flex items-center gap-2">
                <HelpCircle className="text-brand-blue" size={22} />
                {t('contactFormTitle')}
              </h3>
              <p className="text-slate-400 text-xs font-semibold uppercase">
                Réponse sous 24h par notre équipe
              </p>
            </div>

            {/* Alert Notifications */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl text-xs font-semibold text-green-700">
                {t('contactSuccess')}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-xl text-xs font-semibold text-brand-red">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">{t('formName')} *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-brand-blue text-slate-900 font-semibold normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">{t('formEmail')} *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-brand-blue text-slate-900 font-semibold normal-case"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">{t('formPhone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-brand-blue text-slate-900 font-semibold normal-case"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">{t('formSubject')}</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-brand-blue text-slate-900 font-semibold normal-case"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">{t('formMessage')} *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-brand-blue text-slate-900 font-semibold normal-case"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-blue py-3.5 px-6 font-bold text-xs uppercase flex items-center justify-center gap-2 w-full sm:w-fit"
              >
                <Send size={14} />
                {loading ? t('contactSubmitting') : t('contactSubmitBtn')}
              </button>
            </form>
          </div>

          {/* Map Location panel */}
          <div className="bg-white border border-slate-100 shadow-premium p-4 rounded-3xl lg:col-span-5 flex flex-col">
            <iframe 
              title="CHGOURI CAR Marrakech Gueliz Office Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.0717240751996!2d-8.016335124976722!3d31.632608141977758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef17c2f0f03f%3A0xf6399c55b682c3c6!2sBlvd%20Mohamed%20V%2C%20Marrakech%2040000%2C%20Morocco!5e0!3m2!1sen!2sfr!4v1709900000000!5m2!1sen!2sfr" 
              className="w-full h-full min-h-[300px] rounded-2xl border-none flex-grow"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </div>
  );
}
