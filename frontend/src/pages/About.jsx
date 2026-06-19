// About Us Page Component (Agency Presentation & Tourist Circuits)
// CHGOURI CAR Marrakech Car Rental

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, ShieldCheck, Clock, MapPin, Compass, Landmark, Mountain, CheckCircle2 } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  const guarantees = [
    {
      icon: <Clock className="text-brand-blue" size={24} />,
      title: t('why2Title'),
      desc: t('why2Desc')
    },
    {
      icon: <ShieldCheck className="text-brand-blue" size={24} />,
      title: t('aboutQualityTitle'),
      desc: t('aboutQualityDesc')
    },
    {
      icon: <Award className="text-brand-blue" size={24} />,
      title: t('why3Title'),
      desc: t('why3Desc')
    }
  ];

  const circuits = [
    {
      title: t('circuitMarrakechTitle'),
      desc: t('circuitMarrakechDesc'),
      icon: <Landmark size={20} className="text-white" />,
      image: "https://images.unsplash.com/photo-1597212618440-806262de4fe6?auto=format&fit=crop&q=80&w=800",
      whatsappUrl: "https://wa.me/212661901873?text=Bonjour,%20je%20souhaite%20réserver%20le%20circuit%20Marrakech%20City%20Tour."
    },
    {
      title: t('circuitDesertTitle'),
      desc: t('circuitDesertDesc'),
      icon: <Compass size={20} className="text-white" />,
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800",
      whatsappUrl: "https://wa.me/212661901873?text=Bonjour,%20je%20souhaite%20réserver%20le%20circuit%20Excursion%20Désert."
    },
    {
      title: t('circuitAtlasTitle'),
      desc: t('circuitAtlasDesc'),
      icon: <Mountain size={20} className="text-white" />,
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800",
      whatsappUrl: "https://wa.me/212661901873?text=Bonjour,%20je%20souhaite%20réserver%20le%20circuit%20Aventure%20dans%20l%27Atlas."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Page Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-brand-blue font-extrabold text-xs uppercase tracking-widest bg-brand-blue/10 px-3.5 py-1.5 rounded-full inline-block">
            CHGOURI CAR SARL
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            {t('aboutTitle')}
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            {t('aboutSubtitle')}
          </p>
        </div>

        {/* Presentation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {t('aboutIntroTitle')}
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              {t('aboutIntroDesc')}
            </p>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              {t('aboutExperienceDesc')}
            </p>

            {/* Checks list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs md:text-sm">
                <CheckCircle2 className="text-green-500" size={18} />
                Livraison Aéroport Gratuite
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs md:text-sm">
                <CheckCircle2 className="text-green-500" size={18} />
                Véhicules Climatisés Neufs
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs md:text-sm">
                <CheckCircle2 className="text-green-500" size={18} />
                Assistance Téléphonique 24h/7
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs md:text-sm">
                <CheckCircle2 className="text-green-500" size={18} />
                Kilométrage Illimité Inclus
              </div>
            </div>
          </div>

          {/* Elegant Collage Illustration */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-blue to-brand-red rounded-3xl blur-lg opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <img
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800"
              alt="CHGOURI CAR Luxury Fleet"
              className="rounded-2xl shadow-xl w-full object-cover h-[350px] relative z-10 border border-slate-100"
            />
          </div>
        </div>

        {/* Guarantees Section Grid */}
        <div className="bg-white border border-slate-100 shadow-premium rounded-3xl p-8 md:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Nos Engagements Qualité
            </h3>
            <p className="text-slate-400 text-xs font-semibold uppercase">
              La garantie d'un voyage serein et sécurisé au Maroc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {guarantees.map((g, idx) => (
              <div key={idx} className="space-y-3 p-4 hover:bg-slate-50 rounded-2xl transition-all">
                <div className="p-3 bg-brand-blue/5 rounded-xl w-fit">
                  {g.icon}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{g.title}</h4>
                <p className="text-slate-400 font-medium text-[11px] md:text-xs leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tourist Circuits Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-brand-red font-extrabold text-xs uppercase tracking-widest bg-brand-red/10 px-3.5 py-1.5 rounded-full inline-block">
              {t('serviceCircuitsTitle')}
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('circuitsTitle')}
            </h2>
            <p className="text-slate-500 font-medium text-xs md:text-sm">
              {t('circuitsSubtitle')}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {circuits.map((c, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-premium border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-all duration-300 z-10"></div>
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
                  <div className="absolute top-4 left-4 bg-brand-blue p-2.5 rounded-xl z-20 shadow-md">
                    {c.icon}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base md:text-lg text-slate-900 group-hover:text-brand-blue transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-slate-500 font-medium text-[11px] md:text-xs leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  <div className="pt-4">
                    <a
                      href={c.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-pulse flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all w-full text-center"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.002-5.037-2.824-6.861-1.821-1.822-4.246-2.825-6.848-2.826-5.44.001-9.865 4.37-9.869 9.732-.001 1.761.472 3.483 1.371 5.002L1.997 22l6.237-1.635z"/>
                      </svg>
                      {t('btnBookWhatsApp')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div >
  );
}
