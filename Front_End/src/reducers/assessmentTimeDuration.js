import {ASSESSMENT_TIME_DURATION_ACTION} from '../constants/actions';

const initialState = {};

const timeDuration = (state = initialState, action) => {
  switch (action.type) {
    case ASSESSMENT_TIME_DURATION_ACTION.ASSESSMENT_TIME_DURATION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default timeDuration