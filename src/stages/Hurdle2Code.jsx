import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Hurdle2Code.css';

const SECRET_CODE = '2110';
const MAX_ATTEMPTS = 10;

function Hurdle2Code({ onComplete }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('Enter our special 4-digit number 💖');
  const [celebration, setCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRefs = useRef([]);

  const submitCode = useCallback(() => {
    if (code.some(c => c === '')) return;
    
    const guess = code.join('');
    const attemptNum = attempts.length + 1;
    const isCorrect = guess === SECRET_CODE;
    
    const newAttempt = { guess, correct: isCorrect, position: attemptNum };
    setAttempts(prev => [...prev, newAttempt]);
    setCurrentAttempt(attemptNum);
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
    
    if (isCorrect) {
      setGameComplete(true);
      setMessage('That\'s our number! 💕');
      setCelebration(true);
      setTimeout(() => onComplete(), 2000);
    } else if (attemptNum >= MAX_ATTEMPTS) {
      setMessage(`Out of attempts! The code was ${SECRET_CODE} 💖`);
      setGameComplete(true);
      setTimeout(() => onComplete(), 3000);
    } else {
      const remaining = MAX_ATTEMPTS - attemptNum;
      setMessage(`Not quite... ${remaining} attempt${remaining !== 1 ? 's' : ''} left 💫`);
    }
  }, [code, attempts.length, onComplete]);

  const handleInputChange = useCallback((e, index) => {
    if (gameComplete) return;
    const val = e.target.value.replace(/\D/g, '');
    const char = val ? val.slice(-1) : '';

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code, gameComplete]);

  const handleKeyDown = useCallback((e, index) => {
    if (gameComplete) return;
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];
      if (newCode[index]) {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submitCode();
    }
  }, [code, gameComplete, submitCode]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputRefs.current[3]?.focus();
    }
  }, []);

  const handleHintClick = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  const restartGame = useCallback(() => {
    setCode(['', '', '', '']);
    setAttempts([]);
    setCurrentAttempt(0);
    setGameComplete(false);
    setMessage('Enter our special 4-digit number 💖');
    setCelebration(false);
    setShowHint(false);
    inputRefs.current[0]?.focus();
  }, []);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="stage-content">
      <h1 className="stage-title">Hurdle 2 🔐</h1>
      <p className="stage-subtitle">Guess our special number to continue</p>
      
      <div className="game-info">
        <div className="attempts-display">
          <span className="attempts-label">Attempts</span>
          <span className="attempts-value">{attempts.length} / {MAX_ATTEMPTS}</span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={attempts.length} aria-valuemin={0} aria-valuemax={MAX_ATTEMPTS}>
          <div className="progress-fill" style={{ width: `${(attempts.length / MAX_ATTEMPTS) * 100}%` }} />
        </div>
      </div>

      <div 
        className="code-game-container"
        role="application"
        aria-label="Code guessing game"
      >
        <div className="code-input-wrapper">
          <label className="code-label" htmlFor="code-input-0">Enter the code</label>
          <div className="code-inputs" role="group" aria-label="4 digit code">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                id={`code-input-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                autoComplete="off"
                spellCheck={false}
                disabled={gameComplete}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            className="btn btn-primary submit-btn"
            onClick={submitCode}
            disabled={code.some(c => c === '') || gameComplete}
            aria-label="Submit code"
          >
            <span>Unlock</span>
            <span className="btn-icon">💖</span>
          </button>
        </div>

        <div className="hint-section">
          <button
            className="btn btn-ghost hint-btn"
            onClick={handleHintClick}
            aria-expanded={showHint}
          >
            <span>{showHint ? 'Hide' : 'Show'} Hint</span>
            <span className="btn-icon">{showHint ? '🙈' : '💡'}</span>
          </button>
          
          {showHint && (
            <div className="hint-content" role="status" aria-live="polite">
              <div className="hint-icon">💝</div>
              <p className="hint-text">Hint: It's <strong>our number</strong>...</p>
              <p className="hint-clue">The day i fell for You : <strong></strong>💖</p>
            </div>
          )}
        </div>

        <div className="attempts-history" aria-label="Previous attempts">
          {attempts.length > 0 && (
            <>
              <h3 className="history-title">Your Attempts</h3>
              <div className="attempts-list">
                {attempts.slice().reverse().map((attempt, i) => (
                  <div 
                    key={attempt.position} 
                    className={`attempt-item ${attempt.correct ? 'correct' : 'incorrect'}`}
                  >
                    <span className="attempt-number">#{attempt.position}</span>
                    <span className="attempt-code">{attempt.guess}</span>
                    <span className="attempt-result" aria-hidden="true">
                      {attempt.correct ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {celebration && (
          <div className="code-celebration" aria-hidden="true">
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
          disabled={attempts.length === 0}
        >
          <span>Reset</span>
          <span className="btn-icon">🔄</span>
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

export default Hurdle2Code;