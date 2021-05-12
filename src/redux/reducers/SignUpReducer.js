import { SIGNUP_ERROR, SIGNUP_SUCCESS, REVERT_SIGNUP_SUCCED } from "redux/actions/Types";

const initialState = { signUpSucced: false, userCreds: {}}

const SignUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_SUCCESS:
      return {signUpSucced: true, userCreds: action.payload};  
    case SIGNUP_ERROR:
        return {signUpSucced: false};
    case REVERT_SIGNUP_SUCCED:
        return {signUpSucced: false};    
    default:
      return state; 
  }
};

export default SignUpReducer;