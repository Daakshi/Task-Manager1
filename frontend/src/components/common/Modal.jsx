import { X } from 'lucide-react';
import { useEffect } from 'react';
import '../../dashboard.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      {/* Modal */}
      <div
        className={`db-modal-content db-modal-content--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="db-modal-header">
          <h2 className="db-modal-title">{title}</h2>
          <button className="db-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        
        {/* Body */}
        <div className="db-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
