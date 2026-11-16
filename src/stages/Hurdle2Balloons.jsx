import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Hurdle2Balloons.css';

const BALLOON_COLORS = [
  'var(--pink)', 'var(--pink-light)', 'var(--pink-deep)', 
  'var(--white)', 'var(--blush)', 'var(--lavender)', 'var(--gold)'
];

const GRID_POSITIONS = [
  { x: 10, y: 10 }, { x: 35, y: 10 }, { x: 60, y: 10 }, { x: 85, y: 10 },
  { x: 10, y: 35 }, { x: 35, y: 35 }, { x: 60, y: 35 }, { x: 85, y: 35 },
  { x: 10, y: 60 }, { x: 35, y: 60 }, { x: 60, y: 60 }, { x: 85, y: 60 },
  { x: 22, y: 22 }, { x: 48, y: 22 }, { x: 73, y: 22 },
  { x: 22, y: 48 }, { x: 48, y: 48 }, { x: 73, y: 48 },
];

function Hurdle2Balloons({ onComplete }) {
  const [balloons, setBalloons] = useState([]);
  const [popped, setPopped] = useState(0);
  const [target] = useState(12);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('Pop 12 balloons to continue! 🎈');
  const [celebration, setCelebration] = useState(false);
  const spawnTimeoutRef = useRef(null);
  const celebrationTimeoutRef = useRef(null);

  const startGame = useCallback(() => {
    setGameActive(true);
    setPopped(0);
    setBalloons([]);
    setMessage('Tap the balloons to pop them! 🎈');
    setCelebration(false);
    spawnNextBalloon();
  }, []);

  const spawnNextBalloon = useCallback(() => {
    if (!gameActive) return;
    
    const availablePositions = GRID_POSITIONS.filter(pos => 
      !balloons.some(b => b.posIndex === GRID_POSITIONS.indexOf(pos))
    );
    
    if (availablePositions.length === 0) return;
    
    const posIndex = Math.floor(Math.random() * availablePositions.length);
    const position = availablePositions[posIndex];
    const actualIndex = GRID_POSITIONS.indexOf(position);
    
    const newBalloon = {
      id: Date.now() + Math.random(),
      posIndex: actualIndex,
      x: position.x,
      y: position.y,
      size: 55 + Math.random() * 20,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      wobble: Math.random() * Math.PI * 2,
    };
    
    setBalloons(prev => [...prev, newBalloon]);
    
    // Auto-pop after 3 seconds if not clicked
    spawnTimeoutRef.current = setTimeout(() => {
      setBalloons(prev => prev.filter(b => b.id !== newBalloon.id));
      if (gameActive) spawnNextBalloon();
    }, 3000);
  }, [balloons, gameActive]);

  const popBalloon = useCallback((id) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setPopped(c => {
      const next = c + 1;
      if (next >= target) {
        setGameActive(false);
        setGameComplete(true);
        setMessage('Amazing! All balloons popped! 💕');
        setCelebration(true);
        if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
        celebrationTimeoutRef.current = setTimeout(() => onComplete(), 2000);
      } else {
        setMessage(`Popped ${next}/${target} balloons! Keep going! 🎈`);
        spawnNextBalloon();
      }
      return next;
    });
  }, [target, onComplete]);

  useEffect(() => {
    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
    };
  }, []);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Hurdle 2 🎈</h1>
      <p className="stage-subtitle">Pop the balloons to reveal the final surprise</p>
      
      <div className="game-info">
        <div className="score-display">
          <span className="score-label">Balloons Popped</span>
          <span className="score-value">{popped} / {target}</span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={popped} aria-valuemin={0} aria-valuemax={target}>
          <div className="progress-fill" style={{ width: `${(popped / target) * 100}%` }} />
        </div>
      </div>

      <div 
        className="game-container"
        role="application"
        aria-label="Balloon popping game"
      >
        <div className="sky-bg" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cloud" style={{
              '--delay': `${i * 2}s`,
              '--duration': `${20 + Math.random() * 10}s`,
              '--top': `${10 + Math.random() * 40}%`,
            }} />
          ))}
        </div>

        {balloons.map(balloon => (
          <button
            key={balloon.id}
            className="balloon"
            style={{
              '--x': `${balloon.x}%`,
              '--y': `${balloon.y}%`,
              '--size': `${balloon.size}px`,
              '--color': balloon.color,
              '--wobble': `${Math.sin(balloon.wobble) * 6}px`,
            }}
            onClick={() => popBalloon(balloon.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') popBalloon(balloon.id); }}
            aria-label="Balloon"
          >
            <div className="balloon-body" />
            <div className="balloon-string" />
            <div className="balloon-knot" />
            <div className="balloon-shine" />
          </button>
        ))}

        {celebration && (
          <div className="game-celebration" aria-hidden="true">
            <div className="celebration-balloons">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="celeb-balloon" style={{
                  '--color': BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
                  '--angle': `${i * 24}deg`,
                  '--delay': `${i * 0.05}s`,
                }}>
                  <div className="balloon-body" />
                  <div className="balloon-string" />
                </div>
              ))}
            </div>
            <div className="celebration-confetti">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="celeb-confetti" style={{
                  '--color': ['var(--pink)', 'var(--pink-light)', 'var(--white)', 'var(--gold)', 'var(--lavender)'][Math.floor(Math.random() * 5)],
                  '--delay': `${Math.random() * 0.5}s`,
                  '--angle': `${Math.random() * 360}deg`,
                }} />
              ))}
            </div>
            <div className="celebration-text">You did it! 💕</div>
          </div>
        )}
      </div>

      <div className="game-message" role="status" aria-live="polite">
        {message}
      </div>

      {!gameActive && !gameComplete && (
        <button
          className="btn btn-primary start-btn"
          onClick={startGame}
        >
          <span>Start Popping</span>
          <span className="btn-icon">🎈</span>
        </button>
      )}

      {gameComplete && (
        <button
          className="btn btn-primary next-btn"
          onClick={onComplete}
          autoFocus
        >
          <span>Final Reveal</span>
          <span className="btn-icon">💖</span>
        </button>
      )}
    </div>
  );
}

export default Hurdle2Balloons;