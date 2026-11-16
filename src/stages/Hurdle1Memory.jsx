import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Hurdle1Memory.css';

const HEART_TYPES = ['💖', '💕', '💗', '💓', '💞', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍'];

function createDeck(pairs = 6) {
  const selected = HEART_TYPES.slice(0, pairs);
  const cards = [...selected, ...selected]
    .map((type, index) => ({ id: index, type, matched: false, flipped: false }))
    .sort(() => Math.random() - 0.5);
  return cards;
}

function Hurdle1Memory({ onComplete }) {
  const [cards, setCards] = useState(() => createDeck(6));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('Find all matching pairs! 💖');
  const [canFlip, setCanFlip] = useState(true);
  const flipTimeoutRef = useRef(null);

  const handleCardClick = useCallback((index) => {
    if (!canFlip) return;
    if (cards[index].flipped || cards[index].matched) return;
    if (flippedIndices.length >= 2) return;

    const newFlipped = [...flippedIndices, index];
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, flipped: true } : card
    ));
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves(m => m + 1);
      
      const [first, second] = newFlipped;
      const isMatch = cards[first].type === cards[second].type;

      flipTimeoutRef.current = setTimeout(() => {
        if (isMatch) {
          setCards(prev => prev.map((card, i) => 
            (i === first || i === second) ? { ...card, matched: true, flipped: true } : card
          ));
          setMatchedCount(c => {
            const next = c + 1;
            if (next === 6) {
              setGameComplete(true);
              setMessage('Perfect! All pairs found! 💕');
            } else {
              setMessage(`Found ${next}/6 pairs! Keep going! 💖`);
            }
            return next;
          });
        } else {
          setCards(prev => prev.map((card, i) => 
            (i === first || i === second) ? { ...card, flipped: false } : card
          ));
          setMessage('Not a match! Try again 💫');
        }
        setFlippedIndices([]);
        setCanFlip(true);
      }, 900);
    }
  }, [cards, flippedIndices, canFlip]);

  const restartGame = useCallback(() => {
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    setCards(createDeck(6));
    setFlippedIndices([]);
    setMatchedCount(0);
    setMoves(0);
    setGameComplete(false);
    setMessage('Find all matching pairs! 💖');
    setCanFlip(true);
  }, []);

  useEffect(() => {
    if (gameComplete) {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [gameComplete, onComplete]);

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Hurdle 1 🧠</h1>
      <p className="stage-subtitle">Match the hearts to prove your love</p>
      
      <div className="game-info">
        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">Pairs Found</span>
            <span className="stat-value">{matchedCount} / 6</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={matchedCount} aria-valuemin={0} aria-valuemax={6}>
          <div className="progress-fill" style={{ width: `${(matchedCount / 6) * 100}%` }} />
        </div>
      </div>

      <div 
        className="memory-grid"
        role="grid"
        aria-label="Memory matching game"
      >
        {cards.map((card, index) => (
          <button
            key={card.id}
            className={`memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={card.matched || card.flipped || !canFlip}
            role="gridcell"
            aria-label={card.flipped || card.matched ? `${card.type} heart` : 'Hidden card'}
            aria-pressed={card.flipped || card.matched}
          >
            <div className="card-inner">
              <div className="card-back" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="var(--pink-deep)">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="card-front" aria-hidden="true">
                <span className="heart-emoji">{card.type}</span>
              </div>
            </div>
            {card.matched && <div className="match-glow" aria-hidden="true">✨</div>}
          </button>
        ))}
      </div>

      <div className="game-message" role="status" aria-live="polite">
        {message}
      </div>

      {!gameComplete && (
        <button
          className="btn btn-ghost restart-btn"
          onClick={restartGame}
          disabled={matchedCount === 0 && moves === 0}
        >
          <span>Restart</span>
          <span className="btn-icon">🔄</span>
        </button>
      )}

      {gameComplete && (
        <button
          className="btn btn-primary next-btn"
          onClick={onComplete}
          autoFocus
        >
          <span>Next Stage</span>
          <span className="btn-icon">💕</span>
        </button>
      )}
    </div>
  );
}

export default Hurdle1Memory;