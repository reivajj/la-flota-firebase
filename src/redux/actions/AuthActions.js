import {
  EMAIL_CHANGED, PASSWORD_CHANGED, SIGNUP_ERROR, SIGN_IN
  , SIGN_OUT_ERROR, SIGN_IN_ERR, SIGN_OUT, SIGNUP_SUCCESS
} from "redux/actions/Types";
import * as UserDataActions from "../../redux/actions/UserDataActions";
import firebaseApp from "../../firebaseConfig/firebase";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

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

export const signIn = ({ email, password, fromSignUp }) => {
  return async dispatch => {
    if (!fromSignUp) {
      // Si vengo del SignUp quiere decir que ya estoy logueado
      let [errorSignInFirebase] = await to(signInWithEmailAndPassword(auth, email, password));
      if (errorSignInFirebase) dispatch({ type: SIGN_IN_ERR }, errorSignInFirebase);
    }

    let userInDBRef = doc(db, "users", auth.currentUser.uid);
    let [errorGettingRol, userDoc] = await to(getDoc(userInDBRef));
    if (errorGettingRol) {
      console.log("Error getting rol: ", errorGettingRol);
      dispatch({ type: SIGN_IN_ERR }, errorGettingRol);
    };

    if (!userDoc.exists) {
      console.log("No such document!");
      dispatch({ type: SIGN_IN_ERR, payload: true }, "NO EXISTE EL USER");
    } else {
      // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
      let userDocData = userDoc.data()
      let date = new Date();
      let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
      let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
      if (errorUpdatingUserSignIn) {
        console.log("Error al actualizar last time", errorUpdatingUserSignIn);
        dispatch({ type: SIGN_IN_ERR }, { error: errorUpdatingUserSignIn, msg: "error al actualizar lastTimeSignedIn" })
      };

      dispatch({ type: SIGN_IN, payload: userDocData });
      dispatch(UserDataActions.userDataSignIn(userDocData));
    }
    return 'SignIn ok';
  }
}

// ASYNC - THUNK
export const signOutFromFirebase = () => {
  return async dispatch => {
    let [errorSignOutFirebase, signOutFirebaseResponse] = await to(signOut(auth));
    if (errorSignOutFirebase) dispatch({ type: SIGN_OUT_ERROR, payload: "Hubo un problema al realizar el SignOut" });

    dispatch(UserDataActions.userDataSignOut());
    dispatch({ type: SIGN_OUT });

    return `Sign Out Ok: ${signOutFirebaseResponse}`;
  }
};

export const signUp = userData => {
  return async dispatch => {
    const { email, password } = userData;
    let [errorSignUpFirebase, userCreds] = await to(createUserWithEmailAndPassword(auth, email, password));
    if (errorSignUpFirebase) {
      // Aca deberia hacer algo! Indicando que hubo un problema, no deberia seguir! Puedo usar el SIGNUP_ERROR
      // de la misma manera que hago en el SignIn!
      dispatch({ type: SIGNUP_ERROR, payload: { msg: "Hubo un problema al realizar el SignUp", error: errorSignUpFirebase } });
      throw new Error("Hubo un problema al realizar el SignUp");
    }
    dispatch({ type: SIGNUP_SUCCESS, payload: userCreds });
    return `SignUp Ok: ${userCreds}`;
  }
};
