import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Home.css';

function Home({ currentUser }) {
  const [featuredCourts, setFeaturedCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch courts');
        return res.json();
      })
      .then((data) => {
        // Recommend top rated courts
        const sorted = data.sort((a, b) => b.rating - a.rating).slice(0, 2);
        setFeaturedCourts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(
          <span key={i} className="star">
            &#9733;
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-empty">
            &#9733;
          </span>
        );
      }
    }
    return <span className="rating-stars">{stars}</span>;
  };

  return (
    <div className="home-container">
      {/* Hero Banner Section */}
      <section className="hero-section">
        <h1 className="hero-title">Find Your Next Game</h1>
        <p className="hero-subtitle">
          Join local pickup games, discover courts, and prepare your gear before
          you play.
        </p>
        <div className="flex-center" style={{ gap: '1.25rem' }}>
          <Link to="/games" className="btn btn-accent btn-lg-padding">
            Find a Game
          </Link>
          <Link
            to="/create-game"
            className="btn btn-outline btn-lg-padding btn-hero-outline"
          >
            Create a Game
          </Link>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="section">
        <h2 className="section-title">Popular Sports</h2>
        <div className="grid-cols-3">
          <div className="card card-hover sport-card flex-center flex-column">
            <span className="sport-icon">🏀</span>
            <h3>Basketball</h3>
            <p>Half court or full court pickup games in local parks.</p>
            <Link to="/games?sport=Basketball" className="sport-link">
              Browse Basketball Games &rarr;
            </Link>
          </div>

          <div className="card card-hover sport-card flex-center flex-column">
            <span className="sport-icon">🏓</span>
            <h3>Pickleball</h3>
            <p>The fastest-growing racquet sport. Find doubles partners.</p>
            <Link to="/games?sport=Pickleball" className="sport-link">
              Browse Pickleball Games &rarr;
            </Link>
          </div>

          <div className="card card-hover sport-card flex-center flex-column">
            <span className="sport-icon">🎾</span>
            <h3>Tennis</h3>
            <p>Singles rallies or doubles matches. Meet other local hitters.</p>
            <Link to="/games?sport=Tennis" className="sport-link">
              Browse Tennis Matches &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Courts Section */}
      <section className="section" style={{ marginTop: '3rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Recommended Court Locations</h2>
          <Link to="/courts" className="btn btn-outline btn-sm">
            View Directory
          </Link>
        </div>

        {loading ? (
          <div
            className="flex-center"
            style={{ height: '100px', color: '#64748b' }}
          >
            Loading courts...
          </div>
        ) : featuredCourts.length > 0 ? (
          <div className="grid-cols-2">
            {featuredCourts.map((court) => (
              <div
                key={court._id}
                className="card card-hover court-featured-card"
              >
                <div
                  className="flex-between"
                  style={{ marginBottom: '0.75rem' }}
                >
                  <h3 className="court-name">{court.name}</h3>
                  {renderStars(court.rating)}
                </div>
                <p className="court-address">📍 {court.address}</p>
                <blockquote className="court-review">
                  &ldquo;{court.review}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="card flex-center"
            style={{ height: '120px', color: '#64748b' }}
          >
            No courts available. Run the seeding script to load default court
            listings!
          </div>
        )}
      </section>
    </div>
  );
}

Home.propTypes = {
  currentUser: PropTypes.string,
};

export default Home;
