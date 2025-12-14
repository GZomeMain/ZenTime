import React from 'react';
import { EditScope } from '../types';

interface TimerDisplayProps {
  seconds: number;
  isRunning: boolean;
  isEditMode: boolean;
  editScope: EditScope;
  flashScope: EditScope | null;
  fontFamily: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  seconds, 
  isRunning, 
  isEditMode, 
  editScope,
  flashScope,
  fontFamily
}) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const paddedSeconds = secs < 10 ? `0${secs}` : `${secs}`;

  // Helper to determine styles for each part
  const getPartStyle = (part: EditScope) => {
    if (!isEditMode) return 'opacity-100 text-white';

    // If this part is currently flashing (user just pressed a key)
    if (flashScope === part) {
      return 'opacity-100 text-white scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]';
    }

    // Normal edit state
    if (editScope === part) {
      return 'opacity-100 text-zinc-300 scale-100'; // Active edit target
    }

    return 'opacity-30 text-zinc-300 scale-100'; // Inactive target
  };
  
  // Animation logic
  const containerAnimation = isRunning ? 'animate-subtle-pulse' : 'opacity-90';
  const colonAnimation = isRunning ? 'animate-subtle-blink' : '';

  return (
    <div className="flex items-center justify-center w-full h-full select-none overflow-hidden">
      <div 
        style={{ fontFamily }}
        className={`
          ${containerAnimation}
          text-[25vw] leading-none tracking-tighter
          flex items-center justify-center gap-[1vw]
          transition-colors duration-300
        `}
      >
        <span className={`transition-all duration-100 ease-out origin-right ${getPartStyle('MINUTES')}`}>
          {paddedMinutes}
        </span>
        <span className={`pb-[2vw] text-white ${colonAnimation}`}>:</span>
        <span className={`transition-all duration-100 ease-out origin-left ${getPartStyle('SECONDS')}`}>
          {paddedSeconds}
        </span>
      </div>
    </div>
  );
};

export default TimerDisplay;