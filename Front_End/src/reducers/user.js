import { USER_ACTIONS } from "../constants/actions";

const initialState = {
    loggedInUserId: "",
    authToken: ""
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_ACTIONS.UPDATE_AUTH_DATA:
            return { ...state, authToken: action.data.authToken, loggedInUserId: action.data.userId };
        default:
            return state;
    }
};

export default user;