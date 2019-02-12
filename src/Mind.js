// Lightweight wrapper class for game logic

const STARTING_STARS = 1;
const GAIN_LIVES_AT_LEVEL = [3, 6, 9];
const GAIN_STARS_AT_LEVEL = [2, 5, 8];

//export default class Mind {
class Mind {

  maxLevel(playerCount) {
    switch(playerCount) {
      case 4:  return 8;
      case 3:  return 10;
      case 2:  return 12;
      default: return 12;
    }
  }

  startingLives(playerCount) {
    return playerCount; // begin with 1 life per player
  }

  maxLives(playerCount, curLevel) {
    return this.startingLives(playerCount) - - this.extraLives(curLevel);
  }

  extraLives(curLevel) {
    return GAIN_LIVES_AT_LEVEL.reduce((lives, lvl) => {
      if(curLevel >= lvl) return lives + 1;
      return lives;
    }, 0);
  }

  maxStars(curLevel) {
    return GAIN_STARS_AT_LEVEL.reduce((stars, lvl) => {
      if(curLevel >= lvl) return stars + 1;
      return stars;
    }, STARTING_STARS);
  }
}

export default new Mind();

//export default connect(mapStateToProps, mapDispatchToProps)(App);
