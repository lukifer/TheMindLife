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

export function gameReducer(prev: Game, change: Partial<Game>) {
  // console.log("gameUpdate", change);
  const { PRE, ACTIVE, WIN, LOSS } = GameState;
  let game = { ...prev, ...change };

  if(prev.level !== game.level) {
    game.state = game.level > calcMaxLevel(game.players)
      ? WIN
      : ACTIVE
      ;
    if(game.state === ACTIVE) {
      const [ oldMaxLives, newMaxLives ] = [prev, game].map(x => calcMaxLives(x.players, x.level));
      const [ oldMaxStars, newMaxStars ] = [prev, game].map(x => calcMaxStars(x.level));
      game = {
        ...game,
        stars: game.stars - (oldMaxStars - newMaxStars) as Stars,
        lives: game.lives - (oldMaxLives - newMaxLives) as Lives,
      };
    }
  }
  else if(prev.lives !== game.lives) {
    game.state = game.lives > 0 && game.state !== WIN
      ? ACTIVE
      : LOSS
      ;
  }
  else if(prev.state === PRE && game.state === ACTIVE) {
    game = {
      ...INIT_STATE,
      extreme: game.extreme,
      lives: calcMaxLives(game.players, 1),
      players: game.players,
      state: ACTIVE,
    };

    // console.log(JSON.stringify(game));
  }
  return game;
}
