import { GET_ASSESSMENT_ACTION } from "../constants/actions"

const intialState = {

}



const getLastAssesmentAndMedication = (state = intialState,action)=>{
    switch(action.type){
        case GET_ASSESSMENT_ACTION.GET_ASSESSMENT:
            return{
                ...state,
                data:action.payload,
                ...action.payload
            }
            default:
                return state
    }
}
export default getLastAssesmentAndMedication