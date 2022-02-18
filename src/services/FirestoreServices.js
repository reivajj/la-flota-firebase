import firebaseApp from 'firebaseConfig/firebase.js';
import {
  getFirestore, getDoc, updateDoc, doc, setDoc, arrayUnion, query, collection,
  getDocs, where, increment, deleteDoc, limit, writeBatch, orderBy
} from "firebase/firestore";
import { to } from 'utils';
import { createFireStoreError } from 'redux/actions/ErrorHandlerActions';
import { createUserDocItem } from 'factory/users.factory';
import { v4 as uuidv4 } from 'uuid';
import { getCantDaysInMS } from '../utils/timeRelated.utils';

const db = getFirestore(firebaseApp);

const collectionsWithActivities = ["artists", "albums", "labels"];

export const editUserDataWithOutCredentials = async (newUserData, dispatch) => {
  if (!newUserData.id) return "ERROR";
  const userDbRef = doc(db, "users", newUserData.id);
  let [errorUpdatingUserInDB] = await to(updateDoc(userDbRef, { ...newUserData }));
  if (errorUpdatingUserInDB) {
    dispatch(createFireStoreError("Error updating user data info", errorUpdatingUserInDB));
    return "ERROR";
  }
  return "EDITED";
}

export const getUserDocFS = async (userId, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let [errorGettingUserDoc, userDoc] = await to(getDoc(userInDBRef));
  if (errorGettingUserDoc) {
    dispatch(createFireStoreError("Error buscando un Usuario: ", errorGettingUserDoc));
    return "ERROR";
  }
  return userDoc;
}

export const updateUserDocPostLoginFS = async (userId, userDoc, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let userDocData = userDoc.data();
  let date = new Date();
  let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
  userDocData.lastTimeSignedInString = lastTimeSignedInString;
  userDocData.lastTimeSignedIn = date.getTime();

  let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
  if (errorUpdatingUserSignIn) {
    dispatch(createFireStoreError("Error al actualizar al usuario. Intente nuevamente.", errorUpdatingUserSignIn));
    return "ERROR";
  };
  return userDocData;
}

export const getElements = async (userId, typeOfElement, dispatch, limitNumber) => {
  const elementsDbFromUserRef = query(collection(db, typeOfElement), where("ownerId", "==", userId),
    orderBy("lastUpdateTS", "desc"), limit(limitNumber));
  let [errorGettingElementsFromUser, elementsFromUserSnapshot] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) {
    dispatch(createFireStoreError(`Error obteniendo los elementos de la colección ${typeOfElement}.`, errorGettingElementsFromUser));
    return "ERROR";
  }

  let elementsFromUser = [];
  elementsFromUserSnapshot.forEach(elementDoc => {
    elementsFromUser.push(elementDoc.data());
  });

  return elementsFromUser;
}

export const getElementsAdminDev = async (userId, typeOfElement, dispatch, limitNumber) => {

  if (!collectionsWithActivities.includes(typeOfElement)) return;

  const elementsDbFromUserRef = query(collection(db, typeOfElement), where("lastUpdateTS", ">", Date.now() - getCantDaysInMS(7)),
    orderBy("lastUpdateTS", "desc"), limit(limitNumber));
  let [errorGettingElementsFromUser, elementQuerySnap] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) {
    dispatch(createFireStoreError(`Error obteniendo los elementos de la colección ${typeOfElement} siendo admin.`, errorGettingElementsFromUser));
    return "ERROR";
  }

  let elementsFromUser = [];
  elementQuerySnap.forEach(elementDoc => {
    elementsFromUser.push(elementDoc.data());
  });

  return elementsFromUser;
}


// Siempre que creo un Artista, tambien actualizare el documento del Usuario que creo el Artista.
// Elements es: LABEL, ARTIST, TRACK, ALBUMS. ARTISTS_INVITED, COLLABORATORS
export const createElementFS = async (element, elementId, userId, collection, fieldToIncrementInUserStats, amountToIncrement, dispatch) => {
  if (!elementId) return "ERROR";

  const elementDbRef = doc(db, collection, elementId);

  let [errorCreatingElement] = await to(setDoc(elementDbRef, element))
  if (errorCreatingElement) {
    dispatch(createFireStoreError(`Error creando nuevo elemento en la colección ${collection}.`, errorCreatingElement));
    return "ERROR";
  }

  await updateStatsOfCollection(collection, amountToIncrement, dispatch);
  await updateStatsOfUserDoc(userId, fieldToIncrementInUserStats, amountToIncrement, dispatch);

  await addActivityFS(collection, userId, element, "create", dispatch);

  return "SUCCESS";
}

