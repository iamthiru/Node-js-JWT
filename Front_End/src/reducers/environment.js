import { envActions } from '../constants/actions';
import { DEFAULT_ENVIRONMENT_KEY } from '../constants/environment';

const initialState = {
    environment: DEFAULT_ENVIRONMENT_KEY
};

const environment = (state = initialState, action) => {
    switch (action.type) {
        case envActions.SET_ENVIRONMENT:
            return { ...state, environment: action.data };
        default:
            return state;
    }
};

export default environment;