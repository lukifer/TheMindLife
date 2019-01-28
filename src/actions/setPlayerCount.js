export const setPlayerCount = (playerCount) => dispatch => {
  dispatch({
    type: 'SET_PLAYER_COUNT',
    payload: { 'playerCount': playerCount },
  })
}
