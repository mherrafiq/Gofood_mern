import React from 'react';
import ReactDOM from 'react-dom';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '20px',
  zIndex: 1000,
  borderRadius: '10px',
  maxWidth: '800px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
};

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
};

export default function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />
      <div style={MODAL_STYLES}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: 'none',
            fontSize: '25px',
            cursor: 'pointer',
            color: '#999'
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </>,
    document.getElementById('cart-root')
  );
}