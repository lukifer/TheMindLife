export const setGameState = (gameState) => dispatch => {
  dispatch({
    type: 'SET_GAME_STATE',
    payload: { 'gameState': gameState },
  })
}
