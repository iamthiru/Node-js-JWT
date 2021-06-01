import { PAIN_LOCATIONS_ACTION } from "../constants/actions"

const initialState ={
    painLocations :[]
}


const painLocations = (state = initialState,action)=>{
    switch(action.type){
        case PAIN_LOCATIONS_ACTION.PAIN_LOCATION :
            return {
                ...state,
                painLocations : [...action.payload],
            }
            default :
            return state
    }
}
export default painLocations