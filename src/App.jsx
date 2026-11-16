import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';
import './App.css';
import BackgroundAnimation from './components/BackgroundAnimation';
import MusicPlayer from './components/MusicPlayer';
import ProgressIndicator from './components/ProgressIndicator';
import StageTransition from './components/StageTransition';
import Stage1Cake from './stages/Stage1Cake';
import Stage2Childhood from './stages/Stage2Childhood';
import Hurdle1Memory from './stages/Hurdle1Memory';
import Stage3Adulthood from './stages/Stage3Adulthood';
import Hurdle2Code from './stages/Hurdle2Code';
import FinalStage from './stages/FinalStage';

const stages = [
  { id: 'cake', label: 'Cake', component: Stage1Cake },
  { id: 'childhood', label: 'Memories', component: Stage2Childhood },
  { id: 'hurdle1', label: 'Match Hearts', component: Hurdle1Memory },
  { id: 'adulthood', label: 'Growing Up', component: Stage3Adulthood },
  { id: 'hurdle2', label: 'Secret Code', component: Hurdle2Code },
  { id: 'final', label: 'Forever', component: FinalStage },
];

function App() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState(new Set([0]));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const transitionRef = useRef(null);

  const goToNextStage = useCallback(() => {
    if (currentStageIndex < stages.length - 1) {
      setDirection('forward');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStageIndex(prev => prev + 1);
        setCompletedStages(prev => new Set([...prev, currentStageIndex + 1]));
        setIsTransitioning(false);
      }, 600);
    }
  }, [currentStageIndex]);

  const goToStage = useCallback((index) => {
    if (index < 0 || index >= stages.length || index === currentStageIndex) return;
    if (!completedStages.has(index) && index > currentStageIndex) return;
    
    setDirection(index > currentStageIndex ? 'forward' : 'backward');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStageIndex(index);
      setIsTransitioning(false);
    }, 600);
  }, [currentStageIndex, completedStages]);

  const restartJourney = useCallback(() => {
    setDirection('backward');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStageIndex(0);
      setCompletedStages(new Set([0]));
      setIsTransitioning(false);
    }, 600);
  }, []);

  const CurrentStageComponent = stages[currentStageIndex].component;

  return (
    <div className="app">
      <BackgroundAnimation />
      <MusicPlayer enabled={musicEnabled} onToggle={setMusicEnabled} />
      <ProgressIndicator 
        stages={stages} 
        currentIndex={currentStageIndex} 
        completed={completedStages}
        onStageClick={goToStage}
      />
      
      <StageTransition 
        isActive={isTransitioning} 
        direction={direction}
        ref={transitionRef}
      />
      
      <main className="stage-container" role="main" aria-live="polite">
        <CurrentStageComponent 
          onComplete={goToNextStage}
          onRestart={restartJourney}
        />
      </main>
    </div>
  );
}

export default App;