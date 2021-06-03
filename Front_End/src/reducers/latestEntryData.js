import { LATEST_ENTRY_ACTION } from "../constants/actions"

const intialState ={

}


const latestEntry = (state = intialState,action)=>{
    switch(action.type){
        case LATEST_ENTRY_ACTION.LATEST_ENTRY:
            return{
                ...state,
                data:action.payload,
                ...action.payload
            }
            default :
            return state
    }
}
export default latestEntry