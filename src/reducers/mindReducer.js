const INIT_STATE = {
  playerCount: 2,
  level: 1,
  lives: 2,
  stars: 1,
  gameState: 'pre', // pre, active, win
//  gameState: 'active', // pre, active, win
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
      });
    case 'SET_LIVES':
      return Object.assign({}, state, {
        lives: action.payload.lives
      })
    case 'SET_STARS':
      return Object.assign({}, state, {
        stars: action.payload.stars
      });
    case 'SET_GAME_STATE':
      return Object.assign({}, state, {
        gameState: action.payload.gameState
      });
    default:
      return state
  }
}
