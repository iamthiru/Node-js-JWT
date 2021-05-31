import { USER_ACTIONS } from "../constants/actions";

const initialState = {
    loggedInUserId: "",
    authToken: "",
    userName: "",
    emailToLogin: ""
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_ACTIONS.UPDATE_AUTH_DATA:
            return {
                ...state,
                authToken: action.data.authToken,
                loggedInUserId: action.data.userId,
                userName: action.data.userName,
                emailToLogin: action.data.emailToLogin
            };
        default:
            return state;
    }
};

export default user;