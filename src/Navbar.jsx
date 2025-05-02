import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo"><Link to="/">💰 ExpenseMate</Link></h2>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/history">History</NavLink></li>
        <li><NavLink to="/visualizer">Visualizer</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
      </ul>
    </nav>
  );
}