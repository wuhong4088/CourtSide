import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.35rem;
          color: #0f172a;
        }

        .logo-emoji {
          font-size: 1.5rem;
        }

        .logo-text {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
          padding: 0.25rem 0.5rem;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #2563eb;
        }

        .nav-link.active {
          color: #2563eb;
          font-weight: 600;
          border-bottom-color: #2563eb;
        }

        .navbar-user-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }

        .persona-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
        }

        .persona-dropdown {
          background: transparent;
          border: none;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          outline: none;
        }

        .user-indicator {
          font-size: 0.8rem;
          color: #475569;
          border-left: 1px solid #cbd5e1;
          padding-left: 0.5rem;
          margin-left: 0.25rem;
        }

        @media (max-width: 768px) {
          .navbar-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .navbar-links {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
