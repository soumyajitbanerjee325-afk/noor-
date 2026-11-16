import React, { useEffect, useState, useRef, useMemo } from 'react';
import './BackgroundAnimation.css';

const HEART_TYPES = ['♡', '♥', '❤', '💖', '💕', '💗', '💓', '💞'];
const SPARKLE_TYPES = ['✦', '✧', '★', '☆', '✨', '⋆', '✰', '✵'];

function BackgroundAnimation() {
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [bokeh, setBokeh] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initHearts = Array.from({ length: 30 }, (_, i) => createHeart(i));
    const initSparkles = Array.from({ length: 50 }, (_, i) => createSparkle(i));
    const initBalloons = Array.from({ length: 8 }, (_, i) => createBalloon(i));
    const initBokeh = Array.from({ length: 15 }, (_, i) => createBokeh(i));

    setHearts(initHearts);
    setSparkles(initSparkles);
    setBalloons(initBalloons);
    setBokeh(initBokeh);

    const heartInterval = setInterval(() => {
      setHearts(prev => [...prev.slice(-25), createHeart(Date.now())]);
    }, 1200);

    const sparkleInterval = setInterval(() => {
      setSparkles(prev => [...prev.slice(-40), createSparkle(Date.now())]);
    }, 400);

    const balloonInterval = setInterval(() => {
      setBalloons(prev => [...prev.slice(-6), createBalloon(Date.now())]);
    }, 4000);

    return () => {
      clearInterval(heartInterval);
      clearInterval(sparkleInterval);
      clearInterval(balloonInterval);
    };
  }, []);

  const createHeart = useMemo(() => (id) => ({
    id: `heart-${id}`,
    left: Math.random() * 100,
    size: 16 + Math.random() * 28,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * 5,
    opacity: 0.25 + Math.random() * 0.4,
    color: `hsl(${320 + Math.random() * 40}, 80%, ${55 + Math.random() * 20}%)`,
    rotation: Math.random() * 360,
    char: HEART_TYPES[Math.floor(Math.random() * HEART_TYPES.length)],
    drift: (Math.random() - 0.5) * 60,
  }), []);

  const createSparkle = useMemo(() => (id) => ({
    id: `sparkle-${id}`,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 3 + Math.random() * 6,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2,
    type: Math.random() > 0.6 ? 'star' : 'circle',
    color: Math.random() > 0.5 ? '#fff' : `hsl(${320 + Math.random() * 30}, 90%, 75%)`,
    char: SPARKLE_TYPES[Math.floor(Math.random() * SPARKLE_TYPES.length)],
  }), []);

  const createBalloon = useMemo(() => (id) => ({
    id: `balloon-${id}`,
    left: 8 + Math.random() * 84,
    duration: 25 + Math.random() * 15,
    delay: Math.random() * 5,
    color: ['var(--pink)', 'var(--pink-light)', 'var(--pink-deep)', 'var(--white)', 'var(--blush)', 'var(--lavender)'][Math.floor(Math.random() * 6)],
    size: 40 + Math.random() * 20,
    stringLength: 80 + Math.random() * 60,
  }), []);

  const createBokeh = useMemo(() => (id) => ({
    id: `bokeh-${id}`,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 60 + Math.random() * 120,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 10,
    opacity: 0.15 + Math.random() * 0.15,
    hue: 320 + Math.random() * 40,
  }), []);

  return (
    <div className="background-animation" ref={containerRef} aria-hidden="true">
      <div className="gradient-bg" />
      
      <div className="bokeh-layer">
        {bokeh.map(b => (
          <div
            key={b.id}
            className="bokeh-circle"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              opacity: b.opacity,
              background: `radial-gradient(circle at 30% 30%, hsla(${b.hue}, 70%, 75%, 1), transparent 70%)`,
            }}
          />
        ))}
      </div>

      <div className="floating-layer">
        {hearts.map(h => (
          <div
            key={h.id}
            className="floating-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              color: h.color,
              opacity: h.opacity,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              transform: `rotate(${h.rotation}deg)`,
              '--drift': `${h.drift}px`,
            }}
          >
            {h.char}
          </div>
        ))}

        {sparkles.map(s => (
          <div
            key={s.id}
            className={`sparkle ${s.type}`}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              fontSize: `${s.size}px`,
              color: s.color,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            {s.char}
          </div>
        ))}

        {balloons.map(b => (
          <div
            key={b.id}
            className="balloon"
            style={{
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              '--balloon-color': b.color,
              '--balloon-size': `${b.size}px`,
              '--string-length': `${b.stringLength}px`,
            }}
          >
            <div className="balloon-body" />
            <div className="balloon-string" />
            <div className="balloon-knot" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BackgroundAnimation;