export const setLives = (lives) => dispatch => {
  dispatch({
    type: 'SET_LIVES',
    payload: { 'lives': lives },
  })
}
