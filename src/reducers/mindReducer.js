const INIT_STATE = {
  playerCount: 2,
  level: 1,
  lives: 2,
  stars: 1,
  gameState: 'pre', // pre, active, win, loss
  // gameState: 'active', // pre, active, win, loss
}

export default (state = INIT_STATE, action) => {
  switch(action.type) {
    case 'SET_PLAYER_COUNT':
      return Object.assign({}, state, {
        playerCount: action.payload.playerCount
      })
    case 'SET_LEVEL':
      return Object.assign({}, state, {
        level: action.payload.level,
        gameState: action.payload.level > (16 - (state.playerCount * 2)) // TODO: access maxLevel in scope
          ? "win"
          : "active"
      });
    case 'SET_LIVES':
      return Object.assign({}, state, {
        lives: action.payload.lives,
        gameState: action.payload.lives > 0 && state.gameState !== "win"
          ? "active"
          : "loss"
      })
    case 'SET_STARS':
      return Object.assign({}, state, {
        stars: action.payload.stars
      });
    case 'SET_GAME_STATE':
      // Reset to new game if requested
      const baseState = state.gameState !== "pre" && action.payload.gameState === "pre"
        ? INIT_STATE
        : state;
      return Object.assign({}, baseState, {
        gameState: action.payload.gameState
      });
    default:
      return state
  }
}
