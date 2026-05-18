// Login Page Component
// CHGOURI CAR Marrakech Car Rental

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle post login redirects (e.g. back to booking flow)
  const redirectPath = location.state?.redirectTo || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await login(email, password);
      
      if (res.success) {
        // Route admins directly to portal
        if (res.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 p-8 rounded-2xl shadow-premium text-left">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Bon retour !
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-semibold">
            Connectez-vous pour gérer vos réservations CHGOURI CAR
          </p>
        </div>

        {/* Form Error */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-xl text-xs font-semibold text-brand-red">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div>
              <label className="block mb-2">Adresse E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-brand-red hover:underline cursor-pointer">Mot de passe oublié ?</span>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 font-bold uppercase text-xs"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
              {!loading && <LogIn size={14} />}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-slate-50 text-xs font-semibold text-slate-400">
          <span>Nouveau chez CHGOURI CAR ? </span>
          <Link to="/register" className="text-brand-red hover:underline font-bold">
            Créer un compte
          </Link>
        </div>

      </div>
    </div>
  );
}
