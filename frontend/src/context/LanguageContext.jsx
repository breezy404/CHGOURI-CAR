// Multilingual Translation Context (French/English)
// CHGOURI CAR Marrakech Car Rental

import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    // Navigation
    navHome: "Accueil",
    navFleet: "Nos Véhicules",
    navAbout: "À Propos",
    navContact: "Contact",
    navClientDashboard: "Mon Espace",
    navAdminDashboard: "Admin",
    navLogin: "Connexion",
    navLogout: "Déconnexion",
    navRegister: "S'inscrire",
    navBookNow: "Réserver",

    // Hero
    heroTitle: "Location de Voitures Économiques à Marrakech",
    heroSubtitle: "Simple, rapide et sans surprises. Livraison gratuite à l'Aéroport de Marrakech-Ménara.",
    searchWidgetTitle: "Trouvez votre voiture idéale",
    pickupLocationLabel: "Lieu de prise en charge",
    dropoffLocationLabel: "Lieu de retour",
    pickupDateLabel: "Date de départ",
    dropoffDateLabel: "Date de retour",
    searchBtn: "Rechercher",

    // Values
    valAirport: "Aéroport de Marrakech-Ménara",
    valAgency: "Agence Centre-Ville",
    valHotel: "Livraison à votre Hôtel",

    // Fleet Grid
    fleetTitle: "Notre Gamme Économique",
    fleetSubtitle: "Des véhicules récents, parfaitement entretenus et idéaux pour circuler à Marrakech au meilleur prix.",
    perDay: "DH / jour",
    perWeek: "DH / semaine",
    perMonth: "DH / mois",
    btnSelect: "Sélectionner",
    featuresAc: "Climatisation",
    featuresManual: "Manuelle",
    featuresAuto: "Automatique",
    featuresEssence: "Essence",
    featuresDiesel: "Diesel",

    // Why Choose Us
    whyTitle: "Pourquoi Choisir CHGOURI CAR ?",
    whySubtitle: "Un service premium à prix économique pour un séjour inoubliable à Marrakech.",
    why1Title: "Aéroport Livraison Gratuite",
    why1Desc: "Nous vous livrons le véhicule directement à la sortie du terminal à l'Aéroport de Marrakech.",
    why2Title: "Assistance 24/7",
    why2Desc: "Une panne ? Un souci ? Notre équipe d'assistance est joignable 24h/24 et 7j/7.",
    why3Title: "Kilométrage Illimité",
    why3Desc: "Profitez de votre voyage dans tout le Maroc sans vous soucier des kilomètres parcourus.",

    // Footer
    footerDesc: "CHGOURI CAR est votre agence de location de voitures de confiance à Marrakech. Des véhicules économiques neufs au meilleur prix.",
    footerSupport: "Contact & Assistance",
    footerQuickLinks: "Liens Rapides",

    // Booking Flow Wizard
    step1Title: "Dates & Lieux",
    step2Title: "Choix Véhicule",
    step3Title: "Options Extras",
    step4Title: "Vos Infos",
    step5Title: "Paiement",
    step6Title: "Confirmation",

    bookingSummary: "Résumé de la réservation",
    btnNext: "Suivant",
    btnBack: "Retour",
    btnPay: "Procéder au Paiement",

    gpsOption: "GPS Nouvelle Génération (+50 DH/jour)",
    babySeatOption: "Siège Bébé Premium (+50 DH/jour)",
    extraDriverOption: "Conducteur Supplémentaire (+100 DH unique)",

    formName: "Nom Complet",
    formEmail: "Adresse E-mail",
    formPhone: "Numéro de Téléphone (WhatsApp)",
    formLicense: "Numéro de Permis de Conduire",

    payFull: "Payer 100% de la réservation en ligne",
    payDeposit: "Payer 30% d'acompte en ligne (Reste à la livraison)",

    // Booking confirmation
    confirmSuccessTitle: "Paiement Réussi & Réservation Confirmée !",
    confirmSuccessDesc: "Un e-mail de confirmation contenant votre facture PDF vient de vous être envoyé. Merci pour votre confiance !",
    confirmFailTitle: "Échec du Paiement",
    confirmFailDesc: "La transaction a échoué. Veuillez réessayer ou nous contacter directement.",
    btnDownloadInvoice: "Télécharger la facture (PDF)",
    btnWhatsAppSupport: "Contactez-nous sur WhatsApp",
    btnBackHome: "Retour à l'accueil",

    // About Us Page
    aboutTitle: "À Propos de CHGOURI CAR",
    aboutSubtitle: "Votre partenaire de confiance pour explorer Marrakech et tout le Maroc.",
    aboutIntroTitle: "Qui sommes-nous ?",
    aboutIntroDesc: "Fondée à Marrakech, CHGOURI CAR SARL s'est imposée comme le choix de référence pour les voyageurs en quête de liberté et de confort. Nous combinons des tarifs économiques et un service premium de livraison directe sans tracas.",
    aboutExperienceTitle: "Des Années d'Expérience",
    aboutExperienceDesc: "Grâce à notre équipe de professionnels passionnés, nous offrons un accompagnement personnalisé et des conseils pour rendre votre séjour exceptionnel. Que vous ayez besoin d'une citadine agile pour la ville ou de circuits touristiques guidés, nous répondons présents.",
    aboutQualityTitle: "Qualité & Fiabilité Garanties",
    aboutQualityDesc: "Tous nos véhicules font l'objet de contrôles de sécurité rigoureux avant chaque départ. Nous renouvelons régulièrement notre flotte pour vous offrir des modèles récents avec climatisation, confort moderne et sécurité optimale.",

    // Marketing Section
    marketingAboutTitle: "CHGOURI CAR : Location Voiture Marrakech",
    marketingAboutSubtitle: "Agence de location de voitures de confiance basée à Marrakech, offrant un service de qualité supérieure avec livraison et récupération gratuites dans toute la ville de Marrakech et à l'Aéroport.",
    marketingBullet1: "Assurance tout risque : Formules flexibles adaptées.",
    marketingBullet2: "Kilométrages : Illimités pour tous vos déplacements au Maroc.",
    marketingBullet3: "Livraison & Récupération : Aéroport et Hôtels de Marrakech 100% gratuits.",
    marketingBadgeLine1: "Assistance 24h/7j",
    marketingBadgeLine2: "+20 ans",
    marketingBtnMore: "Plus d'infos",

    // Services (Common & Home)
    servicesTitle: "Nos Services Premium",
    servicesSubtitle: "Découvrez notre gamme complète d'offres conçues pour votre confort de voyage.",
    serviceRentalTitle: "Location de Véhicules",
    serviceRentalDesc: "Profitez d'un large choix de citadines et de routières à prix imbattables avec kilométrage illimité et assurance tout compris.",
    serviceCircuitsTitle: "Circuits Touristiques",
    serviceCircuitsDesc: "Explorez les plus beaux paysages du Maroc à travers nos excursions sur mesure au départ de Marrakech.",

    // Tourist Circuits
    circuitsTitle: "Excursions & Circuits Touristiques",
    circuitsSubtitle: "Réservez des aventures exceptionnelles encadrées par des guides professionnels agréés.",
    circuitMarrakechTitle: "Marrakech City Tour",
    circuitMarrakechDesc: "Découvrez la Médina historique, le Jardin Majorelle, les Tombeaux Saadiens, et vibrez au rythme de la place Jemaa El Fna.",
    circuitDesertTitle: "Excursion Désert (Merzouga & Agafay)",
    circuitDesertDesc: "Vivez une nuit inoubliable sous les tentes berbères, admirez les dunes dorées et profitez d'une balade à dos de chameau au coucher du soleil.",
    circuitAtlasTitle: "Aventure dans l'Atlas (Ourika & Oukaimeden)",
    circuitAtlasDesc: "Évadez-vous dans les montagnes majestueuses, visitez les cascades traditionnelles et partagez un thé berbère authentique chez l'habitant.",
    btnBookWhatsApp: "Réserver via WhatsApp",

    // Contact Page
    contactTitle: "Contactez Notre Agence",
    contactSubtitle: "Une question ? Une demande d'excursion ? Contactez Abdelali LACHGAR et son équipe.",
    contactFormTitle: "Envoyez-nous un Message",
    contactInfoTitle: "Nos Coordonnées",
    contactSuccess: "Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
    contactError: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
    contactSubmitBtn: "Envoyer le Message",
    contactSubmitting: "Envoi en cours...",
    formSubject: "Sujet de votre message",
    formMessage: "Votre Message",
    contactPhone: "Téléphone & WhatsApp",
    contactEmail: "Adresse E-mail",
    contactAddress: "Siège Social / Agence",
    contactAddressVal: "N° 124 Boulevard Mohamed V, Guéliz, Marrakech, Maroc",

    // Vehicles Page
    vehiclesTitle: "Notre Flotte de Véhicules",
    vehiclesSubtitle: "Filtrez et trouvez la voiture idéale pour votre trajet à Marrakech.",
    filterAll: "Tous les véhicules",
    filterTransmission: "Transmission",
    filterFuel: "Carburant",
    filterTransmissionManual: "Manuelle",
    filterTransmissionAuto: "Automatique",
    filterFuelPetrol: "Essence",
    filterFuelDiesel: "Diesel",
    filterClear: "Réinitialiser les filtres",
    noCarsFound: "Aucun véhicule ne correspond à vos critères de recherche.",
    specTransmission: "Boîte",
    specSeats: "Places",
    specAc: "Climatisation",
    specFuel: "Carburant",
    btnReserveNow: "Réserver en ligne",
    btnWhatsAppDirect: "WhatsApp Direct"
  },
  en: {
    // Navigation
    navHome: "Home",
    navFleet: "Our Fleet",
    navAbout: "About Us",
    navContact: "Contact",
    navClientDashboard: "My Account",
    navAdminDashboard: "Admin",
    navLogin: "Login",
    navLogout: "Logout",
    navRegister: "Register",
    navBookNow: "Book Now",

    // Hero
    heroTitle: "Economy Car Rental in Marrakech",
    heroSubtitle: "Simple, fast, and no hidden fees. Free delivery at Marrakech-Menara Airport.",
    searchWidgetTitle: "Find your perfect car",
    pickupLocationLabel: "Pickup Location",
    dropoffLocationLabel: "Dropoff Location",
    pickupDateLabel: "Pickup Date",
    dropoffDateLabel: "Dropoff Date",
    searchBtn: "Search",

    // Values
    valAirport: "Marrakech-Menara Airport",
    valAgency: "City Center Agency",
    valHotel: "Hotel Delivery",

    // Fleet Grid
    fleetTitle: "Our Economy Fleet",
    fleetSubtitle: "Recent, well-maintained vehicles ideal for driving around Marrakech at the best price.",
    perDay: "DH / day",
    perWeek: "DH / week",
    perMonth: "DH / month",
    btnSelect: "Select",
    featuresAc: "A/C",
    featuresManual: "Manual",
    featuresAuto: "Automatic",
    featuresEssence: "Petrol",
    featuresDiesel: "Diesel",

    // Why Choose Us
    whyTitle: "Why Choose CHGOURI CAR?",
    whySubtitle: "Premium service at budget-friendly prices for an unforgettable stay in Marrakech.",
    why1Title: "Free Airport Delivery",
    why1Desc: "We deliver the car directly to you right outside the Marrakech Airport terminal exit.",
    why2Title: "24/7 Assistance",
    why2Desc: "Breakdown? Issue? Our dedicated support team is available 24/7.",
    why3Title: "Unlimited Mileage",
    why3Desc: "Enjoy your road trip across Morocco without worrying about distance limits.",

    // Footer
    footerDesc: "CHGOURI CAR is your trusted car rental agency in Marrakech, offering brand-new economy cars at the best rates.",
    footerSupport: "Contact & Assistance",
    footerQuickLinks: "Quick Links",

    // Booking Flow Wizard
    step1Title: "Dates & Locations",
    step2Title: "Choose Car",
    step3Title: "Extra Options",
    step4Title: "Your Details",
    step5Title: "Payment",
    step6Title: "Confirmation",

    bookingSummary: "Booking Summary",
    btnNext: "Next",
    btnBack: "Back",
    btnPay: "Proceed to Payment",

    gpsOption: "New Gen GPS (+50 DH/day)",
    babySeatOption: "Premium Child Seat (+50 DH/day)",
    extraDriverOption: "Additional Driver (+100 DH flat fee)",

    formName: "Full Name",
    formEmail: "Email Address",
    formPhone: "Phone Number (WhatsApp)",
    formLicense: "Driving License Number",

    payFull: "Pay 100% full amount online",
    payDeposit: "Pay 30% deposit online (Pay balance on delivery)",

    // Booking confirmation
    confirmSuccessTitle: "Payment Successful & Booking Confirmed!",
    confirmSuccessDesc: "A confirmation email with your PDF invoice has been sent to you. Thank you for your trust!",
    confirmFailTitle: "Payment Failed",
    confirmFailDesc: "The transaction has failed. Please try again or contact us directly.",
    btnDownloadInvoice: "Download Invoice (PDF)",
    btnWhatsAppSupport: "Contact us on WhatsApp",
    btnBackHome: "Back to Home",

    // About Us Page
    aboutTitle: "About CHGOURI CAR",
    aboutSubtitle: "Your trusted partner to explore Marrakech and all of Morocco.",
    aboutIntroTitle: "Who Are We?",
    aboutIntroDesc: "Founded in Marrakech, CHGOURI CAR SARL has established itself as the leading choice for travelers seeking freedom and comfort. We combine economy rates with hassle-free premium direct delivery services.",
    aboutExperienceTitle: "Years of Experience",
    aboutExperienceDesc: "Thanks to our passionate team of professionals, we provide personalized guidance and advice to make your stay exceptional. Whether you need a compact city car or guided sightseeing tours, we are here for you.",
    aboutQualityTitle: "Guaranteed Quality & Reliability",
    aboutQualityDesc: "All our vehicles undergo strict safety inspections before every rental. We regularly renew our fleet to offer brand-new models equipped with A/C, modern comforts, and top-tier safety.",

    // Marketing Section
    marketingAboutTitle: "CHGOURI CAR: Car Rental Marrakech",
    marketingAboutSubtitle: "Trusted car rental agency based in Marrakech, offering top-quality services with free pickup and delivery across Marrakech and at the Airport.",
    marketingBullet1: "Comprehensive insurance: Flexible tailored plans.",
    marketingBullet2: "Mileage: Unlimited mileage for your journeys in Morocco.",
    marketingBullet3: "Delivery & Return: Marrakech Airport & Hotels 100% free.",
    marketingBadgeLine1: "24/7 Assistance",
    marketingBadgeLine2: "+20 years",
    marketingBtnMore: "More info",

    // Services (Common & Home)
    servicesTitle: "Our Premium Services",
    servicesSubtitle: "Discover our full range of offers custom-tailored for your travel convenience.",
    serviceRentalTitle: "Car Rental",
    serviceRentalDesc: "Enjoy a wide selection of city and highway cars at unbeatable rates with unlimited mileage and comprehensive insurance.",
    serviceCircuitsTitle: "Tourist Circuits",
    serviceCircuitsDesc: "Explore the most beautiful landscapes of Morocco through our custom excursions departing from Marrakech.",

    // Tourist Circuits
    circuitsTitle: "Tourist Tours & Excursions",
    circuitsSubtitle: "Book outstanding adventures led by certified professional guides.",
    circuitMarrakechTitle: "Marrakech City Tour",
    circuitMarrakechDesc: "Discover the historical Medina, Majorelle Garden, Saadian Tombs, and experience the vibrant heartbeat of Jemaa El Fna square.",
    circuitDesertTitle: "Desert Safari (Merzouga & Agafay)",
    circuitDesertDesc: "Experience an unforgettable night under Berber tents, admire the golden sand dunes, and enjoy a camel ride at sunset.",
    circuitAtlasTitle: "Atlas Mountains Adventure (Ourika Valley)",
    circuitAtlasDesc: "Escape to the majestic mountains, visit traditional waterfalls, and share an authentic Berber tea with a local family.",
    btnBookWhatsApp: "Book via WhatsApp",

    // Contact Page
    contactTitle: "Contact Our Agency",
    contactSubtitle: "Any questions? Looking for a tour? Contact Abdelali LACHGAR and his team.",
    contactFormTitle: "Send Us a Message",
    contactInfoTitle: "Contact Details",
    contactSuccess: "Your message has been sent successfully! We will get back to you as soon as possible.",
    contactError: "An error occurred while sending the message. Please try again.",
    contactSubmitBtn: "Send Message",
    contactSubmitting: "Sending...",
    formSubject: "Subject of your message",
    formMessage: "Your Message",
    contactPhone: "Phone & WhatsApp",
    contactEmail: "Email Address",
    contactAddress: "Headquarters / Office",
    contactAddressVal: "No. 124 Mohamed V Boulevard, Gueliz, Marrakech, Morocco",

    // Vehicles Page
    vehiclesTitle: "Our Vehicle Fleet",
    vehiclesSubtitle: "Filter and find the perfect car for your journey in Marrakech.",
    filterAll: "All Vehicles",
    filterTransmission: "Transmission",
    filterFuel: "Fuel",
    filterTransmissionManual: "Manual",
    filterTransmissionAuto: "Automatic",
    filterFuelPetrol: "Petrol",
    filterFuelDiesel: "Diesel",
    filterClear: "Reset Filters",
    noCarsFound: "No vehicles match your search criteria.",
    specTransmission: "Gearbox",
    specSeats: "Seats",
    specAc: "A/C",
    specFuel: "Fuel",
    btnReserveNow: "Book Online",
    btnWhatsAppDirect: "WhatsApp Direct"
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('chgouri_lang') || 'fr';
  });

  const t = (key) => {
    return translations[locale][key] || translations['fr'][key] || key;
  };

  const toggleLanguage = () => {
    setLocale((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('chgouri_lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
