/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let captcha = "";
    for(let i = 0; i < 5; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  };

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nama_lengkap: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaInput !== captchaText) {
      alert("Captcha salah!");
      refreshCaptcha();
      setCaptchaInput('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      alert(response.data.message);
      navigate('/login'); // Kembali ke login setelah sukses daftar
    } catch (error) {
      alert(error.response?.data?.error || "Terjadi kesalahan saat registrasi");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrasi Akun Baru</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" className="form-control" 
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} required />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <div style={{ display: 'flex' }}>
              <input type={showPassword ? "text" : "password"} className="form-control" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} 
                style={{ marginLeft: '-40px', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Kode Keamanan: <strong style={{ letterSpacing: '3px', background: '#e2e8f0', padding: '2px 8px', userSelect: 'none' }}>{captchaText}</strong></label>
            <input type="text" className="form-control" value={captchaInput} 
              onChange={(e) => setCaptchaInput(e.target.value)} required placeholder="Ketik huruf di atas" />
          </div>

          <button type="submit" className="btn btn-success" style={{ width: '100%', marginTop: '10px' }}>Daftar Sekarang</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Kembali ke Login</Link>
        </p>
      </div>
    </div>
  );
}