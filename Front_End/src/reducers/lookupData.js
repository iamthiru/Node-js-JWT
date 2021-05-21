import {LOOKUP_DATA_ACTION} from '../constants/actions';

const intialState = {
  lookup_data: [],
};

const lookupData = (state = intialState, action) => {
  switch (action.type) {
    case LOOKUP_DATA_ACTION.LOOKUP_DATA:
      return {
        ...state,
        lookup_data: action.payload,
      };
    default:
      return state;
  }
};

export default lookupData;
