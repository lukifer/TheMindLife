import React, { Component } from 'react';
import { connect }          from 'react-redux';
import ReactSwipe           from 'react-swipe';
import Mind                 from './Mind';
import fireworks            from './fireworks';

import { setLevel }       from './actions/setLevel'
import { setLives }       from './actions/setLives'
import { setStars }       from './actions/setStars'
import { setPlayerCount } from './actions/setPlayerCount'
import { setGameState }   from './actions/setGameState'

import './App.css';

const SLIDE_SPEED = 500;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  setLevel:       (level)       => dispatch(setLevel(level)),
  setLives:       (lives)       => dispatch(setLives(lives)),
  setStars:       (stars)       => dispatch(setStars(stars)),
  setPlayerCount: (playerCount) => dispatch(setPlayerCount(playerCount)),
  setGameState:   (gameState)   => dispatch(setGameState(gameState)),
})

class App extends Component {

  // constructor() {
  //   super()
  // }

  playerCountPanes() {
    const countArray = [2, 3, 4];
    return countArray.map((num, i) => {
      return (
        <div key={"playerCount"+i}>
          <div className="row playerCount">
            {/*
            <div className="images">
              {
                Array.apply(null, Array(num)).map((_, j) => {
                  return ( <img key={"brain"+i+j} className="brain" src="img/brain.png" alt={"Brain #"+(j - -1)} /> );
                })
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
    const maxLevel = Mind.maxLevel(this.props.mind.playerCount);
    const numSlides = maxLevel - - 1; // Add a final slide for victory condition

    return Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={"level"+i}>
          <div className="row level">
            <div className="label">
              {/* {i - - 1} {maxLevel} {i - - 1 <= maxLevel} */}
              {i - - 1  <= maxLevel && <span>Level {i - - 1}</span>}
              {i       === maxLevel && <span>YOU WIN!</span>}
            </div>
          </div>
        </div>
      );
    });
  }

