import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';

function CourtDirectory({ currentUser }) {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null); // null if adding new court

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');
  const [sport, setSport] = useState('Basketball');
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [sportFilter, setSportFilter] = useState('');

  // Fetch court locations
  const fetchCourts = () => {
    setLoading(true);
    let url = '/api/courts?';
    if (searchQuery) {
      url += `search=${encodeURIComponent(searchQuery)}&`;
    }
    if (sportFilter) {
      url += `sport=${encodeURIComponent(sportFilter)}&`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch court list');
        return res.json();
      })
      .then((data) => {
        setCourts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourts();
  }, [searchQuery, sportFilter]);

  const handleOpenAddModal = () => {
    setEditingCourt(null);
    setName('');
    setAddress('');
    setRating('5');
    setReview('');
    setSport('Basketball');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (court) => {
    setEditingCourt(court);
    setName(court.name);
    setAddress(court.address);
    setRating(String(court.rating));
    setReview(court.review);
    setSport(court.sport || 'Basketball');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !review || !sport) return;

    setSubmitting(true);
    const bodyContent = {
      name,
      address,
      review,
      rating: parseFloat(rating),
      sport
    };

    try {
      let res;
      if (editingCourt) {
        // Edit court
        res = await fetch(`/api/courts/${editingCourt._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyContent)
        });
      } else {
        // Create court
        res = await fetch('/api/courts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyContent)
        });
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save court location.');
        setSubmitting(false);
        return;
      }

      setIsModalOpen(false);
      fetchCourts();
    } catch (err) {
      console.error(err);
      alert('Network error saving court location.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (!confirm('Are you sure you want to delete this court listing? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/courts/${courtId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete court listing.');
        return;
      }

      fetchCourts();
    } catch (err) {
      console.error(err);
      alert('Network error deleting court.');
    }
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    const floor = Math.floor(ratingValue);
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
    <div className="courts-container">
      <div className="flex-between header-row" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Court Directory</h1>
          <p className="page-subtitle">Recommending sports courts, surfaces, lighting, and park conditions in your local area.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">+ Add a Court</button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card search-card flex-between" style={{ gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem 1.5rem' }}>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by court or address"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <select
            className="form-control"
            style={{ width: '180px' }}
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option value="">Sport Type ▼</option>
            <option value="Basketball">Basketball</option>
            <option value="Pickleball">Pickleball</option>
            <option value="Tennis">Tennis</option>
          </select>
        </div>
      </div>

      {/* Directory Listings */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '200px', color: '#64748b' }}>Loading court directory...</div>
      ) : courts.length > 0 ? (
        <div className="courts-list grid-cols-2">
          {courts.map((court) => (
            <div key={court._id} className="card card-hover court-directory-card flex-between flex-column" style={{ alignItems: 'stretch' }}>
              <div className="court-card-top" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <h3 className="court-title-text" style={{ fontSize: '1.25rem', margin: '0' }}>{court.name}</h3>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>
                  {court.sport || 'Basketball'} · {court.address}
                </p>
                <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', margin: '0.2rem 0' }}>
                  {renderStars(court.rating)}
                  <span className="rating-number" style={{ fontSize: '0.9rem', fontWeight: '600' }}>{court.rating}</span>
                </div>
                <div className="court-review-box" style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '3px solid #7c3aed', marginTop: '0.5rem' }}>
                  <p className="review-quote" style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#334155', margin: '0' }}>
                    “{court.review}”
                  </p>
                </div>
              </div>

              <div className="court-card-bottom flex-center" style={{ justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #e2e8f0', marginTop: '1.25rem', paddingTop: '1rem' }}>
                <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                  View Details
                </button>
                <button 
                  onClick={() => handleOpenEditModal(court)}
                  className="btn btn-outline btn-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteCourt(court._id)}
                  className="btn btn-outline btn-sm hover-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex-center empty-state-card" style={{ padding: '4rem', color: '#64748b' }}>
          <div>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No courts found</p>
            <p>Try searching for another keyword, or click "+ Add a Court" to list a new location.</p>
          </div>
        </div>
      )}

      {/* Court Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourt ? 'Edit Court Location' : 'Recommend a Court'}
        footerButtons={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button 
              onClick={handleFormSubmit} 
              disabled={submitting} 
              className="btn btn-primary"
            >
              {submitting ? 'Saving...' : 'Save Court'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="court-name">Court Facility Name *</label>
            <input
              id="court-name"
              type="text"
              placeholder="e.g. Carter Playground Courts"
              className="form-control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="court-address">Address / Location *</label>
            <input
              id="court-address"
              type="text"
              placeholder="e.g. Columbus Ave, Boston, MA 02118"
              className="form-control"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="court-sport">Sport Type *</label>
            <select
              id="court-sport"
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
            <label className="form-label" htmlFor="court-rating">Rating (1 to 5 Stars) *</label>
            <select
              id="court-rating"
              className="form-control"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="court-review">Review / Facility Conditions *</label>
            <textarea
              id="court-review"
              placeholder="Describe the court surface quality, hoops/nets, lighting, park amenities, parking accessibility..."
              className="form-control"
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      <style>{`
        .court-directory-card {
          min-height: 250px;
        }

        .court-title-text {
          font-size: 1.25rem;
          color: #0f172a;
          margin-right: 0.5rem;
          flex: 1;
        }

        .rating-number {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
        }

        .court-location-text {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1rem;
        }

        .court-review-box {
          background: #f8fafc;
          border-left: 3px solid #7c3aed;
          padding: 0.75rem 1rem;
          border-radius: 6px;
        }

        .review-quote {
          font-size: 0.9rem;
          font-style: italic;
          color: #334155;
          line-height: 1.5;
        }

        .court-meta-author {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .star {
          color: #fbbf24;
        }

        .star-empty {
          color: #cbd5e1;
        }

        .hover-danger:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}

export default CourtDirectory;
