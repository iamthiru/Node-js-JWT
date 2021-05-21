import { combineReducers } from 'redux';
import user from './user';
import patient from './patients'
import painAssessmentData  from './painAssessMentData'
import allPatients from './allPatients'
import lookupData from './lookupData'
import lookupType from './lookupType'
import patientName from './patientName'
import createAsseement from './createAssessmentData'
import craeteMedication from './createMedication'
import getLastAssesmentAndMedication from './getLastMedicationAssessment'
import allAssessmentList from './allAssessmentList'
       

const rootReducer = combineReducers({
    user,
    patient,
    painAssessmentData ,
    allPatients,
    lookupData,
    lookupType,
    patientName,
    createAsseement,
    craeteMedication,
    getLastAssesmentAndMedication,
    allAssessmentList
});

export default rootReducer;