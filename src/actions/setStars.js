export const setStars = (stars) => dispatch => {
  dispatch({
    type: 'SET_STARS',
    payload: { 'stars': stars },
  })
}
