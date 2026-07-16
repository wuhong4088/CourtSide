import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './Navbar.css';

function Navbar({ currentUser, setCurrentUser }) {
  const location = useLocation();

  // Authentication Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePersonaChange = async (e) => {
    const selected = e.target.value;
    setCurrentUser(selected);
    localStorage.setItem('courtside_user', selected);

    // Sync backend session transparently for selected persona
    try {
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: selected, password: 'password123' })
      });
      if (!res.ok) {
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: selected, password: 'password123' })
        });
      }
    } catch (err) {
      console.error('Session sync error for persona:', err);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed.');
        return;
      }

      const data = await res.json();
      setCurrentUser(data.username);
      localStorage.setItem('courtside_user', data.username);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Network error during login.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed.');
        return;
      }

      const data = await res.json();
      setCurrentUser(data.username);
      localStorage.setItem('courtside_user', data.username);
      setShowSignUp(false);
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Network error during registration.');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setCurrentUser('Morgan'); // fallback to default persona
        localStorage.setItem('courtside_user', 'Morgan');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
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
          <span onClick={() => { setShowLogin(true); setUsername(''); setPassword(''); setError(''); }} className="nav-link mock-link" style={{ cursor: 'pointer' }}>Login</span>
          <span onClick={() => { setShowSignUp(true); setUsername(''); setPassword(''); setError(''); }} className="nav-link mock-link" style={{ cursor: 'pointer' }}>Sign Up</span>
          <span onClick={handleLogout} className="nav-link mock-link" style={{ cursor: 'pointer', color: '#dc3545' }}>Logout</span>
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

      {/* Login Modal */}
      <Modal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        title="Log In"
        footerButtons={
          <>
            <button onClick={() => setShowLogin(false)} className="btn btn-outline">Cancel</button>
            <button onClick={handleLoginSubmit} className="btn btn-primary">Log In</button>
          </>
        }
      >
        <form onSubmit={handleLoginSubmit}>
          {error && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username *</label>
            <input
              id="login-username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password *</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        title="Sign Up"
        footerButtons={
          <>
            <button onClick={() => setShowSignUp(false)} className="btn btn-outline">Cancel</button>
            <button onClick={handleSignUpSubmit} className="btn btn-primary">Sign Up</button>
          </>
        }
      >
        <form onSubmit={handleSignUpSubmit}>
          {error && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-username">Username *</label>
            <input
              id="signup-username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password *</label>
            <input
              id="signup-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </header>
  );
}

Navbar.propTypes = {
  currentUser: PropTypes.string.isRequired,
  setCurrentUser: PropTypes.func.isRequired,
};

export default Navbar;
