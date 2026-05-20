// Authentication Context (State Management)
// CHGOURI CAR Marrakech Car Rental

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('chgouri_token'));
  const [loading, setLoading] = useState(true);

  // Set default authorization header if token exists
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session loading failed, token expired.', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      
      // Ensure we extract the actual payload regardless of how Axios wraps it
      const data = response.data?.data || response.data || response;
      
      // Strict check for success flag
      if (data && data.success === true) {
        const token = data.token;
        const userObj = data.user || data.admin;
        
        if (token && userObj) {
          localStorage.setItem('chgouri_token', token);
          setToken(token);
          setUser(userObj);
          
          if (axios.defaults.headers && axios.defaults.headers.common) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          
          return { success: true, role: userObj.role };
        }
      }
      
      // If success is false in a 200 OK response
      return { 
        success: false, 
        message: data?.message || 'Identifiants incorrects.' 
      };
      
    } catch (error) {
      console.error('Login request failed:', error);
      // Ensure we extract the error message strictly from the backend response
      const errorMessage = error.response?.data?.message || 'Identifiants incorrects.';
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        phone
      });

      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem('chgouri_token', userToken);
        setToken(userToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('chgouri_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API_BASE_URL };
