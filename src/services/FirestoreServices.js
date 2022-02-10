import firebaseApp from 'firebaseConfig/firebase.js';
import { getFirestore, getDoc, updateDoc, doc, setDoc, arrayUnion, query, collection, getDocs, where, increment, deleteDoc } from "firebase/firestore";
import { to, toWithOutError } from 'utils';
import { createFireStoreError } from 'redux/actions/ErrorHandlerActions';
import { createUserDocItem } from 'factory/users.factory';
import { loginErrorStore } from 'redux/actions/AuthActions';

const db = getFirestore(firebaseApp);

export const editUserDataWithOutCredentials = async (newUserData, dispatch) => {
  const userDbRef = doc(db, "users", newUserData.id);
  let [errorUpdatingUserInDB] = await to(updateDoc(userDbRef, { ...newUserData }));
  if (errorUpdatingUserInDB) {
    dispatch(createFireStoreError("Error updating user data info", errorUpdatingUserInDB));
    return "ERROR";
  }
  return "EDITED";
}

export const getUserDoc = async (userId, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let [errorGettingUserDoc, userDoc] = await to(getDoc(userInDBRef));
  if (errorGettingUserDoc) return "ERROR";
  return userDoc;
}

export const updateUserDoc = async (userId, userDoc, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let userDocData = userDoc.data();
  let date = new Date();
  let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
  userDocData.lastTimeSignedInString = lastTimeSignedInString;
  userDocData.lastTimeSignedIn = date.getTime();

  let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
  if (errorUpdatingUserSignIn) {
    dispatch(loginErrorStore({ error: errorUpdatingUserSignIn, errorMsg: "Error al actualizar al usuario. Intente nuevamente." }));
    return "ERROR";
  };
  return userDocData;
}

export const getElements = async (userId, typeOfElement, dispatch) => {
  const elementsDbFromUserRef = query(collection(db, typeOfElement), where("ownerId", "==", userId));
  let [errorGettingElementsFromUser, elementsFromUserSnapshot] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) console.log(`Error getting user ${typeOfElement}: `, errorGettingElementsFromUser);

  let elementsFromUser = [];
  elementsFromUserSnapshot.forEach(albumDoc => {
    elementsFromUser.push(albumDoc.data());
  });

  return elementsFromUser;
}


// Siempre que creo un Artista, tambien actualizare el documento del Usuario que creo el Artista.
// Elements es: LABEL, ARTIST, TRACK, ALBUMS. ARTISTS_INVITED, COLLABORATORS
export const createElementFS = async (element, elementId, userId, collection, fieldToIncrementInUserStats, amountToIncrement, dispatch) => {
  console.log({ element, elementId, userId, collection, fieldToIncrementInUserStats, amountToIncrement })
  const elementDbRef = doc(db, collection, elementId);

  let [errorCreatingElement] = await to(setDoc(elementDbRef, element))
  if (errorCreatingElement) {
    dispatch(loginErrorStore({ errorCreatingElement, errorMsg: `Error creating new element in ${collection} collection` }));
    return "ERROR";
  }

  const elementStatsDbRef = doc(db, collection, "stats");
  let [errorUpdatingStatsInCollection] = await to(updateDoc(elementStatsDbRef, { total: increment(amountToIncrement) }));
  if (errorUpdatingStatsInCollection) {
    dispatch(loginErrorStore({ error: errorUpdatingStatsInCollection, errorMsg: `Error updating stats in ${collection}` }));
    return "ERROR";
  }

  if (fieldToIncrementInUserStats !== "") {
    const usersDbRef = doc(db, "users", userId);
    let [errorUpdatingStatsInUser] = await to(updateDoc(usersDbRef, { [`stats.${fieldToIncrementInUserStats}`]: increment(amountToIncrement) }));
    if (errorUpdatingStatsInUser) {
      dispatch(loginErrorStore({ error: errorUpdatingStatsInUser, errorMsg: `Error updating total in users collection` }));
      return "ERROR";
    };
  }
  return "SUCCESS";
}

