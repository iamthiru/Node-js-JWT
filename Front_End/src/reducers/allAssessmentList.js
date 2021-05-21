import { ALL_ASSESSMENTS_LIST_ACTION } from "../constants/actions"

const initialState ={

}


const allAssessmentList = (state = initialState,action)=>{
    switch(action.type){
        case ALL_ASSESSMENTS_LIST_ACTION.ALL_ASSESSMENT_LIST :
            return{
                ...state,
                data:action.payload
            }
            default:
                return state
    }
}

export default allAssessmentList


