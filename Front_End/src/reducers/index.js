import { combineReducers } from 'redux';
import user from './user';
import patient from './patients'
import painAssessmentData  from './painAssessMentData'

const rootReducer = combineReducers({
    user,
    patient,
    painAssessmentData 
});

export default rootReducer;