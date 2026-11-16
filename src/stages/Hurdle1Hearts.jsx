import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Hurdle1Hearts.css';

function Hurdle1Hearts({ onComplete }) {
  const [hearts, setHearts] = useState([]);
  const [caught, setCaught] = useState(0);
  const [target] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [basketX, setBasketX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const [message, setMessage] = useState('Catch 10 falling hearts! 💖');
  const containerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const basketWidth = 80;
  const basketHeight = 60;

  const startGame = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerWidth(rect.width);
    setContainerHeight(rect.height);
    setBasketX(rect.width / 2 - basketWidth / 2);
    setGameActive(true);
    setCaught(0);
    setHearts([]);
    setMessage('Catch the falling hearts! 💖');
    setCelebration(false);
    lastSpawnRef.current = Date.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const gameLoop = useCallback((timestamp) => {
    if (!gameActive || containerWidth === 0) return;

    // Spawn new hearts
    if (timestamp - lastSpawnRef.current > 700 + Math.random() * 500) {
      const maxLeft = containerWidth - 30;
      const heartLeft = 20 + Math.random() * (maxLeft - 20);
      setHearts(prev => [...prev, {
        id: Date.now() + Math.random(),
        x: heartLeft,
        y: -50,
        speed: 2.5 + Math.random() * 2,
        size: 24 + Math.random() * 16,
        rotation: (Math.random() - 0.5) * 30,
        rotationSpeed: (Math.random() - 0.5) * 2,
        char: ['💖', '💕', '💗', '💓', '💞', '❤️', '🧡', '💛'][Math.floor(Math.random() * 8)],
      }]);
      lastSpawnRef.current = timestamp;
    }

    // Update hearts
    setHearts(prev => {
      const newHearts = prev.map(heart => {
        const newY = heart.y + heart.speed;
        const newRotation = heart.rotation + heart.rotationSpeed;
        const heartCenterX = heart.x + heart.size / 2;
        const heartBottom = newY + heart.size;

        // Check collision with basket
        const basketTop = containerHeight - basketHeight - 20;
        const basketBottom = containerHeight - 20;
        const basketLeft = basketX;
        const basketRight = basketX + basketWidth;

        const isCatching = heartBottom >= basketTop &&
                          heartBottom <= basketBottom &&
                          heartCenterX >= basketLeft &&
                          heartCenterX <= basketRight;

        if (isCatching) {
          setCaught(c => {
            const next = c + 1;
            if (next >= target) {
              setGameActive(false);
              setGameComplete(true);
              setMessage('You did it! 💕');
              setCelebration(true);
            } else {
              setMessage(`Caught ${next}/${target} hearts! Keep going! 💖`);
            }
            return next;
          });
          return null;
        }

        if (newY > containerHeight + 50) {
          return null;
        }

        return { ...heart, y: newY, rotation: newRotation };
      }).filter(Boolean);

      return newHearts;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameActive, target, containerWidth, containerHeight]);

  const handleMouseMove = useCallback((e) => {
    if (!gameActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - basketWidth / 2;
    setBasketX(Math.max(0, Math.min(containerWidth - basketWidth, newX)));
  }, [gameActive, containerWidth]);

  const handleTouchMove = useCallback((e) => {
    if (!gameActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = touch.clientX - rect.left - basketWidth / 2;
    setBasketX(Math.max(0, Math.min(containerWidth - basketWidth, newX)));
  }, [gameActive, containerWidth]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [handleMouseMove, handleTouchMove]);

  useEffect(() => {
    if (gameComplete) {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [gameComplete, onComplete]);

  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
        setContainerHeight(rect.height);
      }
    };
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Hurdle 1 🎮</h1>
      <p className="stage-subtitle">Catch the falling hearts for Noor</p>
      
      <div className="game-info">
        <div className="score-display">
          <span className="score-label">Hearts Caught</span>
          <span className="score-value">{caught} / {target}</span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={caught} aria-valuemin={0} aria-valuemax={target}>
          <div className="progress-fill" style={{ width: `${(caught / target) * 100}%` }} />
        </div>
      </div>

      <div 
        className="game-container"
        ref={containerRef}
        role="application"
        aria-label="Heart catching game"
      >
        <div className="game-bg" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-heart" style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${6 + Math.random() * 4}s`,
              '--left': `${Math.random() * 100}%`,
              '--size': `${16 + Math.random() * 20}px`,
            }}>💖</div>
          ))}
        </div>

        {hearts.map(heart => (
          <div
            key={heart.id}
            className="falling-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              fontSize: `${heart.size}px`,
              transform: `rotate(${heart.rotation}deg)`,
            }}
            aria-hidden="true"
          >
            {heart.char}
          </div>
        ))}

        <div
          className="basket"
          style={{ left: `${basketX}px`, bottom: '20px' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 60" fill="none" aria-hidden="true">
            <path d="M10 50 Q10 20 30 10 L70 10 Q90 20 90 50" 
                  stroke="var(--pink-deep)" strokeWidth="4" fill="var(--blush-light)" />
            <path d="M25 15 L25 40 M50 15 L50 40 M75 15 L75 40" 
                  stroke="var(--pink)" strokeWidth="2" strokeDasharray="4 4" />
            <ellipse cx="50" cy="8" rx="20" ry="3" fill="var(--pink-light)" opacity="0.5" />
          </svg>
          <div className="basket-glow" />
        </div>

        {celebration && (
          <div className="game-celebration" aria-hidden="true">
            <div className="celebration-hearts">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="celeb-heart" style={{
                  '--angle': `${i * 18}deg`,
                  '--delay': `${i * 0.05}s`,
                }}>💖</div>
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
          <span>Start Catching</span>
          <span className="btn-icon">💖</span>
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

export default Hurdle1Hearts;