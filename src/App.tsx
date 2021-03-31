import React      from "react";
import ReactSwipe from "react-swipe";
import Help       from "./Help";
import Swipe      from "./Swipe";
import fireworks  from "./fireworks";
import clsx       from "clsx";
import "./App.css";

import bunnyPng     from './img/bunny.png';
import bunnyDeadPng from './img/bunny_dead.png';
import handPng      from './img/hand.png';
import starPng      from './img/star.png';
import starBwPng    from './img/star_bw.png';

import {
  calcMaxLevel,
  calcMaxLives,
  calcMaxStars,
  gameReducer,
  extremeHands,
  INIT_STATE,
} from "./game";

import {
  Game,
  GameState,
  IterNode,
  Level,
  Lives,
  Players,
  Stars,
} from "./types";

const SLIDE_SPEED = 500;
const STORAGE_STATE = JSON.parse(localStorage.getItem("mind") || "false");
const { PRE, ACTIVE, WIN, LOSS } = GameState;

const handImg = <img className="hand" src={handPng} alt="Hand" />;

const times = (n: number, fn: IterNode) => Array.apply(null, Array(n)).map((_, i) => fn(i));

const numWord = (level: Level) : string => [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
][level] || "";

const renderPlayers = () => {
  return ([2, 3, 4] as Players[]).map((num: Players, i: number) => (
    <div key={`players${i}`}>
      <div className="row players">
        <div className="label">{num} Players</div>
      </div>
    </div>
  ));
};

function renderLevel(players: Players) {
  const maxLevel = calcMaxLevel(players);
  const numSlides = maxLevel + 1; // Add a final slide for victory condition

  return times(numSlides, (i) =>
    <div key={`level${i}`}>
      <div className="row level">
        <div className="label">
          {i + 1  <= maxLevel && <span>Level {i + 1}</span>}
          {i     === maxLevel && <span>YOU WIN!</span>}
        </div>
      </div>
    </div>
  );
}

function renderLives(lives: Lives, level: Level, players: Players) {
  // We allow lives to extend beyond the max, to keep the downgraded cell rendered while reverting levels
  const maxLives = calcMaxLives(players, level) || 0;
  const numSlides = Math.max(maxLives, lives) + 1;

  return times(numSlides, (i) =>
    <div key={`lives${i}`}>
      <div className="row lives">
        <div className="images" style={{ maxWidth: `${i*90}px` }}>
          {i === 0 && <div><img className="bunny" src={bunnyDeadPng} alt="Game Over" /></div>}
          {i   > 0 &&
            times(i, (j) =>
              <div key={`bunny${i}${j}`}><img className="bunny" src={bunnyPng} alt={`Life #${j + 1}`} /></div>
            )
          }
        </div>
      </div>
    </div>
  );
}

function renderStars(level: Level, stars: Stars) {
  const numSlides = Math.max(calcMaxStars(level), stars) + 1;

  return times(numSlides, (i) =>
    <div key={`stars${i}`}>
      <div className="row stars">
        <div className="images" style={{ maxWidth: `${i*90}px` }}>
          {
            i > 0 && times(i, (j) =>
              <div key={`star${i}${j}`}>
                <img className="star" src={starPng} alt={`Star #${j + 1}`} />
              </div>
            )
          }
          {i === 0 && <div><img className="star" src={starBwPng} alt="0 Stars" /></div>}
        </div>
      </div>
    </div>
  );
}

let livesSwipe: ReactSwipe | null;
let starsSwipe: ReactSwipe | null;

function usePrevious(game: Game) {
  const ref = React.useRef<Game>(game);
  React.useEffect(() => { ref.current = game; });
  return ref.current;
}

