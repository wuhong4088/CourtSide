import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
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
        stars.push(<span key={i} className="star">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star-empty">&#9733;</span>);
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
          Join local pickup games, discover courts, and prepare your gear before you play.
        </p>
        <div className="flex-center" style={{ gap: '1.25rem' }}>
          <Link to="/games" className="btn btn-accent btn-lg-padding">Find a Game</Link>
          <Link to="/create-game" className="btn btn-outline btn-lg-padding btn-hero-outline">Create a Game</Link>
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
            <Link to="/games?sport=Basketball" className="sport-link">Browse Basketball Games &rarr;</Link>
          </div>

          <div className="card card-hover sport-card flex-center flex-column">
            <span className="sport-icon">🏓</span>
            <h3>Pickleball</h3>
            <p>The fastest-growing racquet sport. Find doubles partners.</p>
            <Link to="/games?sport=Pickleball" className="sport-link">Browse Pickleball Games &rarr;</Link>
          </div>

          <div className="card card-hover sport-card flex-center flex-column">
            <span className="sport-icon">🎾</span>
            <h3>Tennis</h3>
            <p>Singles rallies or doubles matches. Meet other local hitters.</p>
            <Link to="/games?sport=Tennis" className="sport-link">Browse Tennis Matches &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Recommended Courts Section */}
      <section className="section" style={{ marginTop: '3rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Recommended Court Locations</h2>
          <Link to="/courts" className="btn btn-outline btn-sm">View Directory</Link>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '100px', color: '#64748b' }}>Loading courts...</div>
        ) : featuredCourts.length > 0 ? (
          <div className="grid-cols-2">
            {featuredCourts.map((court) => (
              <div key={court._id} className="card card-hover court-featured-card">
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <h3 className="court-name">{court.name}</h3>
                  {renderStars(court.rating)}
                </div>
                <p className="court-address">📍 {court.address}</p>
                <blockquote className="court-review">"{court.review}"</blockquote>
              </div>
            ))}
          </div>
        ) : (
          <div className="card flex-center" style={{ height: '120px', color: '#64748b' }}>
            No courts available. Run the seeding script to load default court listings!
          </div>
        )}
      </section>

      <style>{`
        .section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
          color: #0f172a;
          position: relative;
        }

        .btn-lg-padding {
          padding: 0.9rem 2.25rem;
          font-size: 1rem;
          border-radius: 8px;
        }

        .btn-hero-outline {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.4);
        }

        .btn-hero-outline:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: #ffffff;
        }

        .sport-card {
          flex-direction: column;
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .sport-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        .sport-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .sport-card p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .sport-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: #2563eb;
          transition: transform 0.2s ease;
        }

        .sport-link:hover {
          text-decoration: underline;
        }

        .court-featured-card {
          border-left: 5px solid #7c3aed;
        }

        .court-name {
          font-size: 1.2rem;
          color: #1e293b;
        }

        .court-address {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .court-review {
          font-style: italic;
          font-size: 0.9rem;
          color: #475569;
          background: #f1f5f9;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          border-left: 3px solid #cbd5e1;
        }

        .star-empty {
          color: #cbd5e1;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

export default Home;
