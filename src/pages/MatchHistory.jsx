import React from 'react';

function MatchHistory() {
  const mockMatches = [
    {
      sport: 'Basketball',
      date: 'July 10, 2026',
      score: '21 - 16',
      outcome: 'WIN'
    },
    {
      sport: 'Pickleball',
      date: 'July 5, 2026',
      score: '8 - 11',
      outcome: 'LOSS'
    }
  ];

  return (
    <div className="match-container">
      {/* Scope Notice Banner */}
      <div className="partner-banner" style={{ background: 'rgba(124, 58, 237, 0.1)', borderLeft: '4px solid #7c3aed', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6d28d9', fontWeight: '500' }}>
          📢 <strong>Notice</strong>: This page is for <strong>Partner A (@Harini Thirunavukkarasan)</strong>'s feature. A static mockup is shown here for integration.
        </p>
      </div>

      <div className="flex-between header-row" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Personal Match History (Mockup)</h1>
          <p className="page-subtitle">Track scores, games played, and win/loss percentages.</p>
        </div>
        <button className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          + Add New Result
        </button>
      </div>

      {/* Static Stats Cards */}
      <div className="stats-row grid-cols-4" style={{ marginBottom: '2.5rem', opacity: 0.8 }}>
        <div className="card stat-card flex-center flex-column">
          <span className="stat-label">Total Games</span>
          <span className="stat-value">12</span>
        </div>
        <div className="card stat-card flex-center flex-column" style={{ borderLeft: '4px solid #22c55e' }}>
          <span className="stat-label">Wins</span>
          <span className="stat-value" style={{ color: '#22c55e' }}>8</span>
        </div>
        <div className="card stat-card flex-center flex-column" style={{ borderLeft: '4px solid #ef4444' }}>
          <span className="stat-label">Losses</span>
          <span className="stat-value" style={{ color: '#ef4444' }}>4</span>
        </div>
        <div className="card stat-card flex-center flex-column" style={{ borderLeft: '4px solid #7c3aed' }}>
          <span className="stat-label">Win Rate</span>
          <span className="stat-value" style={{ color: '#7c3aed' }}>67%</span>
        </div>
      </div>

      {/* Static Logs */}
      <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Match Logs</h2>
      <div className="card match-list-card" style={{ padding: '0', opacity: 0.85 }}>
        <div className="match-list-wrapper">
          {mockMatches.map((match, idx) => (
            <div key={idx} className="match-log-row flex-between" style={{ pointerEvents: 'none' }}>
              <div className="flex-center" style={{ gap: '1rem' }}>
                <span className="match-sport-icon">{match.sport === 'Basketball' ? '🏀' : '🏓'}</span>
                <div>
                  <h3 className="match-sport-title">{match.sport}</h3>
                  <span className="match-date">{match.date}</span>
                </div>
              </div>

              <div className="flex-center" style={{ gap: '2rem' }}>
                <div className="score-box">
                  <span className="score-label">Score:</span>
                  <strong className="score-value">{match.score}</strong>
                </div>

                <span className={`badge ${match.outcome === 'WIN' ? 'badge-outcome-win' : 'badge-outcome-loss'}`}>
                  {match.outcome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-row { margin-bottom: 2.5rem; }
        .stat-card { padding: 1.5rem; text-align: center; }
        .stat-label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; }
        .stat-value { font-size: 2.25rem; font-weight: 800; color: #1e293b; line-height: 1; }
        .grid-cols-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        @media (max-width: 900px) { .grid-cols-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .grid-cols-4 { grid-template-columns: 1fr; } }
        .match-log-row { padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .match-log-row:last-child { border-bottom: none; }
        .match-sport-icon { font-size: 1.75rem; }
        .match-sport-title { font-size: 1.05rem; font-weight: 700; color: #1e293b; }
        .match-date { font-size: 0.8rem; color: #64748b; }
        .score-box { font-size: 0.85rem; color: #64748b; }
        .score-value { font-size: 1.05rem; color: #1e293b; margin-left: 0.4rem; }
      `}</style>
    </div>
  );
}

export default MatchHistory;
