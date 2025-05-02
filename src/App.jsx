import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';
import History from './pages/History';
import Visualizer from './pages/Visualizer';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </Router>
  );
}
