import {
  Game,
  GameState,
  Level,
  Lives,
  Players,
  Stars,
} from "./types";

const baseLives = (players: Players) => players as Lives;
const baseStars = 1 as Stars;

function extraLives(level: Level) {
  return [3, 6, 9].reduce((lives: number, x: number) => lives + (level >= x ? 1 : 0), 0) as Lives;
}

export const calcMaxLevel = (players: Players) =>
  [12, 10, 8][players - 2] as Level;

export const calcMaxLives = (players: Players, level: Level) =>
  (baseLives(players) + extraLives(level)) as Lives;

export const calcMaxStars = (level: Level) =>
  [2, 5, 8].reduce((stars: number, x: number) => stars + (level >= x ? 1 : 0), baseStars) as Stars;

export const extremeHands = {
  "+": [3, 6,  8, 10],
  "-": [4, 6, 10, 12],
};

export const INIT_STATE: Game = {
  players: 2 as Players,
  level: 1 as Level,
  lives: 2 as Lives,
  stars: 1 as Stars,
  state: GameState.PRE,
  extreme: false,
};
