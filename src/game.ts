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

export const calcMaxLives = (players: Players, level: Level) => {
  const lvl = Math.min(level, calcMaxLevel(players)) as Level;
  return (baseLives(players) + extraLives(lvl)) as Lives;
}

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

export function gameReducer(oldGame: Game, change: Partial<Game>) {
  // console.log("gameUpdate", change);
  const { PRE, ACTIVE, WIN, LOSS } = GameState;
  let newGame = { ...oldGame, ...change };
  if(oldGame.level !== newGame.level) {
    newGame.state = newGame.level > calcMaxLevel(newGame.players)
      ? WIN
      : ACTIVE
      ;
  }
  else if(oldGame.lives !== newGame.lives) {
    newGame.state = newGame.lives > 0 && newGame.state !== WIN
      ? ACTIVE
      : LOSS
      ;
  }
  else if(oldGame.state === PRE && newGame.state === ACTIVE) {
    newGame = {
      ...INIT_STATE,
      extreme: newGame.extreme,
      lives: calcMaxLives(newGame.players, 1),
      players: newGame.players,
      state: ACTIVE,
    };
    // console.log(JSON.stringify(newGame));
  }
  return newGame;
}
