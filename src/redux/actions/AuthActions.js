import * as ReducerTypes from 'redux/actions/Types';
import * as UserDataActions from "../../redux/actions/UserDataActions";
import firebaseApp from "../../firebaseConfig/firebase";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, getDoc, doc, updateDoc } from "firebase/firestore";
import { to } from 'utils';
import * as FirestoreServices from "../../services/FirestoreServices";
import { logLoginAnalyticEvent } from '../../services/GoogleAnalytics';
import { checkEmailAndPasswordInWpDB } from "services/BackendCommunication";
import { deleteCurrentAuthUser } from 'services/AuthServices';

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// ACTION CREATORS
export const emailChanged = (text) => {
  return {
    type: ReducerTypes.EMAIL_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: ReducerTypes.PASSWORD_CHANGED,
    payload: text,
  };
};

const getAllDataFromDBToStoreClient = async (userUid, userDataFromDB, dispatch) => {
  const albums = await FirestoreServices.getElements(userUid, "albums", dispatch);
  const artists = await FirestoreServices.getElements(userUid, "artists", dispatch);
  const labels = await FirestoreServices.getElements(userUid, "labels", dispatch);
  const invitedArtists = await FirestoreServices.getElements(userUid, "artistsInvited", dispatch);
  // const invitedArtists = [];
  const collaborators = await FirestoreServices.getElements(userUid, "artistsCollaborators", dispatch);

  dispatch(UserDataActions.userDataSignIn(userDataFromDB, albums, artists, labels, invitedArtists, collaborators));
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
    dispatch(loginErrorStore({ error: errorGettingDoc, errorMsg: "Error al recuperar los datos del Usuario." }));
    return "ERROR";
  };

  if (!userDoc.exists) {
    dispatch(loginErrorStore({ errorMsg: "No existe el documento del Usuario." }));
    return "ERROR";
  } else {
    // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
    let userDocData = userDoc.data()
    let date = new Date();
    let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
    let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
    if (errorUpdatingUserSignIn) {
      console.log("Error al actualizar last time", errorUpdatingUserSignIn);
      dispatch(loginErrorStore({ error: errorUpdatingUserSignIn, errorMsg: "Error al actualizar el documento del Usuario. Intente nuevamente." }));
      return "ERROR";
    };

    let [errorUploadingAllDataFromDbToStore] = await to(getAllDataFromDBToStore(auth.currentUser.uid, userDocData, dispatch));
    if (errorUploadingAllDataFromDbToStore) {
      dispatch(loginErrorStore({ error: errorUploadingAllDataFromDbToStore, errorMsg: "Error al recuperar los documentos del Usuario. Intente nuevamente." }))
      return "ERROR";
    }

    dispatch({ type: ReducerTypes.SIGN_IN, payload: userDocData });
  }
}

export const signInDoubleSystem = ({ email, password }) => async dispatch => {
  console.log("SINGIN IN ")
  const userEmailExistInFB = await FirestoreServices.userByEmailInFS(email, dispatch);
  if (userEmailExistInFB) await signIn({ email, password, fromSignUp: false }, dispatch);
  else {
    const emailAndPasswordIsCorrect = await checkEmailAndPasswordInWpDB(email, password, dispatch);
    console.log("Email and Pw, and userInWP: ", emailAndPasswordIsCorrect);
    if (emailAndPasswordIsCorrect.existEmail && emailAndPasswordIsCorrect.passwordCheck) {
      await signUp({ email, password, nombre: "", apellido: "", userInWp: emailAndPasswordIsCorrect.userInWp }, dispatch);
    }
    else dispatch(loginErrorStore({ error: emailAndPasswordIsCorrect, errorMsg: "Email o Contraseña incorrectos." }));
  }
}

export const signIn = async ({ email, password, fromSignUp }, dispatch) => {

  if (!fromSignUp) {
    // Si vengo del SignUp quiere decir que ya estoy logueado
    let [errorSignInFirebase] = await to(signInWithEmailAndPassword(auth, email, password));
    if (errorSignInFirebase) {
      dispatch(loginErrorStore({ error: errorSignInFirebase, errorMsg: "Contraseña incorrecta" }));
      return "ERROR";
    }
  }

  let userDoc = await FirestoreServices.getUserDoc(auth.currentUser.uid, dispatch);
  if (userDoc === "ERROR") dispatch(loginErrorStore({ error: "", errorMsg: "Error al buscar al Usuario. Intente nuevamente." }));
  if (!userDoc.exists) {
    dispatch(loginErrorStore({ error: "", errorMsg: "No existe el Usuario" }));
    return "ERROR";
  } else {
    // Apenas obtengo las credenciales y se que tengo al user en mi tabla "users", hago el signIn
    let userDocData = await FirestoreServices.updateUserDoc(auth.currentUser.uid, userDoc, dispatch);
    if (userDocData === "ERROR") return "ERROR";

    let [errorUploadingAllDataFromDbToStore] = await to(getAllDataFromDBToStore(auth.currentUser.uid, userDocData, dispatch));
    if (errorUploadingAllDataFromDbToStore) {
      dispatch(loginErrorStore({ error: errorUploadingAllDataFromDbToStore, errorMsg: "Error al recuperar los datos, intente nuevamente." }));
      return "ERROR";
    }

    dispatch({ type: ReducerTypes.SIGN_IN, payload: userDocData });
  }
  return 'SignIn ok';
}


// ASYNC - THUNK
export const signOutFromFirebase = () => async dispatch => {
  let [errorSignOutFirebase, signOutFirebaseResponse] = await to(signOut(auth));
  if (errorSignOutFirebase) dispatch({ type: ReducerTypes.SIGN_OUT_ERROR, payload: "Hubo un problema al realizar el SignOut" });

  dispatch(UserDataActions.userDataSignOut());
  dispatch({ type: ReducerTypes.SIGN_OUT });

  return `Sign Out Ok: ${signOutFirebaseResponse}`;
}

export const signUp = async ({ email, password, nombre, apellido, userInWp }, dispatch) => {
  let [errorSignUpFirebase, userCreds] = await to(createUserWithEmailAndPassword(auth, email, password));
  if (errorSignUpFirebase) {
    // Aca deberia hacer algo! Indicando que hubo un problema, no deberia seguir! Puedo usar el SIGNUP_ERROR
    // de la misma manera que hago en el SignIn!
    dispatch(loginErrorStore({ errorMsg: "Hubo un problema al realizar el SignIn. Intente nuevamente.", error: errorSignUpFirebase }));
    return "ERROR";
  }

  let userDataDocFS = await FirestoreServices.createUserDocs({ email, id: userCreds.user.uid, nombre, apellido, userInWp }, dispatch);
  if (userDataDocFS === "ERROR") {
    dispatch(loginErrorStore({ errorMsg: "Error al crear los datos del usuario, intente nuevamente." }));
    await deleteCurrentAuthUser();
    return "ERROR";
  }

  logLoginAnalyticEvent(userDataDocFS);
  dispatch({ type: ReducerTypes.SIGN_IN, payload: userDataDocFS });
  dispatch({ type: ReducerTypes.SIGNUP_SUCCESS, payload: userCreds });

  await signIn({ email, password, fromSignUp: true }, dispatch)

  return `SignUp Ok: ${userCreds}`;
}

export const loginErrorStore = errorLogin => {
  return {
    type: ReducerTypes.SIGN_IN_ERR,
    payload: errorLogin
  }
} 