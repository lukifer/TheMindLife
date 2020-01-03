// Lightweight wrapper class for game logic

const STARTING_STARS = 1;
const GAIN_LIVES_AT_LEVEL = [3, 6, 9];
const GAIN_STARS_AT_LEVEL = [2, 5, 8];

class Rules {

  ACTIVE = "active";
  PRE = "pre";
  WIN = "win";
  LOSS = "loss";

  numWord(val) {
    switch(val) {
      case 12: return "Twelve";
      case 11: return "Eleven";
      case 10: return "Ten";
      case 9:  return "Nine";
      case 8:  return "Eight";
      case 7:  return "Seven";
      case 6:  return "Six";
      case 5:  return "Five";
      case 4:  return "Four";
      case 3:  return "Three";
      case 2:  return "Two";
      case 1:  return "One";
      default: return "";
    }
  }

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

export default new Rules();

//export default connect(mapStateToProps, mapDispatchToProps)(App);