const getBasicInfoElement = (element, collection) => {
  if (collection === "albums") return element.title;
  if (collection === "labels" || collection === "artists") return element.name;
  return "";
}

const addActivityFS = async (collection, ownerId, element, typeOfAction, dispatch) => {
  if (!collectionsWithActivities.includes(collection)) return;
  let activity = {
    action: typeOfAction, target: collection, targetId: element.id,
    ownerId, targetName: getBasicInfoElement(element, collection), lastUpdateTS: new Date().getTime()
  };

  const newActivityDbRef = doc(db, "usersActivity", uuidv4());
  let [errorCreatingActivity] = await to(setDoc(newActivityDbRef, activity))
  if (errorCreatingActivity) {
    dispatch(createFireStoreError(`Error creando nueva actividad`, errorCreatingActivity));
    return "ERROR";
  }

  await updateStatsOfCollection("usersActivity", 1, dispatch);

  return "SUCCESS";
}

// Elements es: LABEL, ARTIST, TRACK, ALBUMS.
export const deleteElementFS = async (element, elementId, userId, collection, fieldToDecrementInUserStats, amountToDecrement, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);

  let [errorDeletingElementInCollection] = await to(deleteDoc(elementDbRef));
  if (errorDeletingElementInCollection) {
    console.log(`Error deleting element in ${collection} collection`, errorDeletingElementInCollection);
    throw new Error({ msg: `Error deleting new element in ${collection} collection`, error: errorDeletingElementInCollection });
  }

  await updateStatsOfCollection(collection, amountToDecrement, dispatch)
  await updateStatsOfUserDoc(userId, fieldToDecrementInUserStats, amountToDecrement, dispatch);
  await updateStatsOfUserDoc(userId, `${fieldToDecrementInUserStats}Deleted`, (-1) * amountToDecrement, dispatch);

  await addActivityFS(collection, userId, element, "delete", dispatch);
}

export const deleteAllTracksFromAlbumIdFS = async (albumId, userId, dispatch) => {
  const batch = writeBatch(db);
  const allTracksFromAlbumIdRef = query(collection(db, "tracks"), where("albumId", "==", albumId));

  let [errorGettingAllTracks, tracksSnapshot] = await to(getDocs(allTracksFromAlbumIdRef));
  if (errorGettingAllTracks) {
    dispatch(createFireStoreError("Error obteniendo los tracks del Album a eliminar.", errorGettingAllTracks));
    return "ERROR";
  }

  if (tracksSnapshot.empty) return "NO HAY TRACKS A ELIMINAR";

  let cantTracksToDelete = 0;
  tracksSnapshot.forEach(trackDoc => {
    cantTracksToDelete++;
    batch.delete(trackDoc.ref)
  });

  let [errorDeletingAllTracks] = await to(batch.commit());
  if (errorDeletingAllTracks) {
    dispatch(createFireStoreError("Error eliminando los tracks del Album. ", errorDeletingAllTracks));
    return "ERROR";
  }

  await updateStatsOfCollection("tracks", (-1) * cantTracksToDelete, dispatch);
  await updateStatsOfUserDoc(userId, "totalTracks", (-1) * cantTracksToDelete, dispatch);
  await updateStatsOfUserDoc(userId, "totalTracksDeleted", cantTracksToDelete, dispatch);

  return "SUCCESS";
}

export const updateStatsOfCollection = async (targetCollection, amount, dispatch) => {
  const elementStatsDbRef = doc(db, targetCollection, "stats");
  let [errorUpdatingStatsInCollection] = await to(updateDoc(elementStatsDbRef, { total: increment(amount) }));
  if (errorUpdatingStatsInCollection) {
    dispatch(createFireStoreError(`Error actualizando stats en ${targetCollection}`, errorUpdatingStatsInCollection));
    return "ERROR";
  }
}

