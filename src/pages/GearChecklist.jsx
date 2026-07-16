import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../components/Modal';
import './GearChecklist.css';

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

  // Inline action states to match mockup buttons
  const [activeAddInputId, setActiveAddInputId] = useState(null);
  const [editingTitleChecklistId, setEditingTitleChecklistId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

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
      <div className="flex-between header-row">
        <div>
          <h1 className="page-title">My Gear Checklists</h1>
          <p className="page-subtitle">Manage, create, and verify packing equipment checklists for <strong>{currentUser}</strong>.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">+ New Checklist</button>
      </div>

      {/* Grid of Checklists */}
      {loading ? (
        <div className="flex-center loading-text">Loading packing lists...</div>
      ) : checklists.length > 0 ? (
        <div className="checklists-list grid-cols-2">
          {checklists.map((checklist) => {
            const itemsChecked = checklist.items.filter((i) => i.checked).length;
            const progressPercent = checklist.items.length > 0 
              ? Math.round((itemsChecked / checklist.items.length) * 100) 
              : 0;

            return (
              <div key={checklist._id} className="card checklist-card flex-between flex-column">
                <div>
                  <div className="flex-between card-header">
                    {editingTitleChecklistId === checklist._id ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!editTitle) return;
                          try {
                            const res = await fetch(`/api/checklist/${checklist._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: editTitle,
                                items: checklist.items
                              })
                            });
                            if (res.ok) {
                              setChecklists(checklists.map(c => c._id === checklist._id ? { ...c, title: editTitle } : c));
                              setEditingTitleChecklistId(null);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="flex-center edit-title-form"
                      >
                        <input
                          type="text"
                          className="form-control edit-title-input"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Save</button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingTitleChecklistId(null)}>Cancel</button>
                      </form>
                    ) : (
                      <h3 className="checklist-title">{checklist.title}</h3>
                    )}
                  </div>

                  {/* Progress bar */}
                  {checklist.items.length > 0 && (
                    <div className="progress-bar-container">
                      <div className="flex-between progress-text">
                        <span>Progress</span>
                        <span>{itemsChecked} of {checklist.items.length} items packed ({progressPercent}%)</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progressPercent}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  {checklist.items.length > 0 ? (
                    <div className="items-list">
                      {checklist.items.map((item, idx) => (
                        <div key={idx} className="checklist-item flex-between">
                          <label className="flex-center checklist-label">
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
                    <p className="empty-checklist-text">
                      No gear added yet. Click &ldquo;Add Item&rdquo; below.
                    </p>
                  )}
                </div>

                {/* Inline Add Item Form */}
                {activeAddInputId === checklist._id && (
                  <form 
                    onSubmit={(e) => {
                      handleAddItemToCard(e, checklist);
                      setActiveAddInputId(null);
                    }} 
                    className="flex-center add-item-form"
                  >
                    <input
                      type="text"
                      placeholder="Item name..."
                      className="form-control add-item-input"
                      value={cardInputs[checklist._id] || ''}
                      onChange={(e) => handleInputChange(checklist._id, e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary add-item-save-btn">
                      Save
                    </button>
                  </form>
                )}

                {/* Card Action Buttons (Direct alignment with mockup) */}
                <div className="flex-center card-actions">
                  <button
                    onClick={() => setActiveAddInputId(activeAddInputId === checklist._id ? null : checklist._id)}
                    className="btn btn-outline btn-sm"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setEditingTitleChecklistId(checklist._id);
                      setEditTitle(checklist.title);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChecklist(checklist._id)}
                    className="btn btn-outline btn-sm hover-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card flex-center empty-state-card">
          <div>
            <p className="empty-state-title">No checklists found</p>
            <p>Create your first packing equipment checklist by clicking &ldquo;+ New Checklist&rdquo; above.</p>
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

    </div>
  );
}

GearChecklist.propTypes = {
  currentUser: PropTypes.string.isRequired
};

export default GearChecklist;
