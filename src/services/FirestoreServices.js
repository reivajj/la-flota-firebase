import firebaseApp from 'firebaseConfig/firebase.js';
import { getFirestore, getDoc, updateDoc, doc, setDoc, arrayUnion, query, collection, getDocs, where, increment, deleteDoc } from "firebase/firestore";
import { to } from 'utils';
import { createFireStoreError } from 'redux/actions/ErrorHandlerActions';
import { SIGN_IN_ERR } from 'redux/actions/Types';
import { createUserDocItem } from 'factory/users.factory';

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
  if (errorGettingUserDoc) {
    dispatch({ type: SIGN_IN_ERR, payload: errorGettingUserDoc });
    return { exists: false };
  };

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
    dispatch({ type: SIGN_IN_ERR, payload: { error: errorUpdatingUserSignIn, msg: "error al actualizar lastTimeSignedIn" } });
    return "error";
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
export const createElementFS = async (element, elementId, userId, collection, fieldToIncrementInUserStats, amountToIncrement, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);

  let [errorCreatingElementInCollection] = await to(setDoc(elementDbRef, element));
  if (errorCreatingElementInCollection) {
    console.log(`Error creating new element in ${collection} collection`, errorCreatingElementInCollection);
    throw new Error({ msg: `Error creating new element in ${collection} collection`, error: errorCreatingElementInCollection });
  }

  const elementStatsDbRef = doc(db, collection, "stats");
  let [errorUpdatingStatsInCollection] = await to(updateDoc(elementStatsDbRef, { total: increment(amountToIncrement) }));
  if (errorUpdatingStatsInCollection) {
    console.log(`Error updating stats in ${collection} : `, errorUpdatingStatsInCollection);
    throw new Error({ msg: `Error updating stats in ${collection} : `, error: errorUpdatingStatsInCollection });
  }

  if (fieldToIncrementInUserStats !== "") {
    const usersDbRef = doc(db, "users", userId);
    let [errorUpdatingStatsInUser] = await to(updateDoc(usersDbRef, { [`stats.${fieldToIncrementInUserStats}`]: increment(amountToIncrement) }));
    if (errorUpdatingStatsInUser) {
      console.log(`Error updating stats in userDoc for ${collection}: `, errorUpdatingStatsInUser);
      throw new Error({ msg: `Error updating stats in userDoc for ${collection}: `, error: errorUpdatingStatsInUser });
    };
  }

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
  let userDataComplete = createUserDocItem(newUserData);

  await createElementFS(userDataComplete, newUserData.id, newUserData.id, "users", "", 1, dispatch);
  await createElementFS(userDataComplete, newUserData.email, "", "usersByEmail", "", 1, dispatch);

  return userDataComplete;
}