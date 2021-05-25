import { PATIENT_ACTIONS, PATIENT_NAME_ACTION } from "../constants/actions"

const initialState = {
}

const patientData = (state =initialState,action) =>{
    switch(action.type){
        case PATIENT_NAME_ACTION.PATIENT:
            return{
                ...state,
                patient:action.payload
            }
        
        default:
            return state
    }
}
export  default patientData