import { PAIN_ASSESSMENT_DATA_ACTION } from '../constants/actions'

const initialState ={
        // patient_name:'',
        // nrs_scrore_data:{},
        // verbalAbility_value:'',
        // selectedActivities:[],
        // painLocation:'',
        // selectedPainQualities:[],
        // painFrequency_data:{
        //     painFrequency:'',
        //     selectedTime:{},
        //     selectedTime:{}
        // },
        // remainder:{
        //     selectedData:{},
        //     selectedTime:{}
        // },
        // notes:''
}

const painAssessmentData = (state = initialState, action)=>{
    switch(action.type){
        case PAIN_ASSESSMENT_DATA_ACTION.PAIN_ASSESSMENT_DATA:
            return{
                ...state,
                data : action.payload,

            }
         default:
             return state
        
    }
}
export default painAssessmentData 


