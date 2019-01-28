import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

const INIT_STATE = {
  playerCount: 2,
  level: 1,
  lives: 2,
  stars: 1,
}

export default function configureStore(initialState=INIT_STATE) {
  return createStore(
    rootReducer,
    applyMiddleware(thunk)
  );
}
