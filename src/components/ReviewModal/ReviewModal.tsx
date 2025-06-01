import React, { useState, useEffect, useRef } from 'react';
import './ReviewModal.scss';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; feedback: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    onSubmit({ rating, feedback });
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal" ref={modalRef}>
        <h2 className="review-modal__title">REVIEW FORM</h2>

        <div className="review-modal__form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {'★'.repeat(r)}
              </option>
            ))}
          </select>
        </div>

        <div className="review-modal__form-group">
          <label htmlFor="feedback">Feedback</label>
          <textarea
            id="feedback"
            rows={4}
            placeholder="Write down your feedback about our product & services"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <button className="review-modal__submit" onClick={handleSubmit}>
          PUBLISH REVIEW
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
