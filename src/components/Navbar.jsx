import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

function Navbar({ currentUser, setCurrentUser }) {
  const location = useLocation();

  const handlePersonaChange = (e) => {
    setCurrentUser(e.target.value);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-emoji">🏀</span>
          <span className="logo-text">CourtSide</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/games" className={`nav-link ${isActive('/games')}`}>Find Games</Link>
          <Link to="/matches" className={`nav-link ${isActive('/matches')}`}>Match History</Link>
          <Link to="/courts" className={`nav-link ${isActive('/courts')}`}>Courts</Link>
          <Link to="/checklists" className={`nav-link ${isActive('/checklists')}`}>Gear Checklist</Link>
          <span className="nav-link mock-link" style={{ cursor: 'pointer', opacity: 0.8 }}>Login</span>
          <span className="nav-link mock-link" style={{ cursor: 'pointer', opacity: 0.8 }}>Sign Up</span>
        </nav>

        <div className="navbar-user-actions">
          <label htmlFor="persona-select" className="persona-label">Persona:</label>
          <select 
            id="persona-select" 
            value={currentUser} 
            onChange={handlePersonaChange}
            className="persona-dropdown"
          >
            <option value="Alex">Alex (Social Matcher)</option>
            <option value="Taylor">Taylor (Competitor)</option>
            <option value="Jordan">Jordan (Reviewer)</option>
            <option value="Morgan">Morgan (Gear Checklist)</option>
          </select>
          <span className="user-indicator">
            Logged in: <strong>{currentUser}</strong>
          </span>
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  currentUser: PropTypes.string.isRequired,
  setCurrentUser: PropTypes.func.isRequired,
};

export default Navbar;
