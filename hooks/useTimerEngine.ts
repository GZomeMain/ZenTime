import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, EditScope, Theme } from '../types';
import { toggleFullscreen, playNotificationSound, playClickSound } from '../utils';

export const FONTS = [
  'JetBrains Mono',
  'Share Tech Mono',
  'Space Mono',
  'Roboto Mono',
  'Inter',
  'Cinzel',
  'Playfair Display',
  'Times New Roman'
];

export const THEMES: Theme[] = [
  { id: 'void', label: 'Void', bgClass: 'bg-black', noise: false, vignette: false },
  { id: 'carbon', label: 'Carbon', bgClass: 'bg-zinc-950', noise: true, vignette: true },
  { id: 'midnight', label: 'Midnight', bgClass: 'bg-slate-950', noise: true, vignette: true },
  { id: 'forest', label: 'Forest', bgClass: 'bg-emerald-950', noise: true, vignette: true },
  { id: 'coffee', label: 'Coffee', bgClass: 'bg-stone-950', noise: true, vignette: true },
  { id: 'crimson', label: 'Crimson', bgClass: 'bg-rose-950', noise: true, vignette: true },
];

export const useTimerEngine = () => {
  // State
  const [mode, setMode] = useState<TimerMode>(TimerMode.COUNTDOWN);
  const [seconds, setSeconds] = useState(1500); // Default 25 mins
  const [initialDuration, setInitialDuration] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [isUserHidden, setIsUserHidden] = useState(false);
  
  // New State for enhancements
  const [editScope, setEditScope] = useState<EditScope>('MINUTES');
  const [fontIndex, setFontIndex] = useState(0);
  const [flashScope, setFlashScope] = useState<EditScope | null>(null);
  
  // Theme State
  const [themeIndex, setThemeIndex] = useState(0);

  // Refs
  const intervalRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setIsRunning(false);
    if (mode === TimerMode.COUNTDOWN) {
      setSeconds(initialDuration);
    } else {
      setSeconds(0);
    }
  }, [mode, initialDuration]);

  const toggleTimer = useCallback(() => {
    if (seconds === 0 && mode === TimerMode.COUNTDOWN) return; // Don't start if 0
    setIsRunning(prev => !prev);
  }, [seconds, mode]);

  const switchMode = useCallback(() => {
    setIsRunning(false);
    if (mode === TimerMode.COUNTDOWN) {
      setMode(TimerMode.STOPWATCH);
      setSeconds(0);
    } else {
      setMode(TimerMode.COUNTDOWN);
      // Reset to the last known initial duration for countdown
      setSeconds(initialDuration > 0 ? initialDuration : 300); 
    }
  }, [mode, initialDuration]);

  const cycleFont = useCallback(() => {
    setFontIndex(prev => (prev + 1) % FONTS.length);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeIndex(prev => (prev + 1) % THEMES.length);
  }, []);
  
  const toggleUi = useCallback(() => {
    setIsUserHidden(prev => {
      const newState = !prev;
      // If we are unhiding, ensure the UI shows up immediately
      if (!newState) {
        setUiVisible(true);
      }
      return newState;
    });
  }, []);

  // Auto-hide UI logic
  useEffect(() => {
    let hideTimer: number;

    const resetHideTimer = () => {
      setUiVisible(true);
      if (isRunning) {
        clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => setUiVisible(false), 3000);
      }
    };

    if (isRunning) {
      // Start the auto-hide timer initially
      resetHideTimer();
      
      window.addEventListener('mousemove', resetHideTimer);
      window.addEventListener('keydown', resetHideTimer);
    } else {
      // When paused, always show UI
      setUiVisible(true);
    }

    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener('mousemove', resetHideTimer);
      window.removeEventListener('keydown', resetHideTimer);
    };
  }, [isRunning]);

  // Timer Tick Logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (mode === TimerMode.STOPWATCH) {
            return prev + 1;
          } else {
            // Countdown
            const nextVal = prev - 1;
            if (nextVal <= 0) {
              setIsRunning(false);
              playNotificationSound();
              return 0;
            }
            return nextVal;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  // Adjust Time Logic (Only for Countdown when paused)
  const adjustTime = useCallback((increment: boolean) => {
    if (mode === TimerMode.STOPWATCH || isRunning) return;

    // Visual Feedback: Flash the currently edited scope
    setFlashScope(editScope);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = window.setTimeout(() => setFlashScope(null), 150);

    // Audio Feedback
    playClickSound();

    setSeconds(prev => {
      let currentMinutes = Math.floor(prev / 60);
      let currentSeconds = prev % 60;

      if (editScope === 'MINUTES') {
        currentMinutes += increment ? 1 : -1;
        if (currentMinutes < 0) currentMinutes = 0;
        // Limit max minutes to prevent overflow issues if needed, but 999 is fine
        if (currentMinutes > 999) currentMinutes = 999;
      } else {
        currentSeconds += increment ? 1 : -1;
        if (currentSeconds < 0) currentSeconds = 59;
        if (currentSeconds > 59) currentSeconds = 0;
      }

      const newVal = (currentMinutes * 60) + currentSeconds;
      setInitialDuration(newVal); // Update the "reset" point
      return newVal;
    });
  }, [mode, isRunning, editScope]);

  const toggleEditScope = useCallback(() => {
    setEditScope(prev => prev === 'MINUTES' ? 'SECONDS' : 'MINUTES');
  }, []);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'Space':
          toggleTimer();
          break;
        case 'KeyR':
          reset();
          break;
        case 'KeyS':
          switchMode();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyT':
          cycleFont();
          break;
        case 'KeyC':
          cycleTheme();
          break;
        case 'KeyH':
          toggleUi();
          break;
        // Time Adjustment
        case 'ArrowUp':
          adjustTime(true);
          break;
        case 'ArrowDown':
          adjustTime(false);
          break;
        case 'ArrowRight':
        case 'ArrowLeft':
          toggleEditScope();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, reset, switchMode, adjustTime, toggleEditScope, cycleFont, cycleTheme, toggleUi]);

  return {
    mode,
    seconds,
    isRunning,
    uiVisible: uiVisible && !isUserHidden, // Final visibility depends on auto-hide logic AND user toggle
    editScope,
    flashScope,
    fontFamily: FONTS[fontIndex],
    currentTheme: THEMES[themeIndex],
    setUiVisible
  };
};