// Login Page Component with Forgot Password Flow
// CHGOURI CAR Marrakech Car Rental

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, LogIn, ArrowLeft, KeyRound, CheckCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import OTPInput from '../components/OTPInput';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 0 = Login, 1 = Request Reset, 2 = Verify OTP, 3 = New Password
  const [step, setStep] = useState(0); 
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirectPath = location.state?.redirectTo || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.role === 'admin') navigate('/admin');
        else navigate(redirectPath);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email: resetEmail });
      setSuccessMessage(res.data.message);
      setStep(2); // Go to OTP
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email: resetEmail, otp });
      setSuccessMessage('Code valide. Entrez votre nouveau mot de passe.');
      setStep(3); // Go to New Password
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Code invalide.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, { 
        email: resetEmail, 
        otp, 
        newPassword 
      });
      setSuccessMessage('Mot de passe mis à jour ! Vous pouvez vous connecter.');
      setTimeout(() => {
        setStep(0);
        setEmail(resetEmail);
        setPassword('');
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Erreur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 p-8 rounded-2xl shadow-premium text-left">
        
        {step === 0 && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bon retour !</h2>
              <p className="mt-2 text-sm text-slate-400 font-semibold">Connectez-vous pour gérer vos réservations</p>
            </div>

            {errorMessage && <div className="bg-red-50 border-l-4 border-brand-red p-4 rounded-xl text-xs font-semibold text-brand-red">{errorMessage}</div>}
            {successMessage && <div className="bg-green-50 border-l-4 border-emerald-500 p-4 rounded-xl text-xs font-semibold text-emerald-600">{successMessage}</div>}

            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div>
                  <label className="block mb-2">Adresse E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span onClick={() => { setStep(1); setErrorMessage(''); setSuccessMessage(''); }} className="text-brand-red hover:underline cursor-pointer">Mot de passe oublié ?</span>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 font-bold uppercase text-xs">
                {loading ? 'Connexion...' : 'Se connecter'}
                {!loading && <LogIn size={14} />}
              </button>
            </form>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-center">
              <KeyRound className="mx-auto text-brand-red mb-4" size={40} />
              <h2 className="text-2xl font-extrabold text-slate-900">Mot de passe oublié</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">Entrez votre adresse e-mail pour recevoir un code de réinitialisation.</p>
            </div>
            {errorMessage && <div className="bg-red-50 text-brand-red p-3 rounded-lg text-xs font-semibold">{errorMessage}</div>}
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required placeholder="Adresse E-mail" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold focus:outline-none focus:border-brand-blue" />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 font-bold uppercase text-xs">
                {loading ? 'Envoi...' : 'Envoyer le code'}
              </button>
            </form>
            <div className="text-center pt-4">
              <button onClick={() => setStep(0)} className="text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-1 mx-auto">
                <ArrowLeft size={12} /> Retour à la connexion
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center">
              <Mail className="mx-auto text-brand-red mb-4" size={40} />
              <h2 className="text-2xl font-extrabold text-slate-900">Vérification OTP</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">Un code à 6 chiffres a été envoyé à {resetEmail}.</p>
            </div>
            {errorMessage && <div className="bg-red-50 text-brand-red p-3 rounded-lg text-xs font-semibold">{errorMessage}</div>}
            {successMessage && <div className="bg-green-50 text-emerald-600 p-3 rounded-lg text-xs font-semibold">{successMessage}</div>}
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <OTPInput value={otp} onChange={setOtp} />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 font-bold uppercase text-xs">
                {loading ? 'Vérification...' : 'Vérifier le code'}
              </button>
            </form>
            <div className="text-center pt-4">
              <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-1 mx-auto">
                <ArrowLeft size={12} /> Renvoyer un code
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center">
              <CheckCircle className="mx-auto text-brand-red mb-4" size={40} />
              <h2 className="text-2xl font-extrabold text-slate-900">Nouveau mot de passe</h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">Créez un nouveau mot de passe sécurisé.</p>
            </div>
            {errorMessage && <div className="bg-red-50 text-brand-red p-3 rounded-lg text-xs font-semibold">{errorMessage}</div>}
            {successMessage && <div className="bg-green-50 text-emerald-600 p-3 rounded-lg text-xs font-semibold">{successMessage}</div>}
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    placeholder="Nouveau mot de passe" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-4 pr-12 text-sm font-semibold focus:outline-none focus:border-brand-blue" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Confirmer mot de passe" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-4 pr-12 text-sm font-semibold focus:outline-none focus:border-brand-blue" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md py-3.5 font-bold uppercase text-xs rounded-xl transition-all">
                {loading ? 'Mise à jour...' : 'Sauvegarder et se connecter'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
