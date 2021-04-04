import ReactSwipe from 'react-swipe';

export type IterNode = (n: number) => React.ReactNode;
export type Fn = () => void;

export type Players = 2 | 3 | 4;
export type Level   = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Lives   = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Stars   = 0 | 1 | 2 | 3 | 4;

export enum GameState {
  PRE    = "pre",
  ACTIVE = "active",
  WIN    = "win",
  LOSS   = "loss",
}

export type Game = {
  state: GameState;
  level: Level;
  players: Players;
  lives: Lives;
  stars: Stars;
  extreme: boolean;
}

export type SwipeName = "players" | "levels" | "lives" | "stars";

export type SwipeProps = {
  panes: React.ReactNode[];
  startSlide: number;
  onSwipe: (slideIndex: number) => void;
  saveRef?: (swipe: ReactSwipe) => void;
  className?: string;
  leftButton?:  boolean;
  rightButton?: boolean;
}
