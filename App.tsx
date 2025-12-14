import React from 'react';
import TimerDisplay from './components/TimerDisplay';
import ControlsOverlay from './components/ControlsOverlay';
import { useTimerEngine } from './hooks/useTimerEngine';
import { TimerMode } from './types';

const App: React.FC = () => {
  const { 
    mode, 
    seconds, 
    isRunning, 
    uiVisible, 
    editScope, 
    flashScope,
    fontFamily,
    currentTheme 
  } = useTimerEngine();

  const isEditMode = mode === TimerMode.COUNTDOWN && !isRunning;

  return (
    <main className={`relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-700 ${currentTheme.bgClass}`}>
      
      {/* Theme: Noise Overlay */}
      {currentTheme.noise && (
        <div className="bg-noise animate-in fade-in duration-700" />
      )}
      
      {/* Theme: Vignette Overlay */}
      {currentTheme.vignette && (
        <div className="bg-vignette animate-in fade-in duration-700" />
      )}

      {/* Border Visual Cue */}
      {/* We use border-white/10 to work with any dark background */}
      <div 
        className={`absolute inset-0 pointer-events-none border-[12px] transition-colors duration-500 z-10
        ${isRunning ? 'border-transparent' : 'border-white/10'}
        `} 
      />

      {/* Main Display */}
      {/* Z-Index 20 to sit above background effects */}
      <div className="z-20 w-full">
        <TimerDisplay 
          seconds={seconds} 
          isRunning={isRunning} 
          isEditMode={isEditMode}
          editScope={editScope}
          flashScope={flashScope}
          fontFamily={fontFamily}
        />
      </div>

      {/* Overlay */}
      {/* Z-Index 30 to sit on top */}
      <div className="z-30">
        <ControlsOverlay 
          visible={uiVisible} 
          mode={mode} 
          isRunning={isRunning} 
        />
      </div>

    </main>
  );
};

export default App;