function App() {
  const [game, setGame] = React.useReducer(gameReducer, STORAGE_STATE || INIT_STATE);
  const prev = usePrevious(game);

  const setExtreme = (extreme: boolean) => setGame({ extreme });
  const setLevel   = (level: Level)     => setGame({ level });
  const setLives   = (lives: Lives)     => setGame({ lives });
  const setPlayers = (players: Players) => setGame({ players });
  const setStars   = (stars: Stars)     => setGame({ stars });
  const setState   = (state: GameState) => setGame({ state });

  const { extreme, level, lives, players, stars, state } = game;
  const maxLevel = calcMaxLevel(players);
  const maxLives = calcMaxLives(players, level);
  const maxStars = calcMaxStars(level);

  // Save state
  React.useEffect(() => localStorage.setItem("mind", JSON.stringify(game)), [game]);

  // Start or stop fireworks if win state changed
  React.useEffect(() => state === WIN ? fireworks.start() : fireworks.stop(), [state])

  // If our level changed, we may need to increase lives or stars
  React.useEffect(() => {
    if(prev && prev.level !== game.level) {
      const [ oldMaxLives, newMaxLives ] = [prev, game].map(x => calcMaxLives(x.players, x.level));
      const [ oldMaxStars, newMaxStars ] = [prev, game].map(x => calcMaxStars(x.level));

      // we allow undoing level gains, but loss can only be triggered by direct user action
      if(livesSwipe && oldMaxLives !== newMaxLives) {
        const newLivesPos = livesSwipe.getPos() - (oldMaxLives - newMaxLives);
        newLivesPos > 0 && game.state === ACTIVE && livesSwipe.slide(newLivesPos, SLIDE_SPEED)
      }
      if(starsSwipe && oldMaxStars !== newMaxStars) {
        const newStarsPos = starsSwipe.getPos() - (oldMaxStars - newMaxStars);
        starsSwipe.slide(newStarsPos, SLIDE_SPEED);
      }
    }
  }, [prev, game]);

  return (
    <div className="App">

      <Help state={state} />

      <div id="preWrap" className={clsx(state !== PRE && "hidden")}>
        <div id="playerCountSwipeWrap" className="reactSwipeWrap">
          <Swipe {...{
            panes: renderPlayers(),
            startSlide: players - 2,
            onSwipe: (idx: number) => setPlayers(idx + 2 as Players),
            leftButton:  players > 2,
            rightButton: players < 4,
          }} />
          <div id="playerCountSubtitle" className="subtitle">Levels 1 - {maxLevel}</div>
          <div id="isExtreme">
            <label>
              <input type="checkbox" checked={extreme} onChange={() => setExtreme(!extreme)} />
              <span className={clsx("x", !extreme && "off")}>x</span> Extreme
            </label>
          </div>
          <button
            id="startButton"
            onClick={() => setState(ACTIVE)}
          >
            <span>Start Game</span>
          </button>
        </div>
      </div> {/* #preWrap */}

      <div id="activeWrap" className={clsx(extreme && "extreme", state === PRE && "hidden")}>

        <div id="levelSwipeWrap" className="reactSwipeWrap">
          <Swipe {...{
            panes: renderLevel(players),
            startSlide: level - 1,
            onSwipe: (idx: number) => setLevel(idx + 1 as Level),
            leftButton:  state === ACTIVE && level > 1,
            rightButton: state === ACTIVE && level <= maxLevel,
          }} />
          <div id="levelSwipeSubtitle" className={clsx(state !== ACTIVE && "hidden")}>
            <div>{level === maxLevel && <>Final Level!</>}</div>
            <div>Deal {numWord(level)} To Each Player</div>
          </div>
        </div>

        <div id="livesSwipeWrap" className="reactSwipeWrap">
          <Swipe {...{
            saveRef: reactSwipe => (livesSwipe = reactSwipe),
            panes: renderLives(lives, level, players),
            startSlide: lives,
            onSwipe: (idx: number) => setLives(idx as Lives),
            className: clsx(state === WIN && "inactive"),
            leftButton:  state === ACTIVE,
            rightButton: lives < maxLives,
          }} />
          <div className="label">
            {lives === 0 && <span>GAME OVER</span>}
            {lives   > 0 && <span>Lives {lives} / {maxLives}</span>}
          </div>
        </div>

        <div id="starsSwipeWrap" className="reactSwipeWrap">
          <Swipe {...{
            saveRef: reactSwipe => (starsSwipe = reactSwipe),
            panes: renderStars(level, stars),
            startSlide: stars,
            // onSwipe: (idx: number) => setStars(Math.min(idx, maxStars) as Stars),
            onSwipe: (idx: number) => setStars(idx as Stars),
            className: clsx(state !== ACTIVE && "hidden"),
            leftButton:  state === ACTIVE && stars > 0,
            rightButton: state === ACTIVE && stars < maxStars,
          }} />
          <div className={state === ACTIVE ? "label" : "hidden"}>
            Stars {stars} / {maxStars}
          </div>
        </div>

        <div id="extremeWrap" className="reactSwipeWrap">
          <div className="positive">0 {extremeHands["+"].includes(level) && handImg}</div>
          <div className="negative">{  extremeHands["-"].includes(level) && handImg} 51</div>
        </div>

      </div> {/* #activeWrap */}

      <button
        id="newGameButton"
        onClick={() => setState(PRE)}
        className={clsx(![WIN, LOSS].includes(state) && "hidden")}
      >
        <span>New Game</span>
      </button>

    </div>
  );
}

export default App;
