import {combineReducers} from 'redux';
import user from './user';
import patient from './patients';
import painAssessmentData from './painAssessMentData';
import allPatients from './allPatients';
import lookupData from './lookupData';
import lookupType from './lookupType';
import patientData from './patientData';
import createAsseement from './createAssessmentData';
import craeteMedication from './createMedication';
import getLastAssesmentAndMedication from './getLastMedicationAssessment';
import allAssessmentList from './allAssessmentList';
import routeName from './route';
import painLocations from './painLocations';
import latestEntry from './latestEntryData';
import patientDetails from './patientDetails';
import patientProfileUpdate from './patientProfileUpdate';

const rootReducer = combineReducers({
  user,
  patient,
  painAssessmentData,
  allPatients,
  lookupData,
  lookupType,
  patientData,
  createAsseement,
  craeteMedication,
  getLastAssesmentAndMedication,
  allAssessmentList,
  routeName,
  painLocations,
  latestEntry,
  patientDetails,
  patientProfileUpdate,
});

export default rootReducer;
