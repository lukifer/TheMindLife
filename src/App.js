import React, { Component } from 'react';
import { connect }          from 'react-redux';
import ReactSwipe           from 'react-swipe';
import Rules                from './Rules';
import fireworks            from './fireworks';

import {
  setGameState,
  setHelpVisible,
  setLevel,
  setLives,
  setPlayerCount,
  setStars,
} from './actions'

import './App.css';

const SLIDE_SPEED = 500;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  setGameState:   (gameState)   => dispatch(setGameState(gameState)),
  setHelpVisible: (helpVisible) => dispatch(setHelpVisible(helpVisible)),
  setLevel:       (level)       => dispatch(setLevel(level)),
  setLives:       (lives)       => dispatch(setLives(lives)),
  setPlayerCount: (playerCount) => dispatch(setPlayerCount(playerCount)),
  setStars:       (stars)       => dispatch(setStars(stars)),
})

const times = (n, fn) => {
  return Array.apply(null, Array(n)).map((_, i) => fn(i));
}

class App extends Component {

  playerCountPanes() {
    return [2, 3, 4].map((num, i) => {
      return (
        <div key={`playerCount${i}`}>
          <div className="row playerCount">
            {/*
            <div className="images">
              {
                times(num, (j) =>
                  <img key={"brain"+i+j} className="brain" src="img/brain.png" alt={"Brain #"+(j - -1)} /> );
                )
              }
            </div>
            */}
            <div className="label">{num} Players</div>
          </div>
        </div>
      );
    });
  }

  levelPanes() {
    const { playerCount } = this.props.mind;
    const maxLevel = Rules.maxLevel(playerCount);
    const numSlides = maxLevel - - 1; // Add a final slide for victory condition

    return times(numSlides, (i) =>
      <div key={`level${i}`}>
        <div className="row level">
          <div className="label">
            {i - - 1  <= maxLevel && <span>Level {i - - 1}</span>}
            {i       === maxLevel && <span>YOU WIN!</span>}
          </div>
        </div>
      </div>
    );
  }

  livesPanes() {
    // We allow lives to extend beyond the max, to keep the downgraded cell rendered while reverting levels
    const { lives, level, playerCount } = this.props.mind;
    const maxLives = Rules.maxLives(playerCount, level) || 0;
    const numSlides = Math.max(maxLives, lives) - - 1;

    return times(numSlides, (i) =>
      <div key={`lives${i}`}>
        <div className="row lives">
          <div className="images" style={{ maxWidth: `${i*90}px` }}>
            {i === 0 && <div><img key="bunny-dead" className="bunny bunnyDead" src="img/bunny-dead.png" alt="Game Over" /></div>}
            {i   > 0 &&
              times(i, (j) =>
                <div key={`bunny${i}${j}`}><img className="bunny" src="img/bunny.png" alt={`Life #${j - -1}`} /></div>
              )
            }
          </div>
          {/*<div className="label">
            {i === 0 && <span className="label">GAME OVER</span>}
            {i   > 0 && <span className="label">Lives {`${i}`}  / {maxLives}</span>}
          </div>*/}
        </div>
      </div>
    );
  }

