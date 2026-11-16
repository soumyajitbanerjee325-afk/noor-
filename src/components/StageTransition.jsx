import React from 'react';
import './StageTransition.css';

function StageTransition({ isActive, direction, children }) {
  if (!isActive) return null;

  return (
    <div 
      className={`stage-transition ${direction}`}
      role="status"
      aria-live="polite"
      aria-label="Transitioning to next stage"
    >
      <div className="transition-overlay" />
      <div className="transition-hearts">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="transition-heart"
            style={{
              '--delay': `${i * 0.05}s`,
              '--angle': `${i * 30}deg`,
              '--distance': `${150 + Math.random() * 100}px`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>
      <div className="transition-text">
        <span className="transition-label">Loading...</span>
        <span className="transition-heart-icon">💖</span>
      </div>
    </div>
  );
}

export default StageTransition;