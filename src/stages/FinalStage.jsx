import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FinalStage.css';

const confessionText = `Happy Birthday, my Noor 💖

From the moment you walked into my life, everything became warmer, brighter, and full of magic. Your smile is my favorite sight in this world, and your laugh is the sweetest melody I could ever listen to.

Here is my confession to you...
Loving you is the easiest and most beautiful thing I have ever done. Every memory with you, every quiet laugh, and every glance has made me fall for you even more. You are not just the love of my life — you are my peace, my comfort, and my favorite person in the entire universe.

Thank you for being you, for holding my hand, and for sharing your precious heart with me.

I promise to always choose you, cherish you, and love you endlessly — today on your birthday, and for all the years to come.

Happy Birthday, my soulmate Noor ❤️

Forever & always yours,
ruhhhh 🫶`;

function FinalStage({ onRestart }) {
  const [revealStage, setRevealStage] = useState(0);
  const [balloonPopped, setBalloonPopped] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [typedLines, setTypedLines] = useState([]);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const letterLines = confessionText.split('\n');
  const typingTimeoutRef = useRef(null);

  // Play pop sound using Web Audio API
  const playPopSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Balloon pop burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);

      // Little chime shimmer
      setTimeout(() => {
        try {
          const chime = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chime.type = 'sine';
          chime.frequency.setValueAtTime(659.25, ctx.currentTime);
          chime.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
          chimeGain.gain.setValueAtTime(0.3, ctx.currentTime);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          chime.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chime.start();
          chime.stop(ctx.currentTime + 0.35);
        } catch (e) {}
      }, 80);
    } catch (e) {}
  }, []);

  // Stage sequence: Curtains -> Couple Photo -> Balloon Appears
  useEffect(() => {
    const t1 = setTimeout(() => setRevealStage(1), 500);  // Curtains open
    const t2 = setTimeout(() => setRevealStage(2), 1400); // Couple photo reveals
    const t3 = setTimeout(() => setRevealStage(3), 2600); // Confession balloon floats in

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const startTyping = useCallback(() => {
    let lineIndex = 0;
    let charIndex = 0;

    const typeNextChar = () => {
      if (lineIndex >= letterLines.length) {
        setIsTypingDone(true);
        setTimeout(() => setShowReplay(true), 1200);
        return;
      }

      const line = letterLines[lineIndex];

      if (charIndex <= line.length) {
        setTypedLines(prev => {
          const newLines = [...prev];
          newLines[lineIndex] = line.slice(0, charIndex);
          return newLines;
        });
        charIndex++;
        typingTimeoutRef.current = setTimeout(typeNextChar, line === '' ? 80 : 25);
      } else {
        lineIndex++;
        charIndex = 0;
        setTypedLines(prev => [...prev, '']);
        typingTimeoutRef.current = setTimeout(typeNextChar, 180);
      }
    };

    setTypedLines(['']);
    typeNextChar();
  }, [letterLines]);

  // Click balloon to burst and pop out the letter
  const handlePopBalloon = () => {
    if (balloonPopped || isPopping) return;
    setIsPopping(true);
    playPopSound();

    setTimeout(() => {
      setBalloonPopped(true);
      setIsPopping(false);
      setLetterVisible(true);
      startTyping();
    }, 280);
  };

  // Skip typing if clicked on letter
  const handleSkipTyping = () => {
    if (!isTypingDone && letterVisible) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setTypedLines(letterLines);
      setIsTypingDone(true);
      setShowReplay(true);
    }
  };

  return (
    <div className="stage-content final-stage-enhanced">
      <div className="final-reveal-container" role="region" aria-label="Final birthday reveal">
        {/* Curtains */}
        <div className="curtains" aria-hidden="true">
          <div className="curtain left" style={{ animationDelay: revealStage >= 1 ? '0s' : '0s' }} />
          <div className="curtain right" style={{ animationDelay: revealStage >= 1 ? '0s' : '0s' }} />
          <div className="curtain-top" />
        </div>

        {/* Couple Photo Reveal - Our Pic at the Last */}
        <div className={`couple-photo-wrapper ${revealStage >= 2 ? 'revealed' : ''}`}>
          <div className="photo-glow" />
          <div className="photo-frame">
            <div className="couple-photo">
              <img
                src="/photos/us.jpg"
                alt="Us together - Soumy & Noor"
                className="couple-real-img"
              />
            </div>
          </div>

          <div className="couple-title-badge">
            <span>Us Together 💖</span>
          </div>

          <div className="photo-sparkles" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="photo-sparkle" style={{
                '--angle': `${i * 30}deg`,
                '--delay': `${i * 0.1}s`,
              }}>✨</div>
            ))}
          </div>
        </div>

        {/* Falling Rose Petals */}
        <div className="rose-petals" aria-hidden="true">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="petal"
              style={{
                '--left': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 3}s`,
                '--duration': `${4 + Math.random() * 3}s`,
                '--rotation': `${Math.random() * 360}deg`,
                '--scale': `${0.5 + Math.random() * 0.5}`,
              }}
            />
          ))}
        </div>

        {/* Floating Hearts Around Photo */}
        <div className="floating-hearts-final" aria-hidden="true">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="final-heart"
              style={{
                '--angle': `${i * 24}deg`,
                '--delay': `${i * 0.1}s`,
                '--size': `${20 + Math.random() * 16}px`,
              }}
            >💖</div>
          ))}
        </div>

        {/* Fireworks */}
        <div className="fireworks" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="firework" style={{
              '--left': `${15 + i * 17}%`,
              '--delay': `${i * 0.4}s`,
              '--color': ['var(--pink)', 'var(--pink-light)', 'var(--gold)', 'var(--lavender)', 'var(--white)'][i],
            }}>
              {[...Array(12)].map((_, j) => (
                <div key={j} className="firework-particle" style={{
                  '--angle': `${j * 30}deg`,
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* BALLOON BURST & CONFESSION SECTION */}
        {revealStage >= 3 && !balloonPopped && (
          <div className={`confession-balloon-container ${isPopping ? 'popping' : ''}`}>
            <button
              className="confession-balloon-btn"
              onClick={handlePopBalloon}
              aria-label="Pop the balloon to open secret confession"
            >
              <div className="balloon-body-heart">
                <div className="balloon-shine" />
                <div className="balloon-heart-icon">💌</div>
                <div className="balloon-pulse-ring" />
              </div>
              <div className="balloon-knot" />
              <div className="balloon-string-wavy" />
              <div className="balloon-tag">
                <span>Pop me, my Noor! 🎈</span>
              </div>
            </button>
            <p className="balloon-prompt-text">Tap the balloon to reveal my confession 💕</p>

            {/* Burst particle shards when popping */}
            {isPopping && (
              <div className="burst-particles" aria-hidden="true">
                {[...Array(24)].map((_, i) => (
                  <span
                    key={i}
                    className="burst-piece"
                    style={{
                      '--deg': `${i * 15}deg`,
                      '--dist': `${60 + (i % 4) * 25}px`,
                      '--color': ['#ff4757', '#ff6b9d', '#ffd1dc', '#ffd700', '#a55eea', '#ffffff'][i % 6],
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* POPPED LETTER & CONFESSION */}
        {letterVisible && (
          <div 
            className="popped-letter-container visible"
            onClick={handleSkipTyping}
            title={!isTypingDone ? "Click to read full letter immediately" : ""}
          >
            <div className="letter-sparkle-burst" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="letter-sparkle" style={{ '--i': i }}>✨</span>
              ))}
            </div>

            <div className="popped-letter-card">
              <div className="letter-header-ribbon">
                <span className="ribbon-heart">💌</span>
                <span className="ribbon-text">A Confession For You</span>
                <span className="ribbon-heart">💌</span>
              </div>

              <div className="letter-body-content">
                {typedLines.map((line, index) => (
                  <p key={index} className="confession-line">
                    {line || <br />}
                  </p>
                ))}
              </div>

              <div className="letter-footer-seal">
                <div className="heart-wax-seal">
                  <span>❤️</span>
                </div>
                <span className="seal-text">Sealed with all my love</span>
              </div>
            </div>
          </div>
        )}

        {/* Final Message & Replay Button */}
        {showReplay && (
          <div className="final-actions-section">
            <div className="final-message visible">
              <h2 className="final-title">Happy Birthday Noor ❤️</h2>
              <p className="final-signature">You will always be my favorite person 💖</p>
            </div>

            <button
              className="btn btn-primary replay-btn"
              onClick={onRestart}
              autoFocus
            >
              <span>Replay Our Journey 🔄</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinalStage;
