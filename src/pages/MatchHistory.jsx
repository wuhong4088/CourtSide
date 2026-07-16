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

      <div className="flex-between header-row" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">My Match History</h1>
        <button className="btn btn-outline" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          Add New Result
        </button>
      </div>

      {/* Static Stats Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', fontWeight: '500', color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <span>Total Games: <strong>12</strong></span>
          <span>Wins: <strong style={{ color: '#22c55e' }}>8</strong></span>
          <span>Losses: <strong style={{ color: '#ef4444' }}>4</strong></span>
          <span>Win Rate: <strong style={{ color: '#7c3aed' }}>67%</strong></span>
        </div>
      </div>

      {/* Static Logs */}
      <div className="match-list-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockMatches.map((match, idx) => (
          <div key={idx} className="card match-card" style={{ padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: match.outcome === 'WIN' ? '5px solid #22c55e' : '5px solid #ef4444' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0' }}>{match.sport}</h3>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>{match.date}</p>
            <p style={{ margin: '0', fontSize: '0.95rem' }}>Score: {match.score}</p>
            <p style={{ margin: '0', fontSize: '0.95rem' }}>
              Result: <span className={`badge ${match.outcome === 'WIN' ? 'badge-outcome-win' : 'badge-outcome-loss'}`}>{match.outcome}</span>
            </p>
            
            <div className="flex-center" style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Edit</button>
              <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Delete</button>
            </div>
          </div>
        ))}
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
