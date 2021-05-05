import { PAIN_ASSESSMENT_DATA_ACTION } from '../constants/actions'

const initialState ={
        patient_name:'',
}

const painAssessmentData = (state = initialState, action)=>{
    switch(action.type){
        case PAIN_ASSESSMENT_DATA_ACTION.PAIN_ASSESSMENT_DATA:
            return{
                ...state,
                patient_name:action.payload
            }
         default:
             return state
        
    }
}
export default painAssessmentData 


