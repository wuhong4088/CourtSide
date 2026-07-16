import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';

function GearChecklist({ currentUser }) {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [defaultItemsText, setDefaultItemsText] = useState(''); // items separated by commas
  const [submitting, setSubmitting] = useState(false);

  // Inputs for adding items on cards
  const [cardInputs, setCardInputs] = useState({});

  // Fetch checklists from database
  const fetchChecklists = () => {
    setLoading(true);
    fetch(`/api/checklist/${currentUser}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch checklists');
        return res.json();
      })
      .then((data) => {
        setChecklists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChecklists();
  }, [currentUser]);

  // Handle open modal
  const handleOpenAddModal = () => {
    setNewTitle('');
    setDefaultItemsText('');
    setIsModalOpen(true);
  };

  // Create new checklist
  const handleCreateChecklist = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    setSubmitting(true);

    // Parse default items
    const parsedItems = defaultItemsText
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((name) => ({ name, checked: false }));

    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser,
          title: newTitle,
          items: parsedItems
        })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to create checklist.');
        setSubmitting(false);
        return;
      }

      setIsModalOpen(false);
      fetchChecklists();
    } catch (err) {
      console.error(err);
      alert('Network error creating checklist.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete checklist
  const handleDeleteChecklist = async (checklistId) => {
    if (!confirm('Are you sure you want to delete this checklist?')) return;

    try {
      const res = await fetch(`/api/checklist/${checklistId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete checklist.');
        return;
      }

      fetchChecklists();
    } catch (err) {
      console.error(err);
      alert('Network error deleting checklist.');
    }
  };

  // Handle toggling checkbox state
  const handleToggleItem = async (checklist, itemIndex) => {
    const updatedItems = checklist.items.map((item, idx) => 
      idx === itemIndex ? { ...item, checked: !item.checked } : item
    );

    try {
      const res = await fetch(`/api/checklist/${checklist._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: checklist.title,
          items: updatedItems
        })
      });

      if (!res.ok) {
        alert('Failed to update checkbox state.');
        return;
      }

      // Update state locally
      setChecklists(checklists.map((c) => 
        c._id === checklist._id ? { ...c, items: updatedItems } : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle adding a gear item directly to card
  const handleAddItemToCard = async (e, checklist) => {
    e.preventDefault();
    const itemText = cardInputs[checklist._id] || '';
    if (!itemText.trim()) return;

    const newItem = { name: itemText.trim(), checked: false };
    const updatedItems = [...checklist.items, newItem];

    try {
      const res = await fetch(`/api/checklist/${checklist._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: checklist.title,
          items: updatedItems
        })
      });

      if (!res.ok) {
        alert('Failed to add item.');
        return;
      }

      // Clear input
      setCardInputs({ ...cardInputs, [checklist._id]: '' });

      // Update state locally
      setChecklists(checklists.map((c) => 
        c._id === checklist._id ? { ...c, items: updatedItems } : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // Remove a single item from a checklist
  const handleRemoveItemFromCard = async (checklist, itemIndex) => {
    const updatedItems = checklist.items.filter((_, idx) => idx !== itemIndex);

    try {
      const res = await fetch(`/api/checklist/${checklist._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: checklist.title,
          items: updatedItems
        })
      });

      if (!res.ok) {
        alert('Failed to delete item.');
        return;
      }

      // Update state locally
      setChecklists(checklists.map((c) => 
        c._id === checklist._id ? { ...c, items: updatedItems } : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // Track inputs for specific cards
  const handleInputChange = (checklistId, val) => {
    setCardInputs({ ...cardInputs, [checklistId]: val });
  };

  return (
    <div className="checklists-container">
      <div className="flex-between header-row" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">My Gear Checklists</h1>
          <p className="page-subtitle">Manage, create, and verify packing equipment checklists for <strong>{currentUser}</strong>.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">+ New Checklist</button>
      </div>

      {/* Grid of Checklists */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '200px', color: '#64748b' }}>Loading packing lists...</div>
      ) : checklists.length > 0 ? (
        <div className="checklists-list grid-cols-2">
          {checklists.map((checklist) => {
            const itemsChecked = checklist.items.filter((i) => i.checked).length;
            const progressPercent = checklist.items.length > 0 
              ? Math.round((itemsChecked / checklist.items.length) * 100) 
              : 0;

            return (
              <div key={checklist._id} className="card checklist-card flex-between flex-column" style={{ alignItems: 'stretch' }}>
                <div>
                  <div className="flex-between card-header" style={{ marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                    <h3 className="checklist-title">{checklist.title}</h3>
                    <button 
                      onClick={() => handleDeleteChecklist(checklist._id)}
                      className="delete-list-btn" 
                      title="Delete Checklist"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Progress bar */}
                  {checklist.items.length > 0 && (
                    <div className="progress-bar-container" style={{ marginBottom: '1.25rem' }}>
                      <div className="flex-between progress-text" style={{ marginBottom: '0.25rem', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                        <span>Progress</span>
                        <span>{itemsChecked} of {checklist.items.length} items packed ({progressPercent}%)</span>
                      </div>
                      <div className="progress-track" style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            height: '100%', 
                            width: `${progressPercent}%`, 
                            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
                            transition: 'width 0.3s ease'
                          }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  {checklist.items.length > 0 ? (
                    <div className="items-list" style={{ marginBottom: '1.25rem' }}>
                      {checklist.items.map((item, idx) => (
                        <div key={idx} className="checklist-item flex-between">
                          <label className="flex-center" style={{ gap: '0.75rem', cursor: 'pointer', flex: 1, justifyContent: 'flex-start' }}>
                            <input
                              type="checkbox"
                              className="checklist-checkbox"
                              checked={item.checked}
                              onChange={() => handleToggleItem(checklist, idx)}
                            />
                            <span className={`checklist-text ${item.checked ? 'checked' : ''}`}>{item.name}</span>
                          </label>
                          <button 
                            onClick={() => handleRemoveItemFromCard(checklist, idx)}
                            className="remove-item-btn"
                            title="Remove Item"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#64748b', padding: '1rem 0', textAlign: 'center' }}>
                      No gear added yet. Use the input below to add sports equipment.
                    </p>
                  )}
                </div>

                {/* Add Item form */}
                <form 
                  onSubmit={(e) => handleAddItemToCard(e, checklist)} 
                  className="flex-center" 
                  style={{ gap: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: 'auto' }}
                >
                  <input
                    type="text"
                    placeholder="Add item (e.g. Shoes, Racket)"
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    value={cardInputs[checklist._id] || ''}
                    onChange={(e) => handleInputChange(checklist._id, e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    +
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card flex-center empty-state-card" style={{ padding: '4rem', color: '#64748b' }}>
          <div>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>No checklists found</p>
            <p>Create your first packing equipment checklist by clicking "+ New Checklist" above.</p>
          </div>
        </div>
      )}

      {/* New Checklist Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Gear Checklist"
        footerButtons={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-outline">Cancel</button>
            <button 
              onClick={handleCreateChecklist} 
              disabled={submitting} 
              className="btn btn-primary"
            >
              {submitting ? 'Creating...' : 'Create Checklist'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateChecklist}>
          <div className="form-group">
            <label className="form-label" htmlFor="checklist-title">Checklist Name *</label>
            <input
              id="checklist-title"
              type="text"
              placeholder="e.g. Pickleball Game Gear"
              className="form-control"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checklist-defaults">Pre-populate Items (optional)</label>
            <input
              id="checklist-defaults"
              type="text"
              placeholder="Enter items separated by commas (e.g. Shoes, Water Bottle, Balls)"
              className="form-control"
              value={defaultItemsText}
              onChange={(e) => setDefaultItemsText(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      <style>{`
        .checklist-card {
          min-height: 250px;
        }

        .checklist-title {
          font-size: 1.2rem;
          color: #0f172a;
          flex: 1;
        }

        .delete-list-btn {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: #cbd5e1;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .delete-list-btn:hover {
          color: #ef4444;
        }

        .remove-item-btn {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          color: #cbd5e1;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s ease;
          padding: 0 0.25rem;
        }

        .remove-item-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}

export default GearChecklist;
