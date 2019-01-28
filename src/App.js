import React, { Component } from 'react';
import { connect }          from 'react-redux';
import ReactSwipe           from 'react-swipe';

import { setLevel }       from './actions/setLevel'
import { setLives }       from './actions/setLives'
import { setStars }       from './actions/setStars'
import { setPlayerCount } from './actions/setPlayerCount'

import './App.css';

const imageStyles = {
  margin:     "0 auto",
  width:      "100%",
  height:     "200px",
  fontSize:   "2em",
  color:      0,
  textAlign:  "center",
  background: "blue",
  border:     "2px solid red"
};

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  setLevel:       (level)       => dispatch(setLevel(level)),
  setLives:       (lives)       => dispatch(setLives(lives)),
  setStars:       (stars)       => dispatch(setStars(stars)),
  setPlayerCount: (playerCount) => dispatch(setPlayerCount(playerCount)),
})

class App extends Component {

  // constructor() {
  //   super()
  // }

  maxLevel() {
    switch(this.props.playerCount) {
      case 4:  return 12;
      case 3:  return 10;
      case 2:  return 8;
      default: return 8;
    }
  }

  levelPanes() {
    let numSlides = this.maxLevel();
    return Array.apply(null, Array(numSlides)).map((_, i) => {
      return (
        <div key={i}>
          <div className="item">
            <div
              style={imageStyles}
            >
              Level {`${i+1}`} <span style={{display:'none'}}>{`${this.props.mind.level}`}</span>
            </div>
          </div>
        </div>
      );
    });
  }

  playerCountPanes() {
    const countArray = [2, 3, 4];
    return countArray.map((num, i) => {
      return (
        <div key={i}>
          <div className="item">
            <div style={imageStyles}>
              {`${num}`} Players
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <pre>{ JSON.stringify(this.props) }</pre>
        <ReactSwipe
          ref={reactSwipe => (this.playerCountSwipe = reactSwipe)}
          className="playerCountSwipe"
          swipeOptions={{
            startSlide: this.props.mind.playerCount - 2,
            transitionEnd: (num, div) => this.props.setPlayerCount(num - - 2)
          }}
        >
          {this.playerCountPanes()}
        </ReactSwipe>
        <ReactSwipe
          ref={reactSwipe => (this.levelSwipe = reactSwipe)}
          className="levelSwipe"
          swipeOptions={{
            startSlide: this.props.mind.level - 1,
			callback: (num, div) => {}
			swiping: (fraction) => {}
            transitionEnd: (num, div) => this.props.setLevel(num - - 1)
          }}
        >
          {this.levelPanes()}
        </ReactSwipe>
        <button onClick={this.setLevelClicked}>Test redux action</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
