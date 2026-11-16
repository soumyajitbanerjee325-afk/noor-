import React from 'react';
import BirthdayCard from './BirthdayCard';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="card-wrapper">
        <BirthdayCard />
      </div>
      <div className="instructions">
        <h3>💖 To add Noor's photo:</h3>
        <p>In <code>BirthdayCard.jsx</code>, replace the <code>.photo-placeholder</code> div with:</p>
        <pre>{`<img 
  src="path/to/noor-photo.jpg" 
  className="noor-photo" 
  alt="Noor"
/>`}</pre>
        <p>Make sure the photo is portrait-oriented for best results!</p>
      </div>
    </div>
  );
}

export default App;