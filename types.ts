export enum TimerMode {
  COUNTDOWN = 'COUNTDOWN',
  STOPWATCH = 'STOPWATCH'
}

export type EditScope = 'MINUTES' | 'SECONDS';

export interface Theme {
  id: string;
  label: string;
  bgClass: string;
  noise: boolean;
  vignette: boolean;
}

export interface TimerState {
  mode: TimerMode;
  seconds: number;
  initialDuration: number; // Used to reset countdown
  isRunning: boolean;
  uiVisible: boolean;
  editScope: EditScope;
  fontIndex: number;
}