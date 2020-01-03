import Rules from "../Rules";

const INIT_STATE = {
  playerCount: 2,
  level: 1,
  lives: 2,
  stars: 1,
  gameState: Rules.PRE, // pre, active, win, loss
  // gameState: 'active', // pre, active, win, loss
}

const STORAGE_STATE = JSON.parse(localStorage.getItem("mind", "false"));

const mindReducer = (state = STORAGE_STATE || INIT_STATE, action) => {
  const { payload } = action;
  switch(action.type) {
    case 'SET_HELP_VISIBLE':
      return Object.assign({}, state, {
        helpVisible: payload.helpVisible,
      });
    case 'SET_PLAYER_COUNT':
      return Object.assign({}, state, {
        playerCount: payload.playerCount,
        lives:       payload.playerCount,
      })
    case 'SET_LEVEL':
      return Object.assign({}, state, {
        level: payload.level,
        gameState: payload.level > (16 - (state.playerCount * 2)) // TODO: access maxLevel in scope
          ? Rules.WIN
          : Rules.ACTIVE
      });
    case 'SET_LIVES':
      return Object.assign({}, state, {
        lives: payload.lives,
        gameState: payload.lives > 0 && state.gameState !== Rules.WIN
          ? Rules.ACTIVE
          : Rules.LOSS
      })
    case 'SET_STARS':
      return Object.assign({}, state, {
        stars: payload.stars
      });
    case 'SET_GAME_STATE':
      // Reset to new game if requested
      const baseState = state.gameState !== Rules.PRE && payload.gameState === Rules.PRE
        ? INIT_STATE
        : state;
      return Object.assign({}, baseState, {
        gameState: payload.gameState
      });
    default:
      return state
  }
}

export default mindReducer;
