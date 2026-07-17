import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './GameFeed.css';

function GameFeed({ currentUser }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  const fetchGames = () => {
    setLoading(true);
    let url = '/api/games?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (sport) url += `sport=${encodeURIComponent(sport)}&`;
    if (skillLevel) url += `skillLevel=${encodeURIComponent(skillLevel)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setVisibleCount(24);
    fetchGames();
  }, [search, sport, skillLevel]);

  const handleJoin = async (game) => {
    if (!currentUser) {
      alert('Please log in to join a game.');
      return;
    }
    try {
      const res = await fetch(`/api/games/${game._id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to join game.');
        return;
      }
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed-container">
      <div
        className="flex-between header-row"
        style={{ marginBottom: '1.5rem' }}
      >
        <div>
          <h1 className="page-title">Find Pickup Games</h1>
          <p className="page-subtitle">
            Browse active pickup games around Boston.
          </p>
        </div>
        <Link to="/create-game" className="btn btn-primary">
          + Create New Game
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="card search-card flex-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by location or host"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: '160px' }}
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          <option value="">All Sports</option>
          <option value="Basketball">Basketball</option>
          <option value="Pickleball">Pickleball</option>
          <option value="Tennis">Tennis</option>
        </select>
        <select
          className="form-control"
          style={{ width: '160px' }}
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
        >
          <option value="">All Skill Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Game Cards */}
      {loading ? (
        <div className="flex-center loading-text">Loading games...</div>
      ) : games.length > 0 ? (
        <div className="games-grid">
          {games.slice(0, visibleCount).map((game) => (
            <div key={game._id} className="card game-card">
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                  <span className="badge badge-sport">{game.sport}</span>
                  <span className="badge badge-level">{game.skillLevel}</span>
                </div>
                <span className="player-count">
                  <strong>
                    {game.participants.length} of {game.maxPlayers} players
                  </strong>
                </span>
              </div>

              <div className="game-details" style={{ marginBottom: '1rem' }}>
                <p className="detail-row">📅 {game.time.replace('T', ' · ')}</p>
                <p className="detail-row">📍 {game.location}</p>
                <p className="detail-row">👑 Host: {game.host}</p>
              </div>

              <button
                onClick={() => handleJoin(game)}
                className="btn btn-secondary"
                disabled={game.participants.length >= game.maxPlayers}
              >
                {game.participants.length >= game.maxPlayers
                  ? 'Game Full'
                  : 'Join Game'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex-center empty-state-card">
          <p>
            No games found. Click &ldquo;+ Create New Game&rdquo; to post one.
          </p>
        </div>
      )}

      {games.length > visibleCount && (
        <div className="flex-center" style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => setVisibleCount(visibleCount + 24)}
            className="btn btn-outline"
          >
            Load More Games
          </button>
        </div>
      )}
    </div>
  );
}

GameFeed.propTypes = {
  currentUser: PropTypes.string,
};

export default GameFeed;
