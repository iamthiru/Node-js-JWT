import {CREATE_ASSESSMENT_ACTION} from '../constants/actions';

const initialState = {};

const createAsseement = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT:
      return {
        ...state,
        data: action.payload,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default createAsseement