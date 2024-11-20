import React from 'react';
import './Modal.css';

export function Modal({ children, show, onClose, isLarge }) {
  if (!show) return null; // Don't render if `show` is false

  return (
    <div className="modal-background">
      <div className={`modal-content ${isLarge ? 'large-modal' : ''}`}>
        <button className="close" type="button" onClick={onClose}>
          &#x2715; {/* Close icon */}
        </button>
        {children} {/* This renders the children inside the modal */}
      </div>
    </div>
  );
}
