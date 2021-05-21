import {LOOKUP_TYPE_ACTION} from '../constants/actions';

const initialState = {
  lookup_type: [],
};

const lookupType = (state = initialState, action) => {
  switch (action.type) {
    case LOOKUP_TYPE_ACTION.LOOKUP_TYPE:
      return {
        ...state,
        lookup_type: action.payload,
      };
    default:
      return state;
  }
};

export default lookupType;
