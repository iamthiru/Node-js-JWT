import { CREATE_MEDICATION_ACTION } from "../constants/actions"

const initialState ={
    medication:[]

}


const createMedication = (state= initialState,action)=>{
    switch(action.type){
        case CREATE_MEDICATION_ACTION.CREATE_MEDICATION:
            return {
                ...state,
                medication:action.payload
            }           
            default:
                return state

    }
}
export default createMedication