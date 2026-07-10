/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SptList from './pages/SptList';
import SptForm from './pages/SptForm';
import SptPrint from './pages/SptPrint';
import Login from './security/LoginPage';
import Register from './security/RegisterPage';
import './App.css';

// Fungsi untuk mengecek apakah user sudah login
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />; // Tendang ke /login
  }
  return (
    <>
      <Navbar /> {/* Navbar hanya muncul jika sudah login */}
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Privat (Wajib Login) */}
        <Route path="/" element={
          <ProtectedRoute><SptList /></ProtectedRoute>
        } />
        
        <Route path="/create" element={
          <ProtectedRoute><SptForm /></ProtectedRoute>
        } />
        
        <Route path="/edit/:id" element={
          <ProtectedRoute><SptForm /></ProtectedRoute>
        } />
        
        <Route path="/print/:id" element={
          <ProtectedRoute><SptPrint /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;