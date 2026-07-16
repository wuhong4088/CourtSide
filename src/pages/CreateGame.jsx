import React from 'react';
import { Link } from 'react-router-dom';

function CreateGame() {
  return (
    <div className="create-game-container" style={{ maxWidth: '650px', margin: '0 auto' }}>
      {/* Scope Notice Banner */}
      <div className="partner-banner" style={{ background: 'rgba(124, 58, 237, 0.1)', borderLeft: '4px solid #7c3aed', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6d28d9', fontWeight: '500' }}>
          📢 <strong>Integration Notice</strong>: This Create Game page is developed and owned by <strong>Partner A (@Harini Thirunavukkarasan)</strong>. A static mockup is displayed here for navigation integration purposes.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Create a Pickup Game</h1>
      </div>

      <div className="card glass-card" style={{ padding: '2rem', opacity: 0.85, pointerEvents: 'none' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Sport Type</label>
            <select className="form-control" defaultValue="Basketball" readOnly>
              <option value="Basketball">Basketball</option>
              <option value="Pickleball">Pickleball</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="text" className="form-control" defaultValue="July 18, 2026" readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="text" className="form-control" defaultValue="6:00 PM" readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skill Level</label>
            <select className="form-control" defaultValue="Intermediate" readOnly>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" defaultValue="Boston Common Court" className="form-control" readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Maximum Players</label>
            <input type="text" defaultValue="6" className="form-control" readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea defaultValue="Looking for players for a friendly game." className="form-control" readOnly />
          </div>

          <div className="form-actions flex-center" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/games" className="btn btn-outline" style={{ pointerEvents: 'auto' }}>Cancel</Link>
            <button className="btn btn-primary" disabled style={{ cursor: 'not-allowed' }}>
              Create Game
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .page-title {
          font-size: 2rem;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}

export default CreateGame;
