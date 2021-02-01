import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import rootReducer from '../reducers';

const configureStore = () => {
    const enhancer = compose(applyMiddleware(thunk));

    const store = createStore(rootReducer, enhancer);
    persistStore(store);

    return store;
};

const store = configureStore();

export default store;