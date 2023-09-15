
import { SIGN_IN, SIGN_UP , SIGN_UP_WITH_MS ,LOGOUT} from "./ActionType"

const initialValue={
    signupwithms:null,
    signup:null,
    signin:null,
    logout:null
}

export const AuthReducer=(store=initialValue,{type,payload})=>{

    if(type===SIGN_IN){
        return{...store,signin:payload}
    }
    else if(type===SIGN_UP){
        return{...store,signup:payload}
    }
    else if(type === SIGN_UP_WITH_MS){
        return {
            ...store,
            signupwithms: payload
          };
    }
    else if (type === LOGOUT){
        return {
            ...store,
            logout:payload
        };
    }

    return store;

}