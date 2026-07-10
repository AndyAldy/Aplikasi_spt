import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user'); // Hapus sesi
    navigate('/login'); // Balik ke login
  };

  return (
    <nav className="navbar no-print" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <b>Aplikasi SPT</b>
        <Link to="/">Data SPT</Link>
        <Link to="/create">+ Buat SPT</Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Halo, {user.nama_lengkap || 'Admin'}</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '5px 10px' }}>Logout</button>
      </div>
    </nav>
  );
}