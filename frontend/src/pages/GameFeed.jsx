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
  const [date, setDate] = useState('');
  const [myGamesOnly, setMyGamesOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  const fetchGames = () => {
    setLoading(true);
    let url = '/api/games?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (sport) url += `sport=${encodeURIComponent(sport)}&`;
    if (skillLevel) url += `skillLevel=${encodeURIComponent(skillLevel)}&`;
    if (date) url += `date=${encodeURIComponent(date)}&`;

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
  }, [search, sport, skillLevel, date]);

  const handleJoin = async (game) => {
    if (!currentUser) {
      alert('Please log in to join a game.');
      return;
    }
    if (!confirm('Join this pickup game?')) return;
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
      setToastMessage('Successfully joined the pickup game!');
      setTimeout(() => {
        setToastMessage('');
      }, 3000);
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async (game) => {
    if (!confirm('Leave this pickup game?')) return;
    try {
      const res = await fetch(`/api/games/${game._id}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to leave game.');
        return;
      }
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const displayedGames = myGamesOnly
    ? games.filter(
        (game) => currentUser && game.participants.includes(currentUser)
      )
    : games;

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
        <Link to="/create-game" className="btn btn-success">
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
            aria-label="Search by location or host"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: '160px' }}
          aria-label="Filter by sport"
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
          aria-label="Filter by skill level"
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
        >
          <option value="">All Skill Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input
          type="date"
          className="form-control"
          style={{ width: '160px' }}
          aria-label="Filter by date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {currentUser && (
          <label
            className="flex-center"
            style={{ gap: '0.4rem', fontSize: '0.9rem' }}
          >
            <input
              type="checkbox"
              checked={myGamesOnly}
              onChange={(e) => {
                setMyGamesOnly(e.target.checked);
                setVisibleCount(24);
              }}
            />
            My Games Only
          </label>
        )}
      </div>

      {/* Game Cards */}
      {loading ? (
        <div className="flex-center loading-text">Loading games...</div>
      ) : displayedGames.length > 0 ? (
        <div className="games-grid">
          {displayedGames.slice(0, visibleCount).map((game) => {
            const isHost = currentUser && currentUser === game.host;
            const isJoined =
              currentUser && game.participants.includes(currentUser);
            const isFull = game.participants.length >= game.maxPlayers;
            const isPast = new Date(game.time) < new Date();

            return (
              <div
                key={game._id}
                className={`card game-card${isPast ? ' game-card--past' : ''}`}
              >
                {isPast && (
                  <span className="badge past-game-badge">Past Game</span>
                )}
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <div className="flex-center" style={{ gap: '0.5rem' }}>
                    <span className="badge badge-sport">{game.sport}</span>
                    <span className="badge badge-level">{game.skillLevel}</span>
                    {isJoined && !isHost && (
                      <span className="badge badge-outcome-win">Joined</span>
                    )}
                  </div>
                  <span className="player-count">
                    <strong>
                      {game.participants.length} of {game.maxPlayers} players
                    </strong>
                  </span>
                </div>

                <div className="game-details" style={{ marginBottom: '1rem' }}>
                  <p className="detail-row">
                    📅 {game.time.replace('T', ' · ')}
                  </p>
                  <p className="detail-row">📍 {game.location}</p>
                  <p className="detail-row">👑 Host: {game.host}</p>
                </div>

                <div
                  className="participants-section"
                  style={{ marginBottom: '1rem' }}
                >
                  <p
                    className="detail-row-title"
                    style={{
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Players Joined:
                  </p>
                  <div
                    className="participants-list"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.25rem',
                    }}
                  >
                    {game.participants.map((participant, idx) => (
                      <span
                        key={idx}
                        className="badge participant-badge"
                        style={{
                          backgroundColor: '#e2e8f0',
                          color: '#1e293b',
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        👤 {participant}
                      </span>
                    ))}
                  </div>
                </div>

                {isHost ? (
                  <button className="btn btn-outline" disabled>
                    You are hosting
                  </button>
                ) : isJoined ? (
                  <button
                    onClick={() => handleLeave(game)}
                    className="btn btn-danger"
                  >
                    Leave Game
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(game)}
                    className="btn btn-success"
                    disabled={isFull || isPast}
                  >
                    {isPast
                      ? 'Game Has Passed'
                      : isFull
                        ? 'Game Full'
                        : 'Join Game'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card flex-center empty-state-card">
          <p>
            {myGamesOnly
              ? "You haven't joined any games yet."
              : 'No games found. Click "+ Create New Game" to post one.'}
          </p>
        </div>
      )}

      {displayedGames.length > visibleCount && (
        <div className="flex-center" style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => setVisibleCount(visibleCount + 24)}
            className="btn btn-outline"
          >
            Load More Games
          </button>
        </div>
      )}

      {toastMessage && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
}

GameFeed.propTypes = {
  currentUser: PropTypes.string,
};

export default GameFeed;
