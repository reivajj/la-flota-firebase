import { EMAIL_CHANGED, PASSWORD_CHANGED, SIGN_IN, SIGN_IN_ERR, SIGN_OUT, SIGN_IN_POST_SIGNUP } from "redux/actions/Types";

const initialState = { email: '', password: '', user: null, errorNoExisteUser: false }

const AuthReducer = (state = initialState, action) => {
  const data = action.payload;
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...state, email: data };
    case PASSWORD_CHANGED:
      return { ...state, password: data };
    case SIGN_IN:
      return { ...state, user: data };
    case SIGN_IN_POST_SIGNUP:
      return { ...state, email:data.email, password:data.password };
    case SIGN_IN_ERR:
      return { ...state, errorNoExisteUser: true, errorDB: action.payload };
    case SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default AuthReducer;
