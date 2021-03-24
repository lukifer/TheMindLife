import React      from "react";
import ReactSwipe from "react-swipe";
import Help       from "./Help";
import fireworks  from "./fireworks";
import clsx       from "clsx";
import "./App.css";

import {
  calcMaxLevel,
  calcMaxLives,
  calcMaxStars,
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
  SwipeArgs,
  Stars,
} from "./types";

const SLIDE_SPEED = 500;
const STORAGE_STATE = JSON.parse(localStorage.getItem("mind") || "false");
const { PRE, ACTIVE, WIN, LOSS } = GameState;
const { body } = document;

const handImg = <img className="hand" src="img/hand.png" alt="Hand" />;

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
          {i === 0 && <div><img key="bunny-dead" className="bunny bunnyDead" src="img/bunny-dead.png" alt="Game Over" /></div>}
          {i   > 0 &&
            times(i, (j) =>
              <div key={`bunny${i}${j}`}><img className="bunny" src="img/bunny.png" alt={`Life #${j + 1}`} /></div>
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
                <img className="star" src="img/star.png" alt={`Star #${j + 1}`} />
              </div>
            )
          }
          {i === 0 && <div><img key={"star-empty"} className="starEmpty" src="img/star_bw.png" alt="0 Stars" /></div>}
        </div>
      </div>
    </div>
  );
}

let levelSwipe:   ReactSwipe | null;
let livesSwipe:   ReactSwipe | null;
let playersSwipe: ReactSwipe | null;
let starsSwipe:   ReactSwipe | null;

function gameReducer(oldGame: Game, change: Partial<Game>) {
  //console.log("gameUpdate", change);
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
    //console.log(JSON.stringify(newGame));
  }
  return newGame;
}

function reactSwipe(args: SwipeArgs) {
  const { leftButton, rightButton } = args;
  return (
    <>
      { leftButton && <button className="arrow left"  onClick={ leftButton}>&lt;</button>}
      {rightButton && <button className="arrow right" onClick={rightButton}>&gt;</button>}
      <ReactSwipe
        ref={args.ref}
        childCount={args.panes.length}
        className={args.className || ""}
        swipeOptions={{
          continuous: false,
          startSlide: args.startSlide,
          callback: () => false && body.classList.add("inert"),
          transitionEnd: args.transitionEnd,
        }}
      >
        {args.panes}
      </ReactSwipe>
    </>
  );
}

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
  React.useEffect(() => {
    localStorage.setItem("mind", JSON.stringify(game));
    //document.body.classList.remove("inert");
  }, [game]);

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
          {reactSwipe({
            ref: reactSwipe => (playersSwipe = reactSwipe),
            panes: renderPlayers(),
            startSlide: players - 2,
            transitionEnd: (num: number) => setPlayers(num + 2 as Players),
            leftButton:  players > 2 && (() => playersSwipe?.prev()),
            rightButton: players < 4 && (() => playersSwipe?.next()),
          })}
          <div id="playerCountSubtitle" className="subtitle">Levels 1 - {maxLevel}</div>
          <div id="isExtreme">
            <label>
              <input type="checkbox" checked={extreme} onChange={() => setExtreme(!extreme)} />
              <span className={clsx("x", !extreme && "off")}>x</span> Extreme
            </label>
          </div>
          {/* className={clsx(state === PRE && "visible")} */}
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
          {reactSwipe({
            ref: reactSwipe => (levelSwipe = reactSwipe),
            panes: renderLevel(players),
            startSlide: level - 1,
            transitionEnd: (num: number) => setLevel(num + 1 as Level),
            leftButton:  state === ACTIVE && level > 1         && (() => levelSwipe?.prev()),
            rightButton: state === ACTIVE && level <= maxLevel && (() => levelSwipe?.next()),
          })}
          <div id="levelSwipeSubtitle" className={clsx(state !== ACTIVE && "hidden")}>
            <div>{level === maxLevel && <>Final Level!</>}</div>
            <div>Deal {numWord(level)} To Each Player</div>
          </div>
        </div>

        <div id="livesSwipeWrap" className="reactSwipeWrap">
          {/*className={`livesSwipe ${state !== ACTIVE && "inactive"}`}*/}
          {reactSwipe({
            ref: reactSwipe => (livesSwipe = reactSwipe),
            panes: renderLives(lives, level, players),
            startSlide: lives,
            transitionEnd: (num: number) => setLives(num as Lives),
            leftButton:  state === ACTIVE && (() => livesSwipe?.prev()),
            rightButton: lives < maxLives && (() => livesSwipe?.next()),
          })}
          <div className="label">
            {lives === 0 && <span>GAME OVER</span>}
            {lives   > 0 && <span>Lives {lives} / {maxLives}</span>}
          </div>
        </div>

        <div id="starsSwipeWrap" className="reactSwipeWrap">
          {reactSwipe({
            ref: reactSwipe => (starsSwipe = reactSwipe),
            panes: renderStars(level, stars),
            startSlide: stars,
            transitionEnd: (num: number) => setStars(num as Stars),
            className: clsx(state !== ACTIVE && "hidden"),
            leftButton:  state === ACTIVE && stars > 0        && (() => starsSwipe?.prev()),
            rightButton: state === ACTIVE && stars < maxStars && (() => starsSwipe?.next()),
          })}
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
