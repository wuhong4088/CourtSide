import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../components/Modal';
import './CourtDirectory.css';

function CourtDirectory({ currentUser }) {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
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
      sport,
    };

    try {
      let res;
      if (editingCourt) {
        // Edit court
        res = await fetch(`/api/courts/${editingCourt._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyContent),
        });
      } else {
        // Create court
        res = await fetch('/api/courts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyContent),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save court location.');
        setSubmitting(false);
        return;
      }

      const savedCourt = await res.json();
      if (
        editingCourt &&
        selectedCourt &&
        selectedCourt._id === editingCourt._id
      ) {
        setSelectedCourt(savedCourt);
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

  const handleOpenWriteReviewModal = (court) => {
    setEditingCourt(court);
    setRating(String(court.rating));
    setReview(court.review);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review) return;

    setSubmitting(true);
    const bodyContent = {
      name: editingCourt.name,
      address: editingCourt.address,
      sport: editingCourt.sport || 'Basketball',
      review,
      rating: parseFloat(rating),
    };

    try {
      const res = await fetch(`/api/courts/${editingCourt._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyContent),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save review.');
        setSubmitting(false);
        return;
      }

      const updatedCourt = await res.json();
      setSelectedCourt(updatedCourt);
      setIsReviewModalOpen(false);
      fetchCourts();
    } catch (err) {
      console.error(err);
      alert('Network error saving review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (
      !confirm(
        'Are you sure you want to delete this court listing? This cannot be undone.'
      )
    )
      return;

    try {
      const res = await fetch(`/api/courts/${courtId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete court listing.');
        return;
      }

      setSelectedCourt(null);
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
    <div className="courts-container">
      <div className="flex-between header-row">
        <div>
          <h1 className="page-title">Court Directory</h1>
          <p className="page-subtitle">
            Recommending sports courts, surfaces, lighting, and park conditions
            in your local area.
          </p>
        </div>
        {currentUser && !selectedCourt && (
          <button onClick={handleOpenAddModal} className="btn btn-success">
            + Add a Court
          </button>
        )}
      </div>

      {selectedCourt ? (
        /* Stage 2: Selected Court Details & Reviews */
        <div
          className="card selected-court-details-card"
          style={{ padding: '20px' }}
        >
          <div
            className="flex-between"
            style={{
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                {selectedCourt.name}
              </h2>
              <p
                className="court-location-text"
                style={{ fontSize: '1rem', color: '#555555', marginBottom: 0 }}
              >
                {selectedCourt.sport} · {selectedCourt.address}
              </p>
            </div>
            <div className="flex-center" style={{ gap: '0.5rem' }}>
              {renderStars(selectedCourt.rating)}
              <span className="rating-number" style={{ fontSize: '1.1rem' }}>
                {selectedCourt.rating} / 5
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.20rem', marginBottom: '0.5rem' }}>
              Community Review
            </h3>
            <div
              className="court-review-box"
              style={{ background: '#f8f9fa', padding: '1rem' }}
            >
              <p className="review-quote" style={{ fontSize: '0.95rem' }}>
                “{selectedCourt.review}”
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="flex-center"
            style={{
              gap: '0.75rem',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setSelectedCourt(null)}
              className="btn btn-outline"
            >
              &larr; Back to Directory
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => handleOpenWriteReviewModal(selectedCourt)}
                  className="btn btn-success"
                >
                  Write/Update Review
                </button>
                <button
                  onClick={() => handleOpenEditModal(selectedCourt)}
                  className="btn btn-outline"
                >
                  Edit Court Info
                </button>
                <button
                  onClick={() => handleDeleteCourt(selectedCourt._id)}
                  className="btn btn-danger"
                >
                  Delete Court
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Stage 1: Directory Search and Listing Grid */
        <>
          {/* Search & Filter Bar */}
          <div className="card search-card flex-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by court or address"
                className="form-control"
                aria-label="Search by court or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="form-control"
                style={{ width: '180px' }}
                aria-label="Filter by sport type"
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

          {loading ? (
            <div className="flex-center loading-text">
              Loading court directory...
            </div>
          ) : courts.length > 0 ? (
            <div className="courts-list grid-cols-2">
              {courts.map((court) => (
                <div
                  key={court._id}
                  className="card card-hover court-directory-card flex-between flex-column"
                >
                  <div className="court-card-top">
                    <h3 className="court-title-text">{court.name}</h3>
                    <p className="court-location-text">
                      {court.sport || 'Basketball'} · {court.address}
                    </p>
                    <div className="court-stars-row">
                      {renderStars(court.rating)}
                      <span className="rating-number">{court.rating}</span>
                    </div>
                  </div>

                  <div className="court-card-bottom flex-center">
                    <button
                      onClick={() => setSelectedCourt(court)}
                      className="btn btn-success btn-sm"
                    >
                      View Details &amp; Reviews
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card flex-center empty-state-card">
              <div>
                <p className="empty-state-title">No courts found</p>
                <p>
                  Try searching for another keyword, or click &ldquo;+ Add a
                  Court&rdquo; to list a new location.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Court Info Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourt ? 'Edit Court Location' : 'Recommend a Court'}
        footerButtons={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? 'Saving...' : 'Save Court'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="court-name">
              Court Facility Name *
            </label>
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
            <label className="form-label" htmlFor="court-address">
              Address / Location *
            </label>
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
            <label className="form-label" htmlFor="court-sport">
              Sport Type *
            </label>
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

          {!editingCourt && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="court-rating">
                  Rating (1 to 5 Stars) *
                </label>
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
                <label className="form-label" htmlFor="court-review">
                  Review / Facility Conditions *
                </label>
                <textarea
                  id="court-review"
                  placeholder="Describe the court surface quality, hoops/nets, lighting, park amenities, parking accessibility..."
                  className="form-control"
                  required
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Write / Update Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Write Review for ${editingCourt?.name || ''}`}
        footerButtons={
          <>
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleReviewSubmit}
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? 'Saving...' : 'Save Review'}
            </button>
          </>
        }
      >
        <form onSubmit={handleReviewSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="review-rating">
              Rating (1 to 5 Stars) *
            </label>
            <select
              id="review-rating"
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
            <label className="form-label" htmlFor="review-text">
              Review / Facility Conditions *
            </label>
            <textarea
              id="review-text"
              placeholder="Describe surface quality, lighting, hoops/nets, accessibility..."
              className="form-control"
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

CourtDirectory.propTypes = {
  currentUser: PropTypes.string,
};

export default CourtDirectory;
