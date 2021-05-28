import { ROUTE_NAME_ACTION } from "../constants/actions"

const initialState = {

}

const routeName = (state=initialState,action)=>{
    switch(action.type){
        case ROUTE_NAME_ACTION.ROUTE_NAME :
            return {
                ...state,
                route : action?.payload,
                ...action?.payload
            }
            default :
            return state
    }

}
export default routeName







