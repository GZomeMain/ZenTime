/**
 * Formats seconds into MM:SS.
 * If minutes > 99, it allows it (e.g., 100:00).
 */
export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${paddedMinutes}:${paddedSeconds}`;
};

/**
 * Toggles fullscreen mode on the document.
 */
export const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((e) => {
      console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

/**
 * Plays a notification sound (beep sequence) using Web Audio API.
 */
export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    
    const playBeep = (startTime: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, startTime + 0.3);
      
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    };

    const now = ctx.currentTime;
    // Play a sequence of 3 beeps
    playBeep(now, 880);
    playBeep(now + 0.2, 880);
    playBeep(now + 0.4, 880);

  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

/**
 * Plays a short, crisp "keyboard click" sound.
 * Adjusted to be quieter and clickier (high-freq transient).
 */
export const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const t = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Triangle wave for a sharper "click" texture
    osc.type = 'triangle';
    
    // High pitch start dropping very fast for a mechanical switch feel
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.015);
    
    // Very short, quiet envelope
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    
    osc.start(t);
    osc.stop(t + 0.04);
  } catch (error) {
    // Ignore audio errors
  }
};