// Elements es: LABEL, ARTIST, TRACK, ALBUMS.
export const deleteElementFS = async (elementId, userId, collection, fieldToDecrementInUserStats, amountToDecrement, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);

  let [errorDeletingElementInCollection] = await to(deleteDoc(elementDbRef));
  if (errorDeletingElementInCollection) {
    console.log(`Error deleting element in ${collection} collection`, errorDeletingElementInCollection);
    throw new Error({ msg: `Error deleting new element in ${collection} collection`, error: errorDeletingElementInCollection });
  }

  const elementStatsDbRef = doc(db, collection, "stats");
  let [errorUpdatingStatsInCollection] = await to(updateDoc(elementStatsDbRef, { total: increment(amountToDecrement) }));
  if (errorUpdatingStatsInCollection) {
    console.log(`Error updating stats in ${collection} : `, errorUpdatingStatsInCollection);
    throw new Error({ msg: `Error updating stats in ${collection} : `, error: errorUpdatingStatsInCollection });
  }

  if (fieldToDecrementInUserStats !== "") {
    const usersDbRef = doc(db, "users", userId);
    let [errorUpdatingStatsInUser] = await to(updateDoc(usersDbRef, { [`stats.${fieldToDecrementInUserStats}`]: increment(amountToDecrement) }));
    if (errorUpdatingStatsInUser) {
      console.log(`Error updating stats in userDoc for ${collection}: `, errorUpdatingStatsInUser);
      throw new Error({ msg: `Error updating stats in userDoc for ${collection}: `, error: errorUpdatingStatsInUser });
    };
  }

}

// Elements es: ARTIST, TRACK, ALBUMS.
export const updateElementFS = async (newElementFields, elementId, collection, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);

  let [errorUpdatingElementInCollection] = await to(updateDoc(elementDbRef, { ...newElementFields }));
  if (errorUpdatingElementInCollection) {
    console.log(`Error updating element in ${collection} collection`, errorUpdatingElementInCollection);
    throw new Error({ msg: `Error updating new element in ${collection} collection`, error: errorUpdatingElementInCollection });
  }
}

// Todavia lo estoy usando. Reemplazarlo.
export const createTrack = async track => {
  const tracksDbRef = doc(db, "tracks", track.id);
  let [errorCreatingTrackInTrackssCollection] = await to(setDoc(tracksDbRef, track));
  if (errorCreatingTrackInTrackssCollection) {
    console.log("Error al crear al Sello en la DB, coleccion de albums: ", errorCreatingTrackInTrackssCollection);
    throw new Error({ msg: "Error al crear al Sello en la DB, coleccion de albums: ", error: errorCreatingTrackInTrackssCollection });
  };

  const usersDbRef = doc(db, "users", track.ownerId);
  let [errorCreatingTrackInUser] = await to(updateDoc(usersDbRef, { tracks: arrayUnion(track) }));
  if (errorCreatingTrackInUser) {
    console.log("Error al agregar al Track en la DB, coleccion del users: ", errorCreatingTrackInUser);
    throw new Error({ msg: "Error al agregar al Track en la DB, coleccion del users: ", error: errorCreatingTrackInUser });
  };
}

export const userByEmailInFS = async (email, dispatch) => {
  const userByEmailDbRef = doc(db, "usersByEmail", email);
  let [errorGettingUserByEmail, userByEmailSnap] = await to(getDoc(userByEmailDbRef));
  if (errorGettingUserByEmail) return false;
  return userByEmailSnap.exists();
}

export const createUserDocs = async (newUserData, dispatch) => {
  const { id, email, userInWp } = newUserData;
  let userDataComplete = createUserDocItem(newUserData, userInWp);
  console.log("antes de crear el doc:", { id, email, userInWp });

  let [errorCreatingDocInUsers] = await to(createElementFS(userDataComplete, id, id, "users", "", 1, dispatch));
  if (errorCreatingDocInUsers) return "ERROR";
  let [resultCreatingDocInUserEmails] = await to(createElementFS(userDataComplete, email, "", "usersByEmail", "", 1, dispatch));
  if (resultCreatingDocInUserEmails === "ERROR") return "ERROR";
  return userDataComplete;
}