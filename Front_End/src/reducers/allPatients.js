import {ALL_PATIENTS_ACTIONS} from '../constants/actions';

const initialState = {
  all_patients: [],
};

const allPatients = (state = initialState, action) => {
  switch (action.type) {
    case ALL_PATIENTS_ACTIONS?.ALL_PATIENTS: {
      return {
        ...state,
        all_patients: action?.payload,
      };
    }
    default:
      return state;
  }
};

export default allPatients