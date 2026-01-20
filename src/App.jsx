// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import PartnerRegister from './pages/PartnerRegister';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Helper: Check if user is logged in
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userName");
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const isAuthenticated = localStorage.getItem("userName");

  return (
    <Router>
      <div className="min-h-screen text-gray-900 dark:text-white overflow-x-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
        
        {/* Only show Navbar if logged in (Optional, but looks cleaner on login page) */}
        {isAuthenticated && <Navbar />}

        <Routes>
          {/* 🚪 ENTRY POINT: Login Page */}
          <Route path="/" element={<Login />} />
          
          {/* 🔒 PROTECTED USER ROUTES */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* 🏢 PUBLIC / ADMIN ROUTES */}
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* 🛡️ ADMIN ONLY ROUTE */}
          <Route path="/admin-dashboard" element={
            localStorage.getItem("role") === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;