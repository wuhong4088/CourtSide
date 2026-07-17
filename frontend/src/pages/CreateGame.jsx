import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CreateGame.css';

function CreateGame({ currentUser }) {
  const navigate = useNavigate();
  const [sport, setSport] = useState('Basketball');
  const [time, setTime] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('6');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div
        className="create-game-container"
        style={{ textAlign: 'center', padding: '4rem 1rem' }}
      >
        <h1 className="page-title">Create a Pickup Game</h1>
        <p className="page-subtitle">Please log in to create a game.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time || !location) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport,
          time,
          skillLevel,
          host: currentUser,
          location,
          maxPlayers,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create game.');
        setSubmitting(false);
        return;
      }
      navigate('/games');
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="create-game-container"
      style={{ maxWidth: '650px', margin: '0 auto' }}
    >
      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Create a Pickup Game
      </h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="sport">
              Sport Type
            </label>
            <select
              id="sport"
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
            <label className="form-label" htmlFor="time">
              Date &amp; Time
            </label>
            <input
              id="time"
              type="datetime-local"
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill">
              Skill Level
            </label>
            <select
              id="skill"
              className="form-control"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="form-control"
              placeholder="e.g. Boston Common Court"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="max">
              Maximum Players
            </label>
            <input
              id="max"
              type="number"
              min="2"
              className="form-control"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="desc">
              Description
            </label>
            <textarea
              id="desc"
              className="form-control"
              placeholder="Looking for players for a friendly game."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div
            className="flex-center"
            style={{ justifyContent: 'flex-end', gap: '1rem' }}
          >
            <Link to="/games" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateGame.propTypes = {
  currentUser: PropTypes.string,
};

export default CreateGame;
