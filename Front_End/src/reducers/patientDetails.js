import { PATIENT_DETAILS_ACTION } from "../constants/actions"

const initialState = {
}

const patientDetails = (state =initialState,action) =>{
    switch(action.type){
        case  PATIENT_DETAILS_ACTION.PATIENT_DETAILS:
            return{
                ...state,
                item:action.payload
            }
        
        default:
            return state
    }
}
export  default patientDetails