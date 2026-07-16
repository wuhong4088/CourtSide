import React, { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children, footerButtons }) {
  // Add keyboard ESC listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header flex-between">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footerButtons && (
          <div className="modal-footer flex-center" style={{ justifyContent: 'flex-end', gap: '0.75rem' }}>
            {footerButtons}
          </div>
        )}
      </div>
      <style>{`
        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.75rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease;
          line-height: 1;
        }

        .close-btn:hover {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}

export default Modal;
