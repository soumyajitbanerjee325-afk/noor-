import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Stage3Adulthood.css';

const adulthoodPhotos = [
  { id: 1, src: '/photos/adult1.jpg', alt: 'Noor glowing', caption: 'Ethereal Noor 💜' },
  { id: 2, src: '/photos/adult2.jpg', alt: 'Noor gorgeous', caption: 'Gorgeous Soul 🌹' },
  { id: 3, src: '/photos/adult3.jpg', alt: 'Noor dreamy', caption: 'Dreamy & Beautiful 💫' },
];

function Stage3Adulthood({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % adulthoodPhotos.length);
      }, 4000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, currentIndex]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % adulthoodPhotos.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + adulthoodPhotos.length) % adulthoodPhotos.length);
  }, []);

  useEffect(() => {
    if (currentIndex === adulthoodPhotos.length - 1) {
      const timer = setTimeout(() => setShowNextButton(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  }, [goPrev, goNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Beautiful Noor 🌸</h1>
      <p className="stage-subtitle">Growing more beautiful every day</p>
      
      <div className="carousel-container" ref={carouselRef} role="region" aria-label="Adulthood memories carousel" onMouseEnter={() => setAutoPlay(false)} onMouseLeave={() => setAutoPlay(true)}>
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {adulthoodPhotos.map((photo, index) => (
            <div key={photo.id} className="carousel-slide" data-index={index}>
              <div className="slide-card">
                <div className="slide-photo">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="carousel-real-img"
                    loading="lazy"
                  />
                  <div className="photo-frame-decoration" aria-hidden="true">
                    <div className="frame-corner top-left" />
                    <div className="frame-corner top-right" />
                    <div className="frame-corner bottom-left" />
                    <div className="frame-corner bottom-right" />
                  </div>
                </div>
                <div className="slide-caption">
                  <span className="caption-main">{photo.caption}</span>
                  <span className="caption-sub">Memory {index + 1} of {adulthoodPhotos.length}</span>
                </div>
              </div>
              
              <div className="slide-hearts" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="slide-heart" style={{ 
                    '--angle': `${i * 72}deg`,
                    '--delay': `${(index * 0.5 + i * 0.1)}s`,
                  }}>💖</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="carousel-btn prev"
          onClick={goPrev}
          aria-label="Previous photo"
          disabled={false}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        
        <button 
          className="carousel-btn next"
          onClick={goNext}
          aria-label="Next photo"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>

        <div className="carousel-indicators" role="tablist" aria-label="Photo navigation">
          {adulthoodPhotos.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="floating-elements" aria-hidden="true">
        <div className="float-heart large" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>💕</div>
        <div className="float-heart medium" style={{ top: '20%', right: '5%', animationDelay: '1s' }}>💖</div>
        <div className="float-heart small" style={{ bottom: '30%', left: '3%', animationDelay: '2s' }}>💗</div>
        <div className="float-heart medium" style={{ bottom: '10%', right: '8%', animationDelay: '3s' }}>💓</div>
        <div className="float-sparkle" style={{ top: '15%', left: '10%', animationDelay: '0.5s' }}>✨</div>
        <div className="float-sparkle" style={{ top: '60%', right: '10%', animationDelay: '1.5s' }}>✦</div>
        <div className="float-sparkle" style={{ bottom: '20%', left: '15%', animationDelay: '2.5s' }}>✧</div>
      </div>

      {showNextButton && (
        <button
          className="btn btn-primary next-btn"
          onClick={onComplete}
          autoFocus
        >
          <span>Final Challenge</span>
          <span className="btn-icon">💕</span>
        </button>
      )}
    </div>
  );
}

export default Stage3Adulthood;