  livesPanes() {
    // We allow lives to extend beyond the max, to keep the downgraded cell rendered while reverting levels
    const maxLives = Mind.maxLives(this.props.mind.playerCount, this.props.mind.level) || 0;
    const numSlides = Math.max(maxLives, this.props.mind.lives) - - 1;

    let slides = Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={"lives"+i}>
          <div className="row lives">
            <div className="images" style={{ maxWidth: (i*90)+"px" }}>
              {i === 0 && <div><img key={"bunny-dead"} className="bunny bunnyDead" src="img/bunny-dead.png" alt="Game Over" /></div>}
              {i   > 0 &&
                Array.apply(null, Array(i)).map((_, j) => {
                  return ( <div key={"bunny"+i+j}><img className="bunny" src="img/bunny.png" alt={"Life #"+(j - -1)} /></div> );
                })
              }
            </div>
            {/*<div className="label">
              {i === 0 && <span className="label">GAME OVER</span>}
              {i   > 0 && <span className="label">Lives {`${i}`}  / {maxLives}</span>}
            </div>*/}
          </div>
        </div>
      );
    });

    return slides;
  }

  starsPanes() {
    let numSlides = Math.max(Mind.maxStars(this.props.mind.level) - - 1 || 0, this.props.mind.stars);
    return Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={"stars"+i}>
          <div className="row stars">
            <div className="images" style={{ maxWidth: (i*90)+"px" }}>
              {
                i > 0 && Array.apply(null, Array(i)).map((_, j) => {
                  return ( <div key={"star"+i+j}><img className="star" src="img/star.png" alt={"Star #"+(j - -1)} /></div> );
                })
              }
              {i === 0 && <div><img key={"star-empty"} className="starEmpty" src="img/star_bw.png" alt="0 Stars" /></div> }
            </div>
            {/*<div className="label">Stars {i} / {Mind.maxStars(this.props.mind.level)}</div>*/}
          </div>
        </div>
      );
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prev = prevProps.mind;
    const curr = this.props.mind;

    // If our level changed, we may need to increase lives or stars
    if(prev.level !== curr.level) {
      const prevMaxLives = Mind.maxLives(prev.playerCount, prev.level);
      const currMaxLives = Mind.maxLives(curr.playerCount, curr.level);

      if(prevMaxLives !== currMaxLives) {
        const diffLives = prevMaxLives - currMaxLives;
        const newLivesPos = this.livesSwipe.getPos() - diffLives;

        // FIXME: Timing bug
        const self = this;
        setTimeout(function() {
          // we allow undoing level gains, but loss can only be triggered by direct user action
          if(newLivesPos > 0 && curr.gameState === "active") {
            self.livesSwipe.slide(newLivesPos, SLIDE_SPEED);
          }
        }, 0);
      }

      else {
        const prevMaxStars = Mind.maxStars(prev.level);
        const currMaxStars = Mind.maxStars(curr.level);

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
      if(prev.gameState === "win") {
        fireworks.stop();
      } else if(curr.gameState === "win") {
        fireworks.start();
      }
    }

    localStorage.setItem("mind", JSON.stringify(curr));
  }

  render() {
    return (
      <div className="App">
        {/* Uncomment to debug */}
        {/*
          <pre>{ JSON.stringify(this.props) }</pre>
        */}

        <div id="preWrap" className={this.props.mind.gameState === "pre" ? "" : "hidden"}>
          <div id="playerCountSwipeWrap" className="reactSwipeWrap">
            <ReactSwipe
              ref={reactSwipe => (this.playerCountSwipe = reactSwipe)}
              childCount={this.playerCountPanes().length}
              className="playerCountSwipe"
              swipeOptions={{
                continuous: false,
                startSlide: this.props.mind.playerCount - 2,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => this.props.setPlayerCount(num - - 2)
              }}
            >
              {this.playerCountPanes()}
            </ReactSwipe>
            <div id="playerCountSubtitle" className="subtitle">Levels 1 - {Mind.maxLevel(this.props.mind.playerCount)}</div>
            <button
              id="startButton"
              onClick={(e) => this.props.setGameState("active")}
              className={this.props.mind.gameState === "pre" ? "visible" : ""}
            >
              <span>Start Game</span>
            </button>
          </div>
        </div>
        {/* end #preWrap */}

        <div id="activeWrap" className={this.props.mind.gameState === "pre" ? "hidden" : ""}>

          {/*<div id="playerCountDisplay">{Mind.numWord(this.props.mind.playerCount)} Players</div>*/}

          <div id="levelSwipeWrap" className="reactSwipeWrap">
            <ReactSwipe
              ref={reactSwipe => (this.levelSwipe = reactSwipe)}
              childCount={this.levelPanes().length}
              className="levelSwipe"
              swipeOptions={{
                continuous: false,
                startSlide:
                  this.props.mind.gameState === "win"
                  ? this.props.mind.level
                  : this.props.mind.level - 1,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  const maxLevel = Mind.maxLevel(this.props.mind.playerCount);
                  if(num - - 1 > maxLevel) {
                    this.props.setGameState("win");
                    // fireworks.start();
                  } else if(this.props.mind.gameState === "win" && num < maxLevel) {
                      this.props.setGameState("active")
                      // fireworks.stop();
                  } else {
                    this.props.setLevel(num - - 1);
                  }
                },
              }}
            >
              {this.levelPanes()}
            </ReactSwipe>
            {/*<div id="levelSwipeSubtitle" className="subtitle">{this.props.mind.playerCount}P: Levels 1-{Mind.maxLevel(this.props.mind.playerCount)}</div>*/}
            <div id="levelSwipeSubtitle" className={this.props.mind.gameState === "active" ? "subtitle" : "hidden"}>{this.props.mind.level === Mind.maxLevel(this.props.mind.playerCount) && <div>Final Level!</div>}Deal {Mind.numWord(this.props.mind.level)} To Each Player</div>
          </div>
          {/* end #levelSwipeWrap */}

          <div id="livesSwipeWrap" className="reactSwipeWrap">
            <ReactSwipe
              ref={reactSwipe => (this.livesSwipe = reactSwipe)}
              childCount={this.livesPanes().length}
              className={this.props.mind.gameState === "active" ? "livesSwipe" : "livesSwipe inactive"}
              swipeOptions={{
                continuous: false,
                startSlide: this.props.mind.lives,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  this.props.setLives(num);
                }
              }}
            >
              {this.livesPanes()}
            </ReactSwipe>
            <div className="label">
              {this.props.mind.lives === 0 && <span>GAME OVER</span>}
              {this.props.mind.lives   > 0 && <span>Lives {this.props.mind.lives}  / {Mind.maxLives(this.props.mind.playerCount, this.props.mind.level)}</span>}
            </div>
          </div>
          {/* end #livesSwipeWrap */}

          <div id="starsSwipeWrap" className="reactSwipeWrap">
            <ReactSwipe
              ref={reactSwipe => (this.starsSwipe = reactSwipe)}
              childCount={this.starsPanes().length}
              className={this.props.mind.gameState === "active" ? "starsSwipe" : "starsSwipe hidden"}
              swipeOptions={{
                continuous: false,
                startSlide: this.props.mind.stars,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  this.props.setStars(num);
                },
              }}
            >
              {this.starsPanes()}
            </ReactSwipe>
            <div className={this.props.mind.gameState === "active" ? "label" : "hidden"}>Stars {this.props.mind.stars} / {Mind.maxStars(this.props.mind.level)}</div>

            <button
              id="newGameButton"
              onClick={(e) => this.props.setGameState("pre")}
              className={this.props.mind.gameState === "win" || this.props.mind.gameState === "loss" ? "" : "hidden"}
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
