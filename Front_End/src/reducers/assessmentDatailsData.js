import {PAIN_ASSESSMENT_LIST_DATA_ACTION } from "../constants/actions"

const initialState ={
}


const assessmentDetails = (state = initialState,action)=>{
    switch(action.type){
        case PAIN_ASSESSMENT_LIST_DATA_ACTION.PAIN_ASSESSMENT_LIST_DATA :
            return{
                ...state,
              data  : action?.payload,
              ...action.payload
            }
            default:
                return state
    }
}

export default assessmentDetails


