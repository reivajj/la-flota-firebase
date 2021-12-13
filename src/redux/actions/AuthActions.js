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

  dispatch(UserDataActions.userDataSignIn(userDataFromDB, albums, artists, labels));
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

const createUserDocItem = userData => {
  return {
    email: userData.email,
    nombre: userData.nombre,
    apellido: userData.apellido,
    id: userData.id,
    usuarioActivo: true,
    ciudad: "",
    provincia: "",
    telefono: "",
    dni: "",
    imagenUrl: "",
    timestampWhenCreatedUser: Date.now(),
    rol: "basic",
    stats: {
      totalAlbums: 0,
      totalArtists: 0,
      totalLabels: 0,
      totalTracks: 0
    },
    withdrawals: {
      cupones: {
        totalAmount: 0,
        totalWithdrawals: 0
      },
      pesos: {
        totalAmount: 0,
        totalWithdrawals: 0
      },
      usd: {
        totalAmount: 0,
        totalWithdrawals: 0
      }
    }
  };
}

export const createUserDocs = async newUserData => async dispatch => {
  console.log("User: ", newUserData);
  let userDataComplete = createUserDocItem(newUserData);

  await FirestoreServices.createElementFS(userDataComplete, newUserData.id, "users", "", 0, dispatch);
  await FirestoreServices.createElementFS(userDataComplete, newUserData.email, "usersPorMail", "", 0, dispatch);

  dispatch({ type: SIGN_IN, payload: userDataComplete });
}

export const signIn = ({ email, password, fromSignUp }) => async dispatch => {

  if (!fromSignUp) {
    // Si vengo del SignUp quiere decir que ya estoy logueado
    let [errorSignInFirebase] = await to(signInWithEmailAndPassword(auth, email, password));
    if (errorSignInFirebase) {
      dispatch({ type: SIGN_IN_ERR }, errorSignInFirebase);
      return;
    }
  }

  let userInDBRef = doc(db, "users", auth.currentUser.uid);
  let [errorGettingRol, userDoc] = await to(getDoc(userInDBRef));
  if (errorGettingRol) {
    console.log("Error getting rol: ", errorGettingRol);
    dispatch({ type: SIGN_IN_ERR }, errorGettingRol);
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

export const signUp = userData => async dispatch => {
  const { email, password, nombre, apellido } = userData;
  let [errorSignUpFirebase, userCreds] = await to(createUserWithEmailAndPassword(auth, email, password));
  if (errorSignUpFirebase) {
    // Aca deberia hacer algo! Indicando que hubo un problema, no deberia seguir! Puedo usar el SIGNUP_ERROR
    // de la misma manera que hago en el SignIn!
    dispatch({ type: SIGNUP_ERROR, payload: { msg: "Hubo un problema al realizar el SignUp", error: errorSignUpFirebase } });
    throw new Error("Hubo un problema al realizar el SignUp");
  }

  dispatch({ type: SIGNUP_SUCCESS, payload: userCreds });

  let userDataComplete = createUserDocItem({ email, id: userCreds.user.uid, nombre, apellido });
  await FirestoreServices.createElementFS(userDataComplete, userData.id, "users", "", 1, dispatch);
  dispatch({ type: SIGN_IN, payload: userDataComplete });

  logLoginAnalyticEvent(userDataComplete);

  return `SignUp Ok: ${userCreds}`;
}
