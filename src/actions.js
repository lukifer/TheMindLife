export const setGameState = (gameState) => dispatch => {
  dispatch({
    type: 'SET_GAME_STATE',
    payload: { 'gameState': gameState },
  })
}

export const setHelpVisible = (helpVisible) => dispatch => {
  // console.log("setHelpVisible", helpVisible);
  dispatch({
    type: 'SET_HELP_VISIBLE',
    payload: { 'helpVisible': helpVisible },
  })
}

export const setLevel = (level) => dispatch => {
  dispatch({
    type: 'SET_LEVEL',
    payload: { 'level': level },
  })
}

export const setLives = (lives) => dispatch => {
  dispatch({
    type: 'SET_LIVES',
    payload: { 'lives': lives },
  })
}

export const setPlayerCount = (playerCount) => dispatch => {
  dispatch({
    type: 'SET_PLAYER_COUNT',
    payload: { 'playerCount': playerCount },
  })
}

export const setStars = (stars) => dispatch => {
  dispatch({
    type: 'SET_STARS',
    payload: { 'stars': stars },
  })
}
