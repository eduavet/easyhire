import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/emailsReducer';

const store = createStore(
    reducer,
    applyMiddleware(
        thunk
    )
);
store.subscribe(() => {
    console.log('Store has been changed');
    console.log(store.getState());
});
export default store;