import { combineReducers } from 'redux';
import user from './user';
import patient from './patients'

const rootReducer = combineReducers({
    user,
    patient
});

export default rootReducer;