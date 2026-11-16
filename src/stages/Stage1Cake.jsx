import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Stage1Cake.css';

function Stage1Cake({ onComplete }) {
  const [candlesLit, setCandlesLit] = useState(5);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [blowMessage, setBlowMessage] = useState('Click candles or tap blow to make a wish! 🎂');
  const [micEnabled, setMicEnabled] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cakeRef = useRef(null);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowNextButton(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  // Audio effect for blowing candle
  const playExtinguishSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Wind puff noise
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
    } catch (e) {}
  }, []);

  // Microphone detection
  useEffect(() => {
    if (!micEnabled) return;

    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneRef.current = stream;
        
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        detectBlow();
      } catch (err) {
        console.log('Microphone not available:', err);
        setMicEnabled(false);
      }
    };

    initMicrophone();

    return () => {
      if (microphoneRef.current) {
        microphoneRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [micEnabled]);

  const blowOutCandle = useCallback(() => {
    setCandlesLit(prev => {
      if (prev <= 0) return 0;
      const next = prev - 1;
      playExtinguishSound();

      if (next === 0) {
        setShowCelebration(true);
        setBlowMessage('🎉 All candles blown! Happy Birthday Noor! Make your wish! 💖');
      } else {
        setBlowMessage(`💨 ${next} candle${next > 1 ? 's' : ''} left! Keep blowing 💕`);
      }
      return next;
    });
  }, [playExtinguishSound]);

  const detectBlow = useCallback(() => {
    if (!analyserRef.current || candlesLit === 0) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    if (average > 30 && candlesLit > 0) {
      blowOutCandle();
    }
    
    animationFrameRef.current = requestAnimationFrame(detectBlow);
  }, [candlesLit, blowOutCandle]);

  const handleButtonClick = () => {
    if (candlesLit > 0) {
      blowOutCandle();
    }
  };

  const handleCandleClick = (index) => {
    if (index < candlesLit) {
      blowOutCandle();
    }
  };

  const handleMicToggle = () => {
    setMicEnabled(prev => !prev);
    if (!micEnabled) {
      setBlowMessage('🎤 Microphone enabled! Blow gently into your mic');
    }
  };

  // 5 Candles on the top of the cake
  const candles = Array.from({ length: 5 }, (_, i) => {
    const isLit = i < candlesLit;
    return (
      <div
        key={i}
        className={`candle ${!isLit ? 'blown' : ''}`}
        onClick={() => handleCandleClick(i)}
        title={isLit ? "Click to blow this candle" : "Blown"}
        style={{ 
          '--index': i,
          '--delay': `${i * 0.1}s`,
          '--stripe-color': ['#ff4757', '#e84393', '#a55eea', '#ff6b9d', '#ff9f43'][i]
        }}
      >
        <div className="candle-body">
          <div className="candle-stripes" />
          <div className="candle-wick" />
          {isLit && (
            <div className="candle-flame">
              <div className="flame-inner" />
              <div className="flame-glow" />
            </div>
          )}
        </div>
        {!isLit && <div className="candle-smoke" aria-hidden="true" />}
      </div>
    );
  });

  return (
    <div className="stage-content cake-stage-wrapper">
      <h1 className="stage-title">Happy Birthday Noor 🎂</h1>
      <p className="stage-subtitle">Make a wish and blow out the candles</p>
      
      <div className="cake-scene" ref={cakeRef}>
        {/* Dreamy background floating sparkles and stars */}
        <div className="dreamy-background" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-sparkle star"
              style={{
                top: `${15 + (i * 21) % 70}%`,
                left: `${8 + (i * 19) % 84}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>

        {/* PROPER UPRIGHT 3-TIER CAKE */}
        <div className="cake-display-container">
          {/* 1. CANDLES ON TOP */}
          <div className="candles-crown" role="list" aria-label="Birthday candles">
            {candles}
          </div>

          {/* 2. TOP TIER (Smallest) */}
          <div className="cake-tier top-tier">
            <div className="frosting-top-surface">
              {/* Strawberries on top surface */}
              <div className="strawberries-row">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="berry-topper" style={{ '--i': i }}>🍓</span>
                ))}
              </div>
            </div>
            <div className="frosting-drip-layer" />
            <div className="tier-sponge" />
            <div className="piping-bottom-beads" />
          </div>

          {/* 3. MIDDLE TIER (Medium) */}
          <div className="cake-tier middle-tier">
            <div className="frosting-top-surface">
              <div className="tier-decorations-row">
                <span className="pearl-accent">🌸</span>
                <span className="pearl-accent">💖</span>
                <span className="pearl-accent">🌸</span>
                <span className="pearl-accent">💖</span>
              </div>
            </div>
            <div className="frosting-drip-layer pink-drip" />
            <div className="tier-sponge middle-sponge" />
            <div className="piping-bottom-beads" />
          </div>

          {/* 4. BOTTOM TIER (Largest) */}
          <div className="cake-tier bottom-tier">
            <div className="frosting-top-surface">
              <div className="tier-decorations-row">
                <span className="pearl-accent">✨</span>
                <span className="pearl-accent">🌹</span>
                <span className="pearl-accent">✨</span>
                <span className="pearl-accent">🌹</span>
                <span className="pearl-accent">✨</span>
              </div>
            </div>
            <div className="frosting-drip-layer" />
            <div className="tier-sponge bottom-sponge" />
            <div className="piping-bottom-beads scalloped" />
          </div>

          {/* 5. CERAMIC CAKE PLATTER & PEDESTAL STAND */}
          <div className="cake-plate" aria-hidden="true">
            <div className="plate-rim" />
            <div className="plate-rose-petals">
              <span className="plate-petal p1">🌸</span>
              <span className="plate-petal p2">🌸</span>
              <span className="plate-petal p3">🌹</span>
              <span className="plate-petal p4">🌸</span>
            </div>
          </div>
          <div className="cake-stand-pedestal" aria-hidden="true">
            <div className="stand-pillar" />
            <div className="stand-foot" />
          </div>
        </div>
      </div>

      {/* Blow Controls */}
      <div className="blow-controls">
        <button
          className="btn btn-primary blow-btn"
          onClick={handleButtonClick}
          disabled={candlesLit === 0}
          aria-label={candlesLit > 0 ? 'Blow out a candle' : 'All candles blown'}
        >
          <span className="btn-icon">💨</span>
          <span>{candlesLit > 0 ? 'Blow the Candle!' : 'All Blown! ✨'}</span>
        </button>

        <button
          className={`btn btn-ghost mic-btn ${micEnabled ? 'active' : ''}`}
          onClick={handleMicToggle}
          aria-label={micEnabled ? 'Disable microphone' : 'Enable microphone blow'}
          aria-pressed={micEnabled}
        >
          <span className="btn-icon">🎤</span>
          <span>{micEnabled ? 'Mic Listening...' : 'Blow via Mic'}</span>
        </button>
      </div>

      {blowMessage && (
        <div className="blow-message" role="status" aria-live="polite">
          {blowMessage}
        </div>
      )}

      {/* Celebration Effects */}
      <div className="celebration-overlay" aria-hidden="true">
        {showCelebration && (
          <>
            <div className="confetti-burst">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    '--color': ['var(--pink)', 'var(--pink-light)', 'var(--white)', 'var(--gold)', 'var(--lavender)', '#ff4757'][i % 6],
                    '--delay': `${(i % 10) * 0.05}s`,
                    '--duration': `${1 + (i % 5) * 0.2}s`,
                    '--rotation': `${i * 24}deg`,
                    '--distance': `${120 + (i % 8) * 20}px`,
                    '--angle': `${i * 14.4}deg`,
                  }}
                />
              ))}
            </div>
            
            <div className="heart-burst">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="burst-heart"
                  style={{
                    '--angle': `${i * 24}deg`,
                    '--delay': `${i * 0.04}s`,
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showNextButton && (
        <button
          className="btn btn-primary next-btn glow-pulse"
          onClick={onComplete}
          autoFocus
        >
          <span>Continue Journey 💕</span>
          <span className="btn-icon">➡️</span>
        </button>
      )}
    </div>
  );
}

export default Stage1Cake;
