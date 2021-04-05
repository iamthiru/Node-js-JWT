import { PATIENT_ACTIONS } from "../constants/actions";

const initialState = {
    all: [
    ]
}

const patient = (state = initialState, action) => {
    switch (action.type) {
        case PATIENT_ACTIONS.ADD_PATIENT:
            return {
                ...state,
                all: [
                    ...state.all,
                    action.payload
                ]
            };
        default:
            return state;
    }
};

export default patient;