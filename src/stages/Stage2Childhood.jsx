import React, { useState, useEffect, useRef } from 'react';
import './Stage2Childhood.css';

const childhoodPhotos = [
  { id: 1, src: './photos/childhood1.jpg', alt: 'Little Noor as a baby', caption: 'Little Noor ✨', tag: 'little' },
  { id: 2, src: './photos/childhood2.jpg', alt: 'Little Noor smiling', caption: 'Little Angel 💖', tag: 'little' },
  { id: 3, src: './photos/childhood3.jpg', alt: 'Noor growing up', caption: 'Growing Fast 🦋', tag: 'growing' },
];

function Stage2Childhood({ onComplete }) {
  const [visiblePhotos, setVisiblePhotos] = useState(new Set());
  const [showNextButton, setShowNextButton] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.dataset.id, 10);
          setVisiblePhotos(prev => new Set([...prev, id]));
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    containerRef.current?.querySelectorAll('.polaroid').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visiblePhotos.size === childhoodPhotos.length) {
      const timer = setTimeout(() => setShowNextButton(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [visiblePhotos.size]);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Childhood Memories 📸</h1>
      <p className="stage-subtitle">Little Noor growing up so fast</p>
      
      <div className="polaroid-gallery" ref={containerRef} role="list" aria-label="Childhood photos">
        {childhoodPhotos.map((photo, index) => (
          <article
            key={photo.id}
            className={`polaroid ${visiblePhotos.has(photo.id) ? 'visible' : ''}`}
            data-id={photo.id}
            style={{ 
              '--index': index,
              '--delay': `${index * 0.15}s`,
              '--rotation': `${(Math.random() - 0.5) * 8}deg`,
            }}
            role="listitem"
          >
            <div className="polaroid-frame">
              <div className="polaroid-photo">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="polaroid-real-img"
                  loading="lazy"
                />
                <div className={`photo-tag ${photo.tag}`}>
                  {photo.tag === 'little' ? '🍼 Little' : '🦋 Growing Fast'}
                </div>
                <div className="photo-overlay" aria-hidden="true">
                  <div className="overlay-hearts">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="overlay-heart" style={{ '--i': i }}>💖</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="polaroid-caption">
                <span className="caption-text">{photo.caption}</span>
                <span className="caption-date" aria-hidden="true">📅</span>
              </div>
            </div>
            
            <div className="polaroid-shadow" aria-hidden="true" />
            <div className="polaroid-tape top" aria-hidden="true" />
            <div className="polaroid-tape bottom" aria-hidden="true" />
            <div className="polaroid-heart" aria-hidden="true">💕</div>
          </article>
        ))}
      </div>

      <div className="floating-hearts" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="gallery-heart"
            style={{
              '--angle': `${i * 30}deg`,
              '--delay': `${Math.random() * 2}s`,
              '--duration': `${4 + Math.random() * 3}s`,
              '--size': `${16 + Math.random() * 20}px`,
            }}
          >💖</div>
        ))}
      </div>

      {showNextButton && (
        <button
          className="btn btn-primary next-btn"
          onClick={onComplete}
          autoFocus
        >
          <span>Next Challenge</span>
          <span className="btn-icon">💕</span>
        </button>
      )}
    </div>
  );
}

export default Stage2Childhood;