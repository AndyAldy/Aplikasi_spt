import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="no-print" style={{ background: '#333', padding: '15px', color: 'white', display: 'flex', gap: '20px' }}>
      <b style={{ marginRight: '20px' }}>Aplikasi SPT (Andy)</b>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Data SPT</Link>
      <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>+ Buat SPT</Link>
    </nav>
  );
}