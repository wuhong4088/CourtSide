import React from 'react';
import './MatchHistory.css';

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

    </div>
  );
}

export default MatchHistory;