  starsPanes() {
    const { level, stars } = this.props.mind;

    const maxStars = Rules.maxStars(level) || 0;
    const numSlides = Math.max(maxStars, stars) - - 1;

    return times(numSlides, (i) =>
      <div key={`stars${i}`}>
        <div className="row stars">
          <div className="images" style={{ maxWidth: `${i*90}px` }}>
            {
              i > 0 && times(i, (j) =>
                <div key={`star${i}${j}`}><img className="star" src="img/star.png" alt={`Star #${j - -1}`} /></div>
              )
            }
            {i === 0 && <div><img key={"star-empty"} className="starEmpty" src="img/star_bw.png" alt="0 Stars" /></div> }
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prev = prevProps.mind;
    const curr = this.props.mind;

    // If our level changed, we may need to increase lives or stars
    if(prev.level !== curr.level) {
      const prevMaxLives = Rules.maxLives(prev.playerCount, prev.level);
      const currMaxLives = Rules.maxLives(curr.playerCount, curr.level);

      if(prevMaxLives !== currMaxLives) {
        const diffLives = prevMaxLives - currMaxLives;
        const newLivesPos = this.livesSwipe.getPos() - diffLives;

        // FIXME: Timing bug
        const self = this;
        setTimeout(function() {
          // we allow undoing level gains, but loss can only be triggered by direct user action
          if(newLivesPos > 0 && curr.gameState === Rules.ACTIVE) {
            self.livesSwipe.slide(newLivesPos, SLIDE_SPEED);
          }
        }, 0);
      }

      else {
        const prevMaxStars = Rules.maxStars(prev.level);
        const currMaxStars = Rules.maxStars(curr.level);

        if(prevMaxStars !== currMaxStars) {
          const diffStars = prevMaxStars - currMaxStars;
          var newStarsPos = this.starsSwipe.getPos() - diffStars;

          // FIXME: Timing bug
          const self = this;
          setTimeout(function() {
            self.starsSwipe.slide(newStarsPos, SLIDE_SPEED);
          }, 0);
        }
      }
    }

    // Start or stop fireworks if win state changed
    if(prev.gameState !== curr.gameState) {
      if(prev.gameState === Rules.WIN) {
        fireworks.stop();
      } else if(curr.gameState === Rules.WIN) {
        fireworks.start();
      }
    }

    localStorage.setItem("mind", JSON.stringify(curr));
  }

  render() {
    const { props } = this;
    const { setGameState, setHelpVisible, setLevel, setLives, setPlayerCount, setStars } = props;
    const { gameState, helpVisible, level, lives, playerCount, stars } = props.mind;
    const maxLevel = Rules.maxLevel(playerCount);
    const maxLives = Rules.maxLives(playerCount, level);
    const maxStars = Rules.maxStars(level);
    const playerCountPanes = this.playerCountPanes();
    const levelPanes       = this.levelPanes();
    const livesPanes       = this.livesPanes();
    const starsPanes       = this.starsPanes();
    return (
      <div className="App">
        {/* Uncomment to debug */}
        {/*
          <pre>{ JSON.stringify(this.props) }</pre>
          className="visible"
        */}

        <button
          id="helpButton"
          className={gameState === Rules.PRE ? "visible" : ""}
          onClick={(e) => setHelpVisible(true)}
        ><span>?</span></button>
        <div
          id="helpOverlay"
          className={helpVisible ? "visible" : ""}
          onClick={(e) => setHelpVisible(false)}
        ></div>

        <div id="preWrap" className={gameState === Rules.PRE ? "" : "hidden"}>
          <div id="playerCountSwipeWrap" className="reactSwipeWrap">
            {playerCount > 2 && <button className="arrow left"  onClick={(e) => {this.playerCountSwipe.prev()}}>&lt;</button>}
            {playerCount < 4 && <button className="arrow right" onClick={(e) => {this.playerCountSwipe.next()}}>&gt;</button>}
            <ReactSwipe
              ref={reactSwipe => (this.playerCountSwipe = reactSwipe)}
              childCount={playerCountPanes.length}
              className="playerCountSwipe"
              swipeOptions={{
                continuous: false,
                startSlide: playerCount - 2,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => setPlayerCount(num - - 2)
              }}
            >
              {playerCountPanes}
            </ReactSwipe>
            <div id="playerCountSubtitle" className="subtitle">Levels 1 - {Rules.maxLevel(playerCount)}</div>
            <button
              id="startButton"
              onClick={(e) => setGameState(Rules.ACTIVE)}
              className={gameState === Rules.PRE ? "visible" : ""}
            >
              <span>Start Game</span>
            </button>
          </div>
        </div>
        {/* end #preWrap */}

        <div id="activeWrap" className={gameState === Rules.PRE ? "hidden" : ""}>

          {/*<div id="playerCountDisplay">{Rules.numWord(playerCount)} Players</div>*/}

          <div id="levelSwipeWrap" className="reactSwipeWrap">
            {gameState === Rules.ACTIVE && level > 1        && <button className="arrow left"  onClick={(e) => {this.levelSwipe.prev()}}>&lt;</button>}
            {gameState === Rules.ACTIVE && level < maxLevel && <button className="arrow right" onClick={(e) => {this.levelSwipe.next()}}>&gt;</button>}
            <ReactSwipe
              ref={reactSwipe => (this.levelSwipe = reactSwipe)}
              childCount={levelPanes.length}
              className="levelSwipe"
              swipeOptions={{
                continuous: false,
                startSlide:
                  gameState === Rules.WIN
                  ? level
                  : level - 1,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  const maxLevel = Rules.maxLevel(playerCount);
                  if(num - - 1 > maxLevel) {
                    setGameState(Rules.WIN);
                  } else if(gameState === Rules.WIN && num < maxLevel) {
                      setGameState(Rules.ACTIVE)
                  } else {
                    setLevel(num - - 1);
                  }
                },
              }}
            >
              {levelPanes}
            </ReactSwipe>
            {/*<div id="levelSwipeSubtitle" className="subtitle">{playerCount}P: Levels 1-{Rules.maxLevel(playerCount)}</div>*/}
            <div id="levelSwipeSubtitle" className={gameState === Rules.ACTIVE ? "subtitle" : "hidden"}>
              {level === maxLevel && <div>Final Level!</div>}Deal {Rules.numWord(level)} To Each Player
            </div>
          </div>
          {/* end #levelSwipeWrap */}

          <div id="livesSwipeWrap" className="reactSwipeWrap">
            {gameState === Rules.ACTIVE && <button className="arrow left"  onClick={(e) => {this.livesSwipe.prev()}}>&lt;</button>}
            {lives < maxLives           && <button className="arrow right" onClick={(e) => {this.livesSwipe.next()}}>&gt;</button>}
            <ReactSwipe
              ref={reactSwipe => (this.livesSwipe = reactSwipe)}
              childCount={livesPanes.length}
              className={gameState === Rules.ACTIVE ? "livesSwipe" : "livesSwipe inactive"}
              swipeOptions={{
                continuous: false,
                startSlide: lives,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  setLives(num);
                }
              }}
            >
              {livesPanes}
            </ReactSwipe>
            <div className="label">
              {lives === 0 && <span>GAME OVER</span>}
              {lives   > 0 && <span>Lives {lives} / {maxLives}</span>}
            </div>
          </div>
          {/* end #livesSwipeWrap */}

          <div id="starsSwipeWrap" className="reactSwipeWrap">
          {gameState === Rules.ACTIVE && stars > 0        && <button className="arrow left"  onClick={(e) => {this.starsSwipe.prev()}}>&lt;</button>}
          {gameState === Rules.ACTIVE && stars < maxStars && <button className="arrow right" onClick={(e) => {this.starsSwipe.next()}}>&gt;</button>}
            <ReactSwipe
              ref={reactSwipe => (this.starsSwipe = reactSwipe)}
              childCount={starsPanes.length}
              className={gameState === Rules.ACTIVE ? "starsSwipe" : "starsSwipe hidden"}
              swipeOptions={{
                continuous: false,
                startSlide: stars,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  setStars(num);
                },
              }}
            >
              {starsPanes}
            </ReactSwipe>
            <div className={gameState === Rules.ACTIVE ? "label" : "hidden"}>Stars {stars} / {maxStars}</div>

            <button
              id="newGameButton"
              onClick={(e) => setGameState(Rules.PRE)}
              className={gameState === Rules.WIN || gameState === Rules.LOSS ? "" : "hidden"}
            >
              <span>New Game</span>
            </button>

          </div>
          {/* end #starsSwipeWrap */}

        </div>
        {/* end #activeWrap */}

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
