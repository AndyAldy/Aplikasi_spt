import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SptList from './pages/SptList';
import SptForm from './pages/SptForm';
import SptPrint from './pages/SptPrint';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<SptList />} />
          <Route path="/create" element={<SptForm />} />
          <Route path="/edit/:id" element={<SptForm />} />
          <Route path="/print/:id" element={<SptPrint />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;