import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Hurdle2Puzzle.css';

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

function createSolvedPieces() {
  return Array.from({ length: TOTAL_PIECES }, (_, i) => ({
    id: i,
    correctPos: i,
    currentPos: i,
  }));
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function isSolvable(permutation) {
  let inversions = 0;
  for (let i = 0; i < permutation.length; i++) {
    for (let j = i + 1; j < permutation.length; j++) {
      if (permutation[i] > permutation[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

function createShuffledPieces() {
  let pieces = createSolvedPieces();
  let shuffled;
  do {
    shuffled = shuffleArray([...pieces]);
  } while (!isSolvable(shuffled.map(p => p.correctPos)) || 
           shuffled.every((p, i) => p.correctPos === i));
  
  return shuffled.map((piece, index) => ({
    ...piece,
    currentPos: index,
  }));
}

function Hurdle2Puzzle({ onComplete }) {
  const [pieces, setPieces] = useState(() => createShuffledPieces());
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('Drag pieces to complete the heart! 💖');
  const [celebration, setCelebration] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const dragStartRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkWin = useCallback((newPieces) => {
    return newPieces.every(p => p.currentPos === p.correctPos);
  }, []);

  const handleDragStart = useCallback((e, pieceId) => {
    if (gameComplete) return;
    dragStartRef.current = pieceId;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  }, [gameComplete]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.target.closest('.puzzle-slot')?.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.target.closest('.puzzle-slot')?.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e, targetPos) => {
    e.preventDefault();
    const sourceId = dragStartRef.current;
    e.target.closest('.puzzle-slot')?.classList.remove('drag-over');
    
    if (sourceId === null || gameComplete) return;

    setPieces(prev => {
      const sourceIndex = prev.findIndex(p => p.id === sourceId);
      const targetIndex = prev.findIndex(p => p.currentPos === targetPos);
      
      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return prev;
      }

      const newPieces = [...prev];
      const sourcePiece = newPieces[sourceIndex];
      const targetPiece = newPieces[targetIndex];
      
      newPieces[sourceIndex] = { ...sourcePiece, currentPos: targetPiece.currentPos };
      newPieces[targetIndex] = { ...targetPiece, currentPos: sourcePiece.currentPos };
      
      setMoves(m => m + 1);
      
      if (checkWin(newPieces)) {
        setGameComplete(true);
        setMessage('Perfect! The heart is complete! 💕');
        setCelebration(true);
        setTimeout(() => onComplete(), 2000);
      } else {
        setMessage(`${TOTAL_PIECES - newPieces.filter(p => p.currentPos === p.correctPos).length} pieces to go! 💖`);
      }
      
      return newPieces;
    });
    
    dragStartRef.current = null;
  }, [gameComplete, checkWin, onComplete]);

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.puzzle-slot').forEach(s => s.classList.remove('drag-over'));
    dragStartRef.current = null;
  }, []);

  const restartGame = useCallback(() => {
    setPieces(createShuffledPieces());
    setMoves(0);
    setGameComplete(false);
    setMessage('Drag pieces to complete the heart! 💖');
    setCelebration(false);
  }, []);

  const getPieceAtPos = (pos) => pieces.find(p => p.currentPos === pos);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Hurdle 2 🧩</h1>
      <p className="stage-subtitle">Complete the heart puzzle to continue</p>
      
      <div className="game-info">
        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(elapsedTime)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Correct</span>
            <span className="stat-value">
              {pieces.filter(p => p.currentPos === p.correctPos).length} / {TOTAL_PIECES}
            </span>
          </div>
        </div>
        <div className="progress-bar" role="progressbar" 
             aria-valuenow={pieces.filter(p => p.currentPos === p.correctPos).length} 
             aria-valuemin={0} aria-valuemax={TOTAL_PIECES}>
          <div className="progress-fill" 
               style={{ width: `${(pieces.filter(p => p.currentPos === p.correctPos).length / TOTAL_PIECES) * 100}%` }} />
        </div>
      </div>

      <div 
        className="puzzle-container"
        role="application"
        aria-label="Heart sliding puzzle"
      >
        <div className="puzzle-grid" aria-hidden="true">
          {Array.from({ length: TOTAL_PIECES }, (_, i) => i).map(pos => {
            const piece = getPieceAtPos(pos);
            const isCorrect = piece && piece.currentPos === piece.correctPos;
            
            return (
              <div
                key={pos}
                className={`puzzle-slot ${isCorrect ? 'correct' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, pos)}
              >
                {piece && (
                  <div
                    className={`puzzle-piece ${isCorrect ? 'correct' : ''} ${dragStartRef.current === piece.id ? 'dragging' : ''}`}
                    draggable={!gameComplete}
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      backgroundPosition: `${-(piece.correctPos % GRID_SIZE) * 100}% ${-(Math.floor(piece.correctPos / GRID_SIZE)) * 100}%`,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={isCorrect ? `Piece ${piece.correctPos + 1}, correct` : `Piece ${piece.correctPos + 1}`}
                    aria-grabbed={dragStartRef.current === piece.id}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !gameComplete) {
                        e.preventDefault();
                        handleDragStart(e, piece.id);
                      }
                    }}
                  >
                    <div className="piece-number" aria-hidden="true">{piece.correctPos + 1}</div>
                    {isCorrect && <div className="check-mark" aria-hidden="true">✓</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {celebration && (
          <div className="puzzle-celebration" aria-hidden="true">
            <div className="celebration-hearts">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="celeb-heart" style={{
                  '--angle': `${i * 24}deg`,
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

      {!gameComplete && (
        <button
          className="btn btn-ghost restart-btn"
          onClick={restartGame}
        >
          <span>Shuffle</span>
          <span className="btn-icon">🔀</span>
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

export default Hurdle2Puzzle;