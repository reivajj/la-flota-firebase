import {
  EMAIL_CHANGED, PASSWORD_CHANGED, SIGNUP_ERROR, SIGN_IN
  , SIGN_OUT_ERROR, SIGN_IN_ERR, SIGN_OUT, SIGNUP_SUCCESS
} from "redux/actions/Types";
import * as UserDataActions from "redux/actions/UserDataActions";
import firebase from "firebaseConfig/firebase.js";

const db = firebase.firestore();

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

// ACTION CREATORS
export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

export const signIn = ({ email, password }) => {
  return async dispatch => {
    let [errorSignInFirebase, userDocFirebase] = await to(firebase.auth().signInWithEmailAndPassword(email, password));
    if (errorSignInFirebase) dispatch({ type: SIGN_IN_ERR }, errorSignInFirebase);

    const { currentUser } = firebase.auth();
    console.log("Current User: ", currentUser);
    let [errorGettingRol, userDoc] = await to(db.collection("users").doc(currentUser.uid).get());
    if (errorGettingRol) {
      console.log("El error: ", errorGettingRol)
      dispatch({ type: SIGN_IN_ERR }, errorGettingRol);
    }

    console.log("UserDoc: ", userDoc, "/ ", userDoc.exists);
    if (!userDoc.exists) {
      console.log("No such document!");
      dispatch({ type: SIGN_IN_ERR, payload: true }, "NO EXISTE EL USER");
    } else {
      // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
      dispatch({ type: SIGN_IN, payload: userDocFirebase });
      // let [errorUploadingAllDataFromDbToStore] = await to(uploadAllDataFromDBToStore(currentUser.uid, { ...userDoc.data() }, dispatch));
      // if (errorUploadingAllDataFromDbToStore) throw new Error("Error al subir toda la data de la db al store: ", errorUploadingAllDataFromDbToStore);
    }
    return 'SignIn ok';
  }
}

// ASYNC - THUNK
export const signOut = () => {
  return async dispatch => {
    let [errorSignOutFirebase, signOutFirebaseResponse] = await to(firebase.auth().signOut());
    if (errorSignOutFirebase) dispatch({ type: SIGN_OUT_ERROR, payload: "Hubo un problema al realizar el SignOut" });

    dispatch(UserDataActions.userDataSignOut());
    dispatch({ type: SIGN_OUT });

    return `Sign Out Ok: ${signOutFirebaseResponse}`;
  }
};

export const signUp = userData => {
  return async dispatch => {
    const { email, password } = userData;
    let [errorSignUpFirebase, userCreds] = await to(firebase.auth().createUserWithEmailAndPassword(email, password));
    if (errorSignUpFirebase) {
      // Aca deberia hacer algo! Indicando que hubo un problema, no deberia seguir! Puedo usar el SIGNUP_ERROR
      // de la misma manera que hago en el SignIn!
      dispatch({ type: SIGNUP_ERROR, payload: "Hubo un problema al realizar el SignUp" });
      throw new Error("Hubo un problema al realizar el SignUp");
    }
    dispatch({ type: SIGNUP_SUCCESS, payload: userCreds });
    return `SignUp Ok: ${userCreds}`;
  }
};
