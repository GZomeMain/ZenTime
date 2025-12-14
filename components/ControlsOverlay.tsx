import React from 'react';
import { 
  Maximize, 
  RotateCcw, 
  Play, 
  Pause, 
  Timer,
  Watch,
  Type,
  Palette,
  EyeOff
} from 'lucide-react';
import { TimerMode } from '../types';

interface ControlsOverlayProps {
  visible: boolean;
  mode: TimerMode;
  isRunning: boolean;
}

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-zinc-800 bg-zinc-200 rounded border border-zinc-400 mx-1 min-w-[1.2rem] text-center inline-block font-sans">
    {children}
  </kbd>
);

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({ visible, mode, isRunning }) => {
  return (
    <div 
      className={`
        absolute bottom-8 left-8 
        flex flex-col items-start gap-2
        pointer-events-none 
        transition-all duration-500 ease-in-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
      `}
    >
      
      {/* Primary Status Indicator */}
      <div className="mb-2 text-zinc-500 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
        {mode === TimerMode.COUNTDOWN ? <Timer size={12} /> : <Watch size={12} />}
        <span>{mode}</span>
        <span className="opacity-50">•</span>
        <span>{isRunning ? 'RUNNING' : 'PAUSED'}</span>
      </div>

      <div className="flex flex-col gap-1.5 text-zinc-600 text-xs font-medium">
        
        {/* Play/Pause */}
        <div className="flex items-center">
           <Kbd>Space</Kbd> 
           <span className="flex items-center gap-1">
             {isRunning ? 'Pause' : 'Start'}
             {isRunning ? <Pause size={10} /> : <Play size={10} />}
           </span>
        </div>

        {/* Mode Switch */}
        <div className="flex items-center">
           <Kbd>S</Kbd>
           <span>Switch Mode</span>
        </div>

        {/* Reset */}
        <div className="flex items-center">
           <Kbd>R</Kbd>
           <span className="flex items-center gap-1">Reset <RotateCcw size={10} /></span>
        </div>

        {/* Fullscreen */}
        <div className="flex items-center">
           <Kbd>F</Kbd>
           <span className="flex items-center gap-1">Fullscreen <Maximize size={10} /></span>
        </div>

        {/* Fonts */}
        <div className="flex items-center">
           <Kbd>T</Kbd>
           <span className="flex items-center gap-1">Font <Type size={10} /></span>
        </div>

        {/* Themes */}
        <div className="flex items-center">
           <Kbd>C</Kbd>
           <span className="flex items-center gap-1">Theme <Palette size={10} /></span>
        </div>

        {/* Hide UI */}
        <div className="flex items-center">
           <Kbd>H</Kbd>
           <span className="flex items-center gap-1">Toggle UI <EyeOff size={10} /></span>
        </div>

        {/* Editing (Conditional) */}
        {mode === TimerMode.COUNTDOWN && !isRunning && (
          <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-zinc-800/50">
            <div className="flex items-center">
               <Kbd>←</Kbd><Kbd>→</Kbd> 
               <span>Select</span>
            </div>
            <div className="flex items-center">
               <Kbd>↑</Kbd><Kbd>↓</Kbd> 
               <span>Adjust</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ControlsOverlay;