import {
  USER_DATA_SIGN_IN, USER_DATA_SIGN_OUT, USER_DATA_ADD_IMAGE
} from 'redux/actions/Types';
// import firebase from 'firebaseConfig/firebase';

// const db = firebase.firestore();

// function to(promise) {
//   return promise.then(data => {
//     return [null, data];
//   })
//     .catch(err => [err]);
// }

// ACTION CREATORS
export const userDataSignIn = (userInfo) => {
  return {
    type: USER_DATA_SIGN_IN,
    payload: userInfo
  };
};

export const userDataSignOut = () => {
  return {
    type: USER_DATA_SIGN_OUT
  };
};

export const userDataAddImage = (urlImage) => {
  return {
    type: USER_DATA_ADD_IMAGE,
    payload: urlImage
  };
};



export const editPerfil = () => {
  return async () => {
    return console.log("error");
  }
};
