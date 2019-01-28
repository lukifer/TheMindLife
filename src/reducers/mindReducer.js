export default (state = {}, action) => {
  switch(action.type) {
    case 'SET_PLAYER_COUNT':
      return Object.assign({}, state, {
        playerCount: action.payload.playerCount
      })
    case 'SET_LEVEL':
      return Object.assign({}, state, {
        level: action.payload.level
      });
    case 'SET_LIVES':
      return Object.assign({}, state, {
        lives: action.payload.lives
      })
    case 'SET_STARS':
      return Object.assign({}, state, {
        stars: action.payload.stars
      });
    default:
      return state
  }
}
