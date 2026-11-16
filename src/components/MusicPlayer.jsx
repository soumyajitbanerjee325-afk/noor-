import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

function MusicPlayer({ enabled, onToggle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (enabled && !audioRef.current) {
      audioRef.current = new Audio('./music/romantic-bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      audioRef.current.load();
    }
  }, [enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled && isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [enabled, isPlaying]);

  const handleClick = () => {
    if (!enabled) return;
    setIsPlaying(prev => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`music-player ${isPlaying ? 'playing' : ''} ${enabled ? '' : 'disabled'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      aria-pressed={isPlaying}
      disabled={!enabled}
      tabIndex={enabled ? 0 : -1}
    >
      <div className="music-icon">
        <svg className="icon-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg className="icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
        <svg className="icon-muted" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
      </div>
      
      <div className="music-tooltip">
        <span>{enabled ? (isPlaying ? 'Pause music' : 'Play music') : 'Music unavailable'}</span>
        <kbd className="shortcut">M</kbd>
      </div>
      
      <div className="music-waves" aria-hidden="true">
        <span style={{ animationDelay: '0ms' }} />
        <span style={{ animationDelay: '100ms' }} />
        <span style={{ animationDelay: '200ms' }} />
        <span style={{ animationDelay: '300ms' }} />
      </div>
      
      <div className="music-note" aria-hidden="true">♪</div>
    </button>
  );
}

export default MusicPlayer;