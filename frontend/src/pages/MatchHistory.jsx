import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../components/Modal';
import './MatchHistory.css';

function MatchHistory({ currentUser }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal + form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [sport, setSport] = useState('Basketball');
  const [score, setScore] = useState('');
  const [outcome, setOutcome] = useState('WIN');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  const fetchMatches = () => {
    setLoading(true);
    fetch(`/api/matches/${currentUser}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser) fetchMatches();
  }, [currentUser]);

  const handleOpenAdd = () => {
    setEditingMatch(null);
    setSport('Basketball');
    setScore('');
    setOutcome('WIN');
    setDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (match) => {
    setEditingMatch(match);
    setSport(match.sport);
    setScore(match.score);
    setOutcome(match.outcome);
    setDate(match.date);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!score || !date) return;

    setSubmitting(true);
    const body = { sport, userId: currentUser, score, outcome, date };
    const url = editingMatch
      ? `/api/matches/${editingMatch._id}`
      : '/api/matches';
    const method = editingMatch ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save result.');
        setSubmitting(false);
        return;
      }
      setIsModalOpen(false);
      fetchMatches();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (matchId) => {
    if (!confirm('Delete this match result?')) return;
    try {
      const res = await fetch(`/api/matches/${matchId}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to delete result.');
        return;
      }
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div
        className="match-container"
        style={{ textAlign: 'center', padding: '4rem 1rem' }}
      >
        <h1 className="page-title">My Match History</h1>
        <p className="page-subtitle">
          Please log in to track your match results.
        </p>
      </div>
    );
  }

  // Compute stats
  const total = matches.length;
  const wins = matches.filter((m) => m.outcome === 'WIN').length;
  const losses = total - wins;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <div className="match-container">
      <div
        className="flex-between header-row"
        style={{ marginBottom: '1.5rem' }}
      >
        <h1 className="page-title">My Match History</h1>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          + Add New Result
        </button>
      </div>

      {/* Stats */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <span>
            Total Games: <strong>{total}</strong>
          </span>
          <span>
            Wins: <strong style={{ color: '#22c55e' }}>{wins}</strong>
          </span>
          <span>
            Losses: <strong style={{ color: '#ef4444' }}>{losses}</strong>
          </span>
          <span>
            Win Rate: <strong style={{ color: '#7c3aed' }}>{winRate}%</strong>
          </span>
        </div>
      </div>

      {/* Match list */}
      {loading ? (
        <div className="flex-center loading-text">Loading match history...</div>
      ) : matches.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {matches.slice(0, visibleCount).map((match) => (
            <div
              key={match._id}
              className="card flex-between"
              style={{
                borderLeft:
                  match.outcome === 'WIN'
                    ? '5px solid #22c55e'
                    : '5px solid #ef4444',
              }}
            >
              <div>
                <h3 className="match-sport-title">{match.sport}</h3>
                <p className="match-date">{match.date}</p>
                <p>Score: {match.score}</p>
                <p>
                  Result:{' '}
                  <span
                    className={`badge ${match.outcome === 'WIN' ? 'badge-outcome-win' : 'badge-outcome-loss'}`}
                  >
                    {match.outcome}
                  </span>
                </p>
              </div>
              <div className="flex-center" style={{ gap: '0.5rem' }}>
                <button
                  onClick={() => handleOpenEdit(match)}
                  className="btn btn-outline btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(match._id)}
                  className="btn btn-outline btn-sm hover-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex-center empty-state-card">
          <p>
            No match results yet. Click &ldquo;+ Add New Result&rdquo; to log
            one.
          </p>
        </div>
      )}

      {matches.length > visibleCount && (
        <div className="flex-center" style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => setVisibleCount(visibleCount + 24)}
            className="btn btn-outline"
          >
            Load More Results
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMatch ? 'Edit Match Result' : 'Add Match Result'}
        footerButtons={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Saving...' : 'Save Result'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="m-sport">
              Sport
            </label>
            <select
              id="m-sport"
              className="form-control"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            >
              <option value="Basketball">Basketball</option>
              <option value="Pickleball">Pickleball</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="m-date">
              Date
            </label>
            <input
              id="m-date"
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="m-score">
              Score
            </label>
            <input
              id="m-score"
              type="text"
              className="form-control"
              placeholder="e.g. 21 - 16"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="m-outcome">
              Result
            </label>
            <select
              id="m-outcome"
              className="form-control"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            >
              <option value="WIN">WIN</option>
              <option value="LOSS">LOSS</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}

MatchHistory.propTypes = {
  currentUser: PropTypes.string,
};

export default MatchHistory;
