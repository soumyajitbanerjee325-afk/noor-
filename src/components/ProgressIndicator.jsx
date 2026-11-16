import React, { useState, useRef, useEffect } from 'react';
import './ProgressIndicator.css';

function ProgressIndicator({ stages, currentIndex, completed, onStageClick }) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStageClick = (index) => {
    onStageClick(index);
    setExpanded(false);
  };

  return (
    <div className="progress-indicator" ref={containerRef}>
      <button
        className="progress-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Hide progress' : 'Show progress'}
        aria-controls="progress-list"
      >
        <div className="progress-hearts">
          {stages.map((_, i) => (
            <span
              key={i}
              className={`progress-heart ${completed.has(i) ? 'completed' : ''} ${i === currentIndex ? 'current' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          ))}
        </div>
        <svg className="progress-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="progress-dropdown" id="progress-list" role="menu" aria-label="Journey progress">
          <div className="progress-backdrop" onClick={() => setExpanded(false)} />
          <ul className="progress-list">
            {stages.map((stage, i) => (
              <li key={stage.id} className="progress-item">
                <button
                  className={`progress-btn ${completed.has(i) ? 'completed' : ''} ${i === currentIndex ? 'current' : ''} ${!completed.has(i) && i > currentIndex ? 'locked' : ''}`}
                  onClick={() => handleStageClick(i)}
                  disabled={!completed.has(i) && i > currentIndex}
                  role="menuitem"
                  aria-current={i === currentIndex ? 'step' : undefined}
                  aria-disabled={!completed.has(i) && i > currentIndex}
                >
                  <span className="progress-step-icon">
                    {completed.has(i) ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    )}
                  </span>
                  <span className="progress-step-label">{stage.label}</span>
                  {i === currentIndex && <span className="progress-current-badge">Current</span>}
                  {!completed.has(i) && i > currentIndex && <span className="progress-locked-badge">🔒</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProgressIndicator;