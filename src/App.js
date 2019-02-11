import React, { Component } from 'react';
import { connect }          from 'react-redux';
import ReactSwipe           from 'react-swipe';
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

  maxLevel() {
    switch(this.props.playerCount) {
      case 4:  return 8;
      case 3:  return 10;
      case 2:  return 12;
      default: return 12;
    }
  }

  maxLives(level) {
    const gainLivesAtLevel = [3, 6, 9];
    const curLevel = level || this.props.mind.level;

    const result = gainLivesAtLevel.reduce((lives, lvl) => {
      if(curLevel >= lvl) return lives + 1;
      return lives;
    }, this.props.playerCount || 2); // begin with 1 life per player

    //return Math.max(result, this.props.mind.lives);
    return result;
  }

  maxStars(level) {
    const gainStarsAtLevel = [2, 5, 8];
    const curLevel = level || this.props.mind.level;

    const result = gainStarsAtLevel.reduce((stars, lvl) => {
      if(curLevel >= lvl) return stars + 1;
      return stars;
    }, 1);

    return result;
  }

  levelPanes() {
    const curLevel = this.props.level || 1;
    const maxLevel = this.maxLevel();
    const numSlides = maxLevel - curLevel - - 2;

    return Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={"level"+i}>
          <div className="row level">
            <div>
              {/* Level {`${i+curLevel}`} {i - - curLevel} {maxLevel} */}
              {i - - curLevel <= maxLevel && <span>Level {`${i+curLevel}`}</span>}
              {i - - curLevel > maxLevel && <span>VICTORY</span>}
            </div>
          </div>
        </div>
      );
    });
  }

  livesPanes() {
    // We allow lives to extend beyond the max, to keep the downgraded cell rendered while reverting levels
    let numSlides = Math.max(this.maxLives() - - 1 || 0, this.props.mind.lives);

    let slides = Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={"lives"+i}>
          <div className="row lives">
            <div className="images">
              {i === 0 && <img key={"bunny-dead"} className="bunny bunnyDead" src="/img/bunny-dead.png" alt="Game Over" />}
              {i   > 0 &&
                Array.apply(null, Array(i)).map((_, j) => {
                  return ( <img key={"bunny"+i+j} className="bunny" src="/img/bunny.png" alt={"Life #"+(j - -1)} /> );
                })
              }
            </div>
            <div className="label">
              {i === 0 && <span className="label">GAME OVER</span>}
              {i   > 0 && <span className="label">Lives {`${i}`}  / {this.maxLives()}</span>}
            </div>
          </div>
        </div>
      );
    });

    return slides;
  }

  starsPanes() {
    let numSlides = Math.max(this.maxStars() - - 1 || 0, this.props.mind.stars);
    return Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={"stars"+i}>
          <div className="row stars">
            <div className="images">
              {
                i > 0 && Array.apply(null, Array(i)).map((_, j) => {
                  return ( <img key={"star"+i+j} className="star" src="/img/star.png" alt={"Star #"+(j - -1)} /> );
                })
              }
              {i === 0 && <img key={"star-empty"} className="starEmpty" src="/img/star_bw.png" alt="0 Stars" /> }
            </div>
            <div className="label">Stars {i} / {this.maxStars()}</div>
          </div>
        </div>
      );
    });
  }

  playerCountPanes() {
    const countArray = [2, 3, 4];
    return countArray.map((num, i) => {
      return (
        <div key={"playerCount"+i}>
          <div className="row playerCount">
            <div className="images">
              {
                Array.apply(null, Array(num)).map((_, j) => {
                  return ( <img key={"brain"+i+j} className="brain" src="/img/brain.jpg" alt={"Brain #"+(j - -1)} /> );
                })
              }
            </div>
            <div className="label">{`${num}`} Players</div>
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
      if(this.maxLives(prev.level) < this.maxLives(curr.level)) {
        var newLivesPos = this.livesSwipe.getPos() - - 1;

        // FIXME: Timing bug
        const self = this;
        setTimeout(function() {
          self.livesSwipe.slide(newLivesPos, SLIDE_SPEED);
        }, 0);
      }

      else if(this.maxStars(prev.level) < this.maxStars(curr.level)) {
        var newStarsPos = this.starsSwipe.getPos() - - 1;

        // FIXME: Timing bug
        const self = this;
        setTimeout(function() {
          self.starsSwipe.slide(newStarsPos, SLIDE_SPEED);
        }, 0);
      }
    }
  }

  render() {
    return (
      <div className="App">
        <pre>{ JSON.stringify(this.props) }</pre>

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
            <button
              id="startButton"
              onClick={(x) => this.props.setGameState("active")}
              className={this.props.mind.gameState === "pre" ? "visible" : ""}
            >
              <span>Start Game</span>
            </button>
          </div>
        </div>
        {/* end #preWrap */}

        <div id="activeWrap" className={this.props.mind.gameState === "pre" ? "hidden" : ""}>

          <div id="playerCountDisplay">{this.props.mind.playerCount} Players</div>

          <div id="levelSwipeWrap" className="reactSwipeWrap">
            <ReactSwipe
              ref={reactSwipe => (this.levelSwipe = reactSwipe)}
              childCount={this.levelPanes().length}
              className="levelSwipe"
              swipeOptions={{
                continuous: false,
                startSlide: this.props.mind.level - 1,
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  if(num - - 1 > this.maxLevel()) {
                    this.props.setGameState("win");
                    //fireworks.start();
                  } else {
                    this.props.setLevel(num - - 1);
                  }
                },
              }}
            >
              {this.levelPanes()}
            </ReactSwipe>
          </div>
          {/* end #levelSwipeWrap */}

          <div id="livesSwipeWrap" className="reactSwipeWrap">
            <ReactSwipe
              ref={reactSwipe => (this.livesSwipe = reactSwipe)}
              childCount={this.livesPanes().length}
              className="livesSwipe"
              swipeOptions={{
                continuous: false,
                startSlide: this.props.mind.lives, //Math.min(this.props.mind.lives, this.maxLives()),
                callback: (num, div) => {},
                swiping: (fraction) => {},
                transitionEnd: (num, div) => {
                  this.props.setLives(num);
                }
              }}
            >
              {this.livesPanes()}
            </ReactSwipe>
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

            <button
              id="newGameButton"
              onClick={(x) => this.props.setGameState("pre")}
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