export const updateStatsOfUserDoc = async (targetUserId, targetStat, amount, dispatch) => {
  if (targetStat === "") return;
  const usersDbRef = doc(db, "users", targetUserId);
  let [errorUpdatingStatsInUser] = await to(updateDoc(usersDbRef, { [`stats.${targetStat}`]: increment(amount) }));
  if (errorUpdatingStatsInUser) {
    dispatch(createFireStoreError(`Error actualizando las estadísticas en el usuario.`, errorUpdatingStatsInUser));
    return "ERROR";
  };
}

// Elements es: ARTIST, TRACK, ALBUMS.
export const updateElementFS = async (oldArtistData, newElementFields, elementId, collection, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);

  let [errorUpdatingElementInCollection] = await to(updateDoc(elementDbRef, { ...newElementFields }));
  if (errorUpdatingElementInCollection) {
    console.log(`Error updating element in ${collection} collection`, errorUpdatingElementInCollection);
    throw new Error({ msg: `Error updating new element in ${collection} collection`, error: errorUpdatingElementInCollection });
  }

  await addActivityFS(collection, oldArtistData.ownerId, { ...oldArtistData, ...newElementFields }, "update", dispatch);
}

export const getElementsBORRAR = async (userId, typeOfElement, dispatch) => {
  const elementsDbFromUserRef = query(collection(db, typeOfElement), where("ownerId", "==", userId));
  let [errorGettingElementsFromUser, elementsFromUserSnapshot] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) {
    dispatch(createFireStoreError(`Error obteniendo los elementos de la colección ${typeOfElement}.`, errorGettingElementsFromUser));
    return "ERROR";
  }

  let elementsFromUser = [];
  elementsFromUserSnapshot.forEach(albumDoc => {
    elementsFromUser.push(albumDoc.data());
  });

  return elementsFromUser;
}


export const userByEmailInFS = async (email, dispatch) => {
  const userByEmailDbRef = query(collection(db, "usersByEmail"), where("email", "==", email));
  let [errorGettingUserByEmail, userByEmailSnap] = await to(getDocs(userByEmailDbRef));
  if (errorGettingUserByEmail) return false;
  if (userByEmailSnap.empty) return false;

  let exists = false;
  userByEmailSnap.forEach(userDoc => {
    exists = userDoc.exists();
  })

  return exists;
}

export const createUserDocs = async (newUserData, dispatch) => {
  const { id, email, userInWp } = newUserData;
  let userDataComplete = createUserDocItem(newUserData, userInWp);

  let [errorCreatingDocInUsers] = await to(createElementFS(userDataComplete, id, id, "users", "", 1, dispatch));
  if (errorCreatingDocInUsers) return "ERROR";
  let [resultCreatingDocInUserEmails] = await to(createElementFS(userDataComplete, email, "", "usersByEmail", "", 1, dispatch));
  if (resultCreatingDocInUserEmails === "ERROR") return "ERROR";
  return userDataComplete;
}

export const getAmountOfIsrcCodesToUseFS = async (amountOfIsrcs, dispatch) => {
  const batch = writeBatch(db);

  const isrcsDbRef = query(collection(db, "isrcs"), where("used", "==", false), limit(amountOfIsrcs));
  let [errorGettingIsrcs, isrcsSnapshot] = await to(getDocs(isrcsDbRef));
  if (errorGettingIsrcs) {
    dispatch(createFireStoreError("Error obteniendo los ISRC.", errorGettingIsrcs));
    return "ERROR";
  }

  if (isrcsSnapshot.empty) {
    dispatch(createFireStoreError("No hay ISRCS disponibles. Contactar a soporte."));
    return "ISRCS NO DISPONIBLES";
  }

  let isrcs = [];
  isrcsSnapshot.forEach(isrcDoc => {
    isrcs.push(isrcDoc.data().isrc);
    batch.update(isrcDoc.ref, { used: true })
  });

  let [errorUpdatingIsrcsStates] = await to(batch.commit());
  if (errorUpdatingIsrcsStates) {
    dispatch(createFireStoreError("Error actualizando los isrcs ya usados. ", errorUpdatingIsrcsStates));
    return "ERROR";
  }

  return isrcs;
}

export const createSubgenreInUserDocFS = async (subgenre, userId, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { subgenerosPropios: arrayUnion(subgenre) }));
  if (errorUpdatingUserSignIn) {
    dispatch(createFireStoreError("Error al actualizar al usuario. Intente nuevamente.", errorUpdatingUserSignIn));
    return "ERROR";
  };
}