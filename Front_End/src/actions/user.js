import { USER_ACTIONS } from "../constants/actions";

export const updateAuthData = (authData) => dispatch => {
    dispatch({ type: USER_ACTIONS.UPDATE_AUTH_DATA, data: authData });
}