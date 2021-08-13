import {PATIENT_PROFILE_UPDATE_ACTION} from '../constants/actions';

const initialState = {};

const patientProfileUpdate = (state = initialState, action) => {
  switch (action.type) {
    case PATIENT_PROFILE_UPDATE_ACTION.PATIENT_PROFILE_UPDATE:
      return {
        ...state,
        update: action.payload,
        
      };

    default:
      return state;
  }
};
export default patientProfileUpdate;
