export const setLevel = (level) => dispatch => {
  dispatch({
    type: 'SET_LEVEL',
    payload: { 'level': level },
  })
}
