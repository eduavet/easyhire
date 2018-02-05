import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import emailsReducer from './reducers/emailsReducer';
import folderReducer from './reducers/folderReducer';
import emailReducer from './reducers/emailReducer';

const store = createStore(
  combineReducers({ emails: emailsReducer, folders: folderReducer, email: emailReducer }),
  applyMiddleware(thunk),
);
store.subscribe(() => {
  console.log('Store has been changed');
  console.log(store.getState());
});
export default store;
