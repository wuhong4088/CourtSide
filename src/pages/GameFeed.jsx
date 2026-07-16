import React from 'react';

function GameFeed() {
  // Static mock data strictly for visual integration
  const mockGames = [
    {
      sport: 'Basketball',
      time: 'July 18, 2026 · 6:00 PM',
      location: 'Boston Common Court',
      level: 'Intermediate',
      joined: '3 of 6 players',
      host: 'Alex'
    },
    {
      sport: 'Pickleball',
      time: 'July 20, 2026 · 10:00 AM',
      location: 'Northeastern Recreation Center',
      level: 'Beginner',
      joined: '2 of 4 players',
      host: 'Jordan'
    }
  ];

  return (
    <div className="feed-container">
      {/* Scope Notice Banner */}
      <div className="partner-banner" style={{ background: 'rgba(124, 58, 237, 0.1)', borderLeft: '4px solid #7c3aed', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6d28d9', fontWeight: '500' }}>
          📢 <strong>Notice</strong>: This page is for <strong>Partner A (@Harini Thirunavukkarasan)</strong>'s feature. A static mockup is shown here for integration.
        </p>
      </div>

      <div className="flex-between header-row" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Find Pickup Games (Mockup)</h1>
          <p className="page-subtitle">Browse active pickup games around Boston.</p>
        </div>
        <button className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          + Create New Game
        </button>
      </div>

      {/* Static Filters */}
      <div className="card filters-card flex-between" style={{ gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', opacity: 0.7, pointerEvents: 'none' }}>
        <div className="filter-group flex-1">
          <input type="text" placeholder="Search games..." className="form-control" readOnly />
        </div>
        <div className="filter-dropdowns flex-center" style={{ gap: '1rem' }}>
          <select className="form-control" readOnly>
            <option>All Sports</option>
          </select>
          <select className="form-control" readOnly>
            <option>All Skill Levels</option>
          </select>
        </div>
      </div>

      {/* Games Feed */}
      <div className="games-grid">
        {mockGames.map((game, idx) => (
          <div key={idx} className="card game-card" style={{ opacity: 0.85 }}>
            <div className="flex-between card-header-row" style={{ marginBottom: '1rem' }}>
              <div className="flex-center" style={{ gap: '0.5rem' }}>
                <span className="game-sport-icon">{game.sport === 'Basketball' ? '🏀' : '🏓'}</span>
                <span className="badge badge-sport">{game.sport}</span>
                <span className="badge badge-level">{game.level}</span>
              </div>
              <span className="player-count">
                <strong>{game.joined}</strong>
              </span>
            </div>

            <div className="game-details" style={{ marginBottom: '1.25rem' }}>
              <p className="detail-row">📅 {game.time}</p>
              <p className="detail-row">📍 {game.location}</p>
              <p className="detail-row">👑 Host: {game.host}</p>
            </div>

            <div className="flex-between game-actions" style={{ gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline flex-1" disabled style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                Log Match Result
              </button>
              <button className="btn btn-secondary flex-1" disabled style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                Join Game
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .page-title { font-size: 2rem; color: #0f172a; }
        .page-subtitle { color: #64748b; font-size: 0.95rem; }
        .flex-1 { flex: 1; }
        .filters-card { padding: 1rem 1.5rem; background: #ffffff; }
        .games-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        @media (max-width: 900px) { .games-grid { grid-template-columns: 1fr; } }
        .game-sport-icon { font-size: 1.5rem; }
        .player-count { font-size: 0.85rem; color: #64748b; }
        .detail-row { font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155; }
      `}</style>
    </div>
  );
}

export default GameFeed;
