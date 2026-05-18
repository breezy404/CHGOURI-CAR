// Main React Client Application Router & Provider Wrapper (Simplified version)
// CHGOURI CAR Marrakech Car Rental

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Elements
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatWhatsApp from './components/FloatWhatsApp';

// Page Views
import Home from './pages/Home';
import About from './pages/About';
import Vehicles from './pages/Vehicles';
import Contact from './pages/Contact';
import BookingFlow from './pages/BookingFlow';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

/**
 * Admin protection: Must be authenticated and have role === 'admin'
 */
function AdminRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div>
      </div>
    );
  }

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
              
              {/* Common Header Navbar */}
              <Navbar />

              {/* Main Routing Views */}
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/booking" element={<BookingFlow />} />
                  <Route path="/login" element={<Login />} />

                  {/* Protected Admin Space */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Common Footer */}
              <Footer />

              {/* Conversion Booster Floating WhatsApp Support Widget */}
              <FloatWhatsApp />

            </div>
          </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
