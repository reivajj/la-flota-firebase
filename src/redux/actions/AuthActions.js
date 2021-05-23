import {
  EMAIL_CHANGED, PASSWORD_CHANGED, SIGNUP_ERROR, SIGN_IN
  , SIGN_OUT_ERROR, SIGN_IN_ERR, SIGN_OUT, SIGNUP_SUCCESS
} from "redux/actions/Types";
import * as UserDataActions from "../../redux/actions/UserDataActions";
import firebase from "../../firebaseConfig/firebase";

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

export const signIn = ({ email, password, fromSignUp }) => {
  return async dispatch => {
    if (!fromSignUp) {
      // Si vengo del SignUp quiere decir que ya estoy logueado
      let [errorSignInFirebase] = await to(firebase.auth().signInWithEmailAndPassword(email, password));
      if (errorSignInFirebase) dispatch({ type: SIGN_IN_ERR }, errorSignInFirebase);
    }

    const { currentUser } = firebase.auth();
    let userInDBRef = db.collection("users").doc(currentUser.uid);

    let [errorGettingRol, userDoc] = await to(userInDBRef.get());
    if (errorGettingRol) dispatch({ type: SIGN_IN_ERR }, errorGettingRol);

    if (!userDoc.exists) {
      console.log("No such document!");
      dispatch({ type: SIGN_IN_ERR, payload: true }, "NO EXISTE EL USER");
    } else {
      // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
      let userDocData = userDoc.data()
      let date = new Date();
      let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires'});
      let [errorUpdatingUserSignIn] = await to(userInDBRef.update({ lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
      if (errorUpdatingUserSignIn) dispatch({ type: SIGN_IN_ERR }, { errorUpdatingUserSignIn, msg: "error al actualizar lastTimeSignedIn" });

      dispatch({ type: SIGN_IN, payload: userDocData });
      dispatch(UserDataActions.userDataSignIn(userDocData));
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
      dispatch({ type: SIGNUP_ERROR, payload: { msg: "Hubo un problema al realizar el SignUp", error: errorSignUpFirebase } });
      throw new Error("Hubo un problema al realizar el SignUp");
    }
    dispatch({ type: SIGNUP_SUCCESS, payload: userCreds });
    return `SignUp Ok: ${userCreds}`;
  }
};
