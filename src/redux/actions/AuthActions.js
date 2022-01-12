import {
  EMAIL_CHANGED, PASSWORD_CHANGED, SIGNUP_ERROR, SIGN_IN
  , SIGN_OUT_ERROR, SIGN_IN_ERR, SIGN_OUT, SIGNUP_SUCCESS
} from "redux/actions/Types";
import * as UserDataActions from "../../redux/actions/UserDataActions";
import firebaseApp from "../../firebaseConfig/firebase";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc } from "firebase/firestore";
import { to } from 'utils';
import * as FirestoreServices from "../../services/FirestoreServices";
import { logLoginAnalyticEvent } from '../../services/GoogleAnalytics';
import { checkEmailAndPasswordInWpDB } from "services/BackendCommunication";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

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

const getAllDataFromDBToStoreClient = async (userUid, userDataFromDB, dispatch) => {
  let albums = await FirestoreServices.getElements(userUid, "albums", dispatch);
  let artists = await FirestoreServices.getElements(userUid, "artists", dispatch);
  let labels = await FirestoreServices.getElements(userUid, "labels", dispatch);
  const invitedArtists = await FirestoreServices.getElements(userUid, "artistsInvited", dispatch);

  dispatch(UserDataActions.userDataSignIn(userDataFromDB, albums, artists, labels, invitedArtists));
}

const getAllDataFromDBToStore = async (userUid, userDataFromDB, dispatch) => {
  let userIsClient = true;
  if (userIsClient) {
    await getAllDataFromDBToStoreClient(userUid, userDataFromDB, dispatch);
  }
}

export const signInFromGoogle = userInfoFromGoogle => async dispatch => {
  console.log("USER INFO: ", userInfoFromGoogle);

  let userInDBRef = doc(db, "users", auth.currentUser.uid);
  let [errorGettingDoc, userDoc] = await to(getDoc(userInDBRef));

  if (errorGettingDoc) {
    dispatch({ type: SIGN_IN_ERR }, errorGettingDoc);
    return;
  };

  if (!userDoc.exists) {
    dispatch({ type: SIGN_IN_ERR, payload: true }, "NO EXISTE EL USER");
    return;
  } else {
    // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
    let userDocData = userDoc.data()
    let date = new Date();
    let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
    let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
    if (errorUpdatingUserSignIn) {
      console.log("Error al actualizar last time", errorUpdatingUserSignIn);
      dispatch({ type: SIGN_IN_ERR }, { error: errorUpdatingUserSignIn, msg: "error al actualizar lastTimeSignedIn" });
      return;
    };

    let [errorUploadingAllDataFromDbToStore] = await to(getAllDataFromDBToStore(auth.currentUser.uid, userDocData, dispatch));
    if (errorUploadingAllDataFromDbToStore) {
      console.log("Error al subir toda la data de la db al store: ", errorUploadingAllDataFromDbToStore);
      throw new Error("Error al subir toda la data de la db al store: ", errorUploadingAllDataFromDbToStore);
    }

    dispatch({ type: SIGN_IN, payload: userDocData });
  }
}

export const signInDoubleSystem = ({ email, password }) => async dispatch => {
  const userEmailExistInFB = await FirestoreServices.userByEmailInFS(email, dispatch);
  if (userEmailExistInFB) await signIn({ email, password, fromSignUp: false }, dispatch);
  else {
    const emailAndPasswordIsCorrect = await checkEmailAndPasswordInWpDB(email, password, dispatch);
    if (emailAndPasswordIsCorrect.existEmail && emailAndPasswordIsCorrect.passwordCheck) {
      await signUp({ email, password, nombre: "", apellido: "" }, dispatch);
    }
    else dispatch({ type: SIGN_IN_ERR, payload: emailAndPasswordIsCorrect });
  }
}

export const signIn = async ({ email, password, fromSignUp }, dispatch) => {

  if (!fromSignUp) {
    // Si vengo del SignUp quiere decir que ya estoy logueado
    let [errorSignInFirebase] = await to(signInWithEmailAndPassword(auth, email, password));
    if (errorSignInFirebase) {
      dispatch({ type: SIGN_IN_ERR, payload: errorSignInFirebase });
      return;
    }
  }

  let userDoc = await FirestoreServices.getUserDoc(auth.currentUser.uid, dispatch);

  if (!userDoc.exists) {
    dispatch({ type: SIGN_IN_ERR, payload: "NO EXISTE EL USER" });
    return;
  } else {
    // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
    let userDocData = await FirestoreServices.updateUserDoc(auth.currentUser.uid, userDoc, dispatch);
    if (userDocData === "error") return;

    let [errorUploadingAllDataFromDbToStore] = await to(getAllDataFromDBToStore(auth.currentUser.uid, userDocData, dispatch));
    if (errorUploadingAllDataFromDbToStore) {
      dispatch({ type: SIGN_IN_ERR, payload: errorUploadingAllDataFromDbToStore });
      return;
    }

    dispatch({ type: SIGN_IN, payload: userDocData });
  }
  return 'SignIn ok';
}


// ASYNC - THUNK
export const signOutFromFirebase = () => async dispatch => {
  let [errorSignOutFirebase, signOutFirebaseResponse] = await to(signOut(auth));
  if (errorSignOutFirebase) dispatch({ type: SIGN_OUT_ERROR, payload: "Hubo un problema al realizar el SignOut" });

  dispatch(UserDataActions.userDataSignOut());
  dispatch({ type: SIGN_OUT });

  return `Sign Out Ok: ${signOutFirebaseResponse}`;
}

export const signUp = async ({ email, password, nombre, apellido }, dispatch) => {
  let [errorSignUpFirebase, userCreds] = await to(createUserWithEmailAndPassword(auth, email, password));
  if (errorSignUpFirebase) {
    // Aca deberia hacer algo! Indicando que hubo un problema, no deberia seguir! Puedo usar el SIGNUP_ERROR
    // de la misma manera que hago en el SignIn!
    dispatch({ type: SIGNUP_ERROR, payload: { msg: "Hubo un problema al realizar el SignUp", error: errorSignUpFirebase } });
    throw new Error("Hubo un problema al realizar el SignUp");
  }

  let userDataDocFS = await FirestoreServices.createUserDocs({ email, id: userCreds.user.uid, nombre, apellido }, dispatch);

  logLoginAnalyticEvent(userDataDocFS);
  dispatch({ type: SIGN_IN, payload: userDataDocFS });
  dispatch({ type: SIGNUP_SUCCESS, payload: userCreds });

  await signIn({ email, password, fromSignUp: true }, dispatch)

  return `SignUp Ok: ${userCreds}`;
}
