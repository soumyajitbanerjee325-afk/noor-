import React, { useEffect, useRef, useState } from 'react';
import './BirthdayCard.css';

const BirthdayCard = () => {
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [petals, setPetals] = useState([]);
  const cardRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Auto-play background music (muted first to satisfy browser policy, then unmuted)
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.loop = true;
      const tryPlay = () => {
        audio.play().catch(() => {
          // If autoplay blocked, play on first user interaction
          const unlock = () => {
            audio.play();
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
          };
          document.addEventListener('click', unlock, { once: true });
          document.addEventListener('touchstart', unlock, { once: true });
        });
      };
      tryPlay();
    }

    generateFloatingElements();
    const heartInterval = setInterval(generateHearts, 800);
    const sparkleInterval = setInterval(generateSparkles, 300);
    const balloonInterval = setInterval(generateBalloons, 3000);
    const confettiInterval = setInterval(generateConfetti, 500);
    const petalInterval = setInterval(generatePetals, 1000);

    return () => {
      clearInterval(heartInterval);
      clearInterval(sparkleInterval);
      clearInterval(balloonInterval);
      clearInterval(confettiInterval);
      clearInterval(petalInterval);
    };
  }, []);

  const generateFloatingElements = () => {
    const newHearts = Array.from({ length: 25 }, (_, i) => ({
      id: `heart-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 12 + Math.random() * 28,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
      color: `hsl(${320 + Math.random() * 30}, 85%, ${60 + Math.random() * 20}%)`,
      rotation: Math.random() * 360,
    }));
    setHearts(newHearts);

    const newSparkles = Array.from({ length: 40 }, (_, i) => ({
      id: `sparkle-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      type: Math.random() > 0.5 ? 'star' : 'circle',
    }));
    setSparkles(newSparkles);

    const newBalloons = Array.from({ length: 8 }, (_, i) => ({
      id: `balloon-${i}`,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 6,
      duration: 15 + Math.random() * 10,
      color: ['#ff6b9d', '#ff8fab', '#ff4757', '#fff', '#ffd6e8', '#e84393'][Math.floor(Math.random() * 6)],
      stringColor: '#c9b896',
    }));
    setBalloons(newBalloons);

    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: `confetti-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      color: ['#ff6b9d', '#ff8fab', '#fff', '#ffd6e8', '#e84393', '#a55eea'][Math.floor(Math.random() * 6)],
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      rotation: Math.random() * 360,
    }));
    setConfetti(newConfetti);

    const newPetals = Array.from({ length: 20 }, (_, i) => ({
      id: `petal-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 10 + Math.random() * 8,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
    }));
    setPetals(newPetals);
  };

  const generateHearts = () => {
    const newHeart = {
      id: `heart-${Date.now()}`,
      left: Math.random() * 100,
      top: 110,
      size: 15 + Math.random() * 25,
      delay: 0,
      duration: 10 + Math.random() * 8,
      opacity: 0.4 + Math.random() * 0.4,
      color: `hsl(${320 + Math.random() * 30}, 85%, ${60 + Math.random() * 20}%)`,
      rotation: Math.random() * 360,
    };
    setHearts(prev => [...prev.slice(-24), newHeart]);
  };

  const generateSparkles = () => {
    const newSparkle = {
      id: `sparkle-${Date.now()}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 6,
      delay: 0,
      duration: 2 + Math.random() * 3,
      type: Math.random() > 0.5 ? 'star' : 'circle',
    };
    setSparkles(prev => [...prev.slice(-39), newSparkle]);
  };

  const generateBalloons = () => {
    const newBalloon = {
      id: `balloon-${Date.now()}`,
      left: 5 + Math.random() * 90,
      delay: 0,
      duration: 15 + Math.random() * 10,
      color: ['#ff6b9d', '#ff8fab', '#ff4757', '#fff', '#ffd6e8', '#e84393'][Math.floor(Math.random() * 6)],
      stringColor: '#c9b896',
    };
    setBalloons(prev => [...prev.slice(-7), newBalloon]);
  };

  const generateConfetti = () => {
    const newConfetti = {
      id: `confetti-${Date.now()}`,
      left: Math.random() * 100,
      delay: 0,
      duration: 6 + Math.random() * 5,
      color: ['#ff6b9d', '#ff8fab', '#fff', '#ffd6e8', '#e84393', '#a55eea'][Math.floor(Math.random() * 6)],
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      rotation: Math.random() * 360,
    };
    setConfetti(prev => [...prev.slice(-29), newConfetti]);
  };

  const generatePetals = () => {
    const newPetal = {
      id: `petal-${Date.now()}`,
      left: Math.random() * 100,
      delay: 0,
      duration: 8 + Math.random() * 6,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
    };
    setPetals(prev => [...prev.slice(-19), newPetal]);
  };

  const letterText = `Happy Birthday, my Noor 💖

From the moment you came into my life, everything became brighter. Your smile is my favorite place to be, and your laugh is my favorite sound. I don't say it enough, but I love you more than words can hold. Thank you for being you, for every moment, every memory, and every piece of your heart you've trusted me with.

I hope this year gives you all the happiness you give me. You are my love, my peace and my favorite person.

Forever yours,
ruhhhh ❤️`;

  return (
    <div className="birthday-card" ref={cardRef}>
      {/* Background Music - hidden, loops automatically */}
      <audio ref={audioRef} src="./src/music.mp3" loop preload="auto" style={{ display: 'none' }} />

      <div className="card-background">
        <div className="gradient-bg" />
        <div className="bokeh-layer">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="bokeh-circle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                animationDelay: `${Math.random() * 8}s`,
                background: `radial-gradient(circle at 30% 30%, hsla(${320 + Math.random() * 30}, 80%, 75%, 0.4), transparent 70%)`,
              }}
            />
          ))}
        </div>

        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.size}px`,
              color: heart.color,
              opacity: heart.opacity,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              transform: `rotate(${heart.rotation}deg)`,
            }}
          >
            ♡
          </div>
        ))}

        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className={`sparkle ${sparkle.type}`}
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          />
        ))}

        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className="balloon"
            style={{
              left: `${balloon.left}%`,
              animationDelay: `${balloon.delay}s`,
              animationDuration: `${balloon.duration}s`,
            }}
          >
            <div className="balloon-body" style={{ background: balloon.color }} />
            <div className="balloon-string" style={{ borderColor: balloon.stringColor }} />
            <div className="balloon-knot" style={{ background: balloon.color }} />
          </div>
        ))}

        {confetti.map((c) => (
          <div
            key={c.id}
            className={`confetti ${c.shape}`}
            style={{
              left: `${c.left}%`,
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              transform: `rotate(${c.rotation}deg)`,
            }}
          />
        ))}

        {petals.map((petal) => (
          <div
            key={petal.id}
            className="rose-petal"
            style={{
              left: `${petal.left}%`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
              transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
            }}
          />
        ))}
      </div>

      <div className="card-content">
        <div className="top-decorations">
          <div className="bunting">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bunting-flag"
                style={{
                  background: `linear-gradient(135deg, hsl(${320 + (i * 25) % 60}, 70%, 75%), hsl(${320 + (i * 25) % 60}, 60%, 85%))`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <div className="string-lights">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="light-bulb"
                style={{
                  left: `${i * 5}%`,
                  animationDelay: `${i * 0.2}s`,
                  background: `hsl(${30 + Math.random() * 30}, 100%, ${70 + Math.random() * 20}%)`,
                }}
              />
            ))}
          </div>
        </div>

        <h1 className="main-title">Happy Birthday Noor 🎂</h1>

        <div className="centerpiece-frame">
          <div className="glow-ring" />
          <div className="inner-glow" />
          <div className="photo-gallery-section">

            {/* ── CHILDHOOD ── */}
            <div className="timeline-block">
              <div className="gallery-label childhood-label">🍼 Childhood 🍼</div>
              <div className="photo-gallery childhood-gallery">
                <div className="gallery-photo">
                  <img src="./src/photos/childhood1.jpg" alt="Baby Noor" className="gallery-img" />
                  <div className="photo-caption">🍼 Little Noor</div>
                </div>
                <div className="gallery-photo">
                  <img src="./src/photos/childhood2.jpg" alt="Baby Noor smiling" className="gallery-img" />
                  <div className="photo-caption">💖 Little Angel</div>
                </div>
                <div className="gallery-photo">
                  <img src="./src/photos/childhood3.jpg" alt="Young Noor" className="gallery-img" />
                  <div className="photo-caption">🦋 Growing Fast</div>
                </div>
              </div>
            </div>

            {/* arrow connector */}
            <div className="timeline-arrow">↓</div>

            {/* ── ADULTHOOD ── */}
            <div className="timeline-block">
              <div className="gallery-label adulthood-label">💖 Now 💖</div>
              <div className="photo-gallery adulthood-gallery">
                <div className="gallery-photo">
                  <img src="./src/photos/adult1.jpg" alt="Noor" className="gallery-img" />
                  <div className="photo-caption">💜 Ethereal</div>
                </div>
                <div className="gallery-photo">
                  <img src="./src/photos/adult2.jpg" alt="Noor" className="gallery-img" />
                  <div className="photo-caption">🌹 Gorgeous</div>
                </div>
                <div className="gallery-photo">
                  <img src="./src/photos/adult3.jpg" alt="Noor" className="gallery-img" />
                  <div className="photo-caption">💫 Dreamy</div>
                </div>
              </div>
            </div>

            {/* arrow connector */}
            <div className="timeline-arrow">↓</div>

            {/* ── US ── */}
            <div className="timeline-block">
              <div className="gallery-label us-label">🫶 Us 🫶</div>
              <div className="photo-gallery us-gallery">
                <div className="gallery-photo us-photo">
                  <img src="./src/photos/us.jpg" alt="Us together" className="gallery-img us-img" />
                  <div className="photo-caption us-caption">❤️ My favorite person & me ❤️</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="treats-section">
          <div className="cake-container">
            <div className="cake">
              <div className="cake-topper">
                <div className="candles">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="candle">
                      <div className="flame" style={{ animationDelay: `${i * 0.1}s` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="cake-tier top-tier">
                <div className="frosting" />
                <div className="strawberries">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="strawberry" style={{ left: `${15 + i * 14}%`, top: `${10 + (i % 2) * 15}%` }} />
                  ))}
                </div>
              </div>
              <div className="cake-tier middle-tier">
                <div className="frosting" />
                <div className="piping-details" />
              </div>
              <div className="cake-tier bottom-tier">
                <div className="frosting" />
                <div className="piping-details" />
              </div>
              <div className="cake-plate" />
            </div>
          </div>

          <div className="cupcakes">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="cupcake" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="cupcake-top">
                  <div className="cupcake-frosting" style={{ background: `hsl(${320 + i * 15}, 70%, 75%)` }} />
                  <div className="cupcake-sprinkles" />
                  <div className="cupcake-cherry" />
                </div>
                <div className="cupcake-wrapper" />
              </div>
            ))}
          </div>

          <div className="macarons">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="macaron" style={{ 
                background: `hsl(${320 + i * 10}, 65%, 80%)`,
                animationDelay: `${i * 0.15}s` 
              }}>
                <div className="macaron-filling" style={{ background: `hsl(${320 + i * 10}, 75%, 70%)` }} />
              </div>
            ))}
          </div>
        </div>

        <div className="plushies-section">
          <div className="plushie plushie-left">
            <div className="teddy-bear">
              <div className="bear-ear left" />
              <div className="bear-ear right" />
              <div className="bear-face">
                <div className="bear-eye left" />
                <div className="bear-eye right" />
                <div className="bear-nose" />
                <div className="bear-smile" />
              </div>
              <div className="bear-body">
                <div className="bear-arm left" />
                <div className="bear-arm right" />
                <div className="heart-held" />
              </div>
              <div className="bear-leg left" />
              <div className="bear-leg right" />
            </div>
          </div>

          <div className="plushie plushie-center">
            <div className="bunny">
              <div className="bunny-ear left" />
              <div className="bunny-ear right" />
              <div className="bunny-face">
                <div className="bunny-eye left" />
                <div className="bunny-eye right" />
                <div className="bunny-nose" />
                <div className="bunny-whiskers left" />
                <div className="bunny-whiskers right" />
              </div>
              <div className="bunny-body">
                <div className="bunny-arm left" />
                <div className="bunny-arm right" />
              </div>
              <div className="bunny-foot left" />
              <div className="bunny-foot right" />
            </div>
          </div>

          <div className="plushie plushie-right">
            <div className="teddy-bear small">
              <div className="bear-ear left" />
              <div className="bear-ear right" />
              <div className="bear-face">
                <div className="bear-eye left" />
                <div className="bear-eye right" />
                <div className="bear-nose" />
                <div className="bear-smile" />
              </div>
              <div className="bear-body">
                <div className="bear-arm left" />
                <div className="bear-arm right" />
              </div>
              <div className="bear-leg left" />
              <div className="bear-leg right" />
            </div>
          </div>

          <div className="gift-boxes">
            <div className="gift-box" style={{ background: 'linear-gradient(135deg, #ff6b9d, #e84393)' }}>
              <div className="gift-lid" style={{ background: 'linear-gradient(135deg, #ff8fab, #ff6b9d)' }} />
              <div className="gift-ribbon-vertical" />
              <div className="gift-ribbon-horizontal" />
              <div className="gift-bow" />
            </div>
            <div className="gift-box" style={{ background: 'linear-gradient(135deg, #a55eea, #8b4fd8)' }}>
              <div className="gift-lid" style={{ background: 'linear-gradient(135deg, #c48bff, #a55eea)' }} />
              <div className="gift-ribbon-vertical" style={{ background: '#fff' }} />
              <div className="gift-ribbon-horizontal" style={{ background: '#fff' }} />
              <div className="gift-bow" style={{ background: '#fff' }} />
            </div>
            <div className="gift-box" style={{ background: 'linear-gradient(135deg, #ffd6e8, #ffb3d1)' }}>
              <div className="gift-lid" style={{ background: 'linear-gradient(135deg, #fff, #ffd6e8)' }} />
              <div className="gift-ribbon-vertical" style={{ background: '#e84393' }} />
              <div className="gift-ribbon-horizontal" style={{ background: '#e84393' }} />
              <div className="gift-bow" style={{ background: '#e84393' }} />
            </div>
          </div>
        </div>

        <div className="letter-container">
          <div className="letter-paper">
            <div className="letter-content">
              {letterText.split('\n').map((line, i) => (
                <p key={i} className="letter-line">{line || <br />}</p>
              ))}
            </div>
            <div className="heart-seal">
              <span>♡</span>
            </div>
          </div>
          <div className="letter-shadow" />
        </div>

        <div className="bottom-ribbons">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="ribbon-streamer" style={{ 
              left: `${15 + i * 18}%`,
              background: `linear-gradient(180deg, hsl(${320 + i * 15}, 70%, 75%), hsl(${320 + i * 15}, 60%, 85%))`,
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;