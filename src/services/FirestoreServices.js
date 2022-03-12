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
import { writeCloudLog } from './LoggingService';

const db = getFirestore(firebaseApp);

const collectionsWithActivities = ["artists", "albums", "labels", "users"];

//==============================================USERS=======================================================\\

export const editUserDataWithOutCredentials = async (newUserData, dispatch) => {
  if (!newUserData.id) return "ERROR";
  const userDbRef = doc(db, "users", newUserData.id);
  let [errorUpdatingUserInDB] = await to(updateDoc(userDbRef, { ...newUserData }));
  if (errorUpdatingUserInDB) {
    dispatch(createFireStoreError("Error updating user data info", errorUpdatingUserInDB));
    writeCloudLog("FS Error updating user without credentials", newUserData, errorUpdatingUserInDB, "error");
    return "ERROR";
  }
  return "EDITED";
}

export const getUserDocFS = async (userId, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let [errorGettingUserDoc, userDoc] = await to(getDoc(userInDBRef));
  if (errorGettingUserDoc) {
    dispatch(createFireStoreError("Error buscando un Usuario: ", errorGettingUserDoc));
    writeCloudLog("FS Error getting user", userId, errorGettingUserDoc, "error");
    return "ERROR";
  }
  return userDoc;
}

export const updateUserDocPostLoginFS = async (userId, userDoc, password, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let userDocData = userDoc.data();
  let date = new Date();
  let lastTimeSignedInString = date.toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
  userDocData.lastTimeSignedInString = lastTimeSignedInString;
  userDocData.lastTimeSignedIn = date.getTime();

  let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { password, lastTimeSignedIn: date.getTime(), lastTimeSignedInString }));
  if (errorUpdatingUserSignIn) {
    dispatch(createFireStoreError("Error al actualizar al usuario. Intente nuevamente.", errorUpdatingUserSignIn));
    writeCloudLog("FS Error getting user doc post login", userId, errorUpdatingUserSignIn, "error");
    return "ERROR";
  };
  return userDocData;
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

export const getUserDataByEmailInFS = async (email, dispatch) => {
  const userByEmailDbRef = query(collection(db, "users"), where("email", "==", email));
  let [errorGettingUserByEmail, userByEmailSnap] = await to(getDocs(userByEmailDbRef));
  if (errorGettingUserByEmail) return false;
  if (userByEmailSnap.empty) return false;

  let result = {};
  userByEmailSnap.forEach(userDoc => {
    result = userDoc.data()
  })

  return result;
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

//===================================================ELEMENTS=========================================================\\

export const getElements = async (userId, typeOfElement, dispatch, limitNumber) => {
  const elementsDbFromUserRef = query(collection(db, typeOfElement), where("ownerId", "==", userId),
    orderBy("lastUpdateTS", "desc"), limit(limitNumber));
  let [errorGettingElementsFromUser, elementsFromUserSnapshot] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) {
    dispatch(createFireStoreError(`Error obteniendo los elementos de la colección ${typeOfElement}.`, errorGettingElementsFromUser));
    writeCloudLog("FS Error getting elements", { userId, typeOfElement }, errorGettingElementsFromUser, "error");
    return "ERROR";
  }

  let elementsFromUser = [];
  elementsFromUserSnapshot.forEach(elementDoc => {
    elementsFromUser.push(elementDoc.data());
  });

  return elementsFromUser;
}

// Acepta USERS tambien.
export const getElementsByField = async (typeOfElement, searchField, fieldValue, dispatch, limitNumber) => {
  const elementsDbFromUserRef = query(collection(db, typeOfElement), where(searchField, "==", fieldValue),
    orderBy(typeOfElement !== "users" ? "lastUpdateTS" : "email", "desc"), limit(limitNumber));

  let [errorGettingElementsFromUser, elementsFromUserSnapshot] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) {
    dispatch(createFireStoreError(`Error obteniendo los elementos de la colección ${typeOfElement}.`, errorGettingElementsFromUser));
    writeCloudLog(`FS Error getting elements by field: ${searchField} and value: ${fieldValue}`
      , { fieldValue, searchField, typeOfElement }, errorGettingElementsFromUser, "error");
    return "ERROR";
  }
  if (elementsFromUserSnapshot.empty) return "EMPTY";

  let elementsFromUser = [];
  elementsFromUserSnapshot.forEach(elementDoc => {
    elementsFromUser.push(elementDoc.data());
  });

  return elementsFromUser;
}

export const getElementsAdminDev = async (userDataFromDB, userId, typeOfElement, dispatch, limitNumber) => {
  let elementsDbFromUserRef = {};
  let searchByField = typeOfElement === "users" ? "timestampWhenCreatedUserInFB" : "lastUpdateTS";

  if (userDataFromDB.rol.indexOf("index") >= 0 && userId !== "") {
    console.log("ENTRANDO COMO USUARIO: ", userDataFromDB, "/ USER ID: ", userId);
    elementsDbFromUserRef = query(collection(db, typeOfElement), where("ownerId", "==", userId),
      orderBy("lastUpdateTS", "desc"), limit(limitNumber));
  }
  else elementsDbFromUserRef = query(collection(db, typeOfElement), where(searchByField, ">", Date.now() - getCantDaysInMS(7)),
    orderBy(searchByField, "desc"), limit(limitNumber));

  if (!collectionsWithActivities.includes(typeOfElement)) return;

  let [errorGettingElementsFromUser, elementQuerySnap] = await to(getDocs(elementsDbFromUserRef));
  if (errorGettingElementsFromUser) {
    dispatch(createFireStoreError(`Error obteniendo los elementos de la colección ${typeOfElement} siendo admin.`, errorGettingElementsFromUser));
    writeCloudLog("FS Error getting admin elements", { userId, typeOfElement }, errorGettingElementsFromUser, "error");
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
    writeCloudLog("FS Error creating elements", { userId, element, collection }, errorCreatingElement, "error");
    return "ERROR";
  }

  await updateStatsOfCollection(collection, amountToIncrement, dispatch);
  await updateStatsOfUserDoc(userId, fieldToIncrementInUserStats, amountToIncrement, dispatch);

  await addActivityFS(collection, userId, element, "create", dispatch);

  return "SUCCESS";
}

export const updateElementFS = async (oldData, newElementFields, elementId, collection, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);
  console.log("UPDATE FIRESTORE: ", { oldData, newElementFields, elementId, collection });
  let [errorUpdatingElementInCollection] = await to(updateDoc(elementDbRef, {
    ...newElementFields,
    lastUpdateTS: new Date().getTime()
  }));
  if (errorUpdatingElementInCollection) {
    dispatch(createFireStoreError(`Error actualizando elemento`, errorUpdatingElementInCollection));
    writeCloudLog("FS Error creating elements", { oldData, newElementFields, elementId, collection }, errorUpdatingElementInCollection, "error");
    return "ERROR";
  }

  await addActivityFS(collection, oldData.ownerId, { ...oldData, ...newElementFields }, "update", dispatch);
}

// Elements es: LABEL, ARTIST, TRACK, ALBUMS.
export const deleteElementFS = async (element, elementId, userId, collection, fieldToDecrementInUserStats, amountToDecrement, dispatch) => {
  const elementDbRef = doc(db, collection, elementId);

  let [errorDeletingElementInCollection] = await to(deleteDoc(elementDbRef));
  if (errorDeletingElementInCollection) {
    dispatch(createFireStoreError(`Error eliminando un elemento`, errorDeletingElementInCollection));
    writeCloudLog("FS Error deleting element", { userId, element, collection }, errorDeletingElementInCollection, "error");
  }

  await updateStatsOfCollection(collection, amountToDecrement, dispatch)
  await updateStatsOfUserDoc(userId, fieldToDecrementInUserStats, amountToDecrement, dispatch);
  await updateStatsOfUserDoc(userId, `${fieldToDecrementInUserStats}Deleted`, (-1) * amountToDecrement, dispatch);

  await addActivityFS(collection, userId, element, "delete", dispatch);
}

const getBasicInfoElement = (element, collection) => {
  if (collection === "albums") return element.title;
  if (collection === "labels" || collection === "artists") return element.name;
  return "";
}

export const getElementsAdminQueryFS = (targetCollection, limitNumber, lastAlbumUpdatedInTS) => {
  const elementsDbRef = query(collection(db, targetCollection), where("lastUpdateTS", ">", lastAlbumUpdatedInTS),
    orderBy("lastUpdateTS", "desc"), limit(limitNumber));
  return elementsDbRef;
}

//====================================================ACTIVITY================================================================\\

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
    writeCloudLog("FS Error creating elements", { ownerId, collection, element }, errorCreatingActivity, "error");
    return "ERROR";
  }

  await updateStatsOfCollection("usersActivity", 1, dispatch);

  return "SUCCESS";
}

//============================================================TRACKS==================================================================\\

export const deleteAllTracksFromAlbumIdFS = async (albumId, userId, dispatch) => {
  const batch = writeBatch(db);
  const allTracksFromAlbumIdRef = query(collection(db, "tracks"), where("albumId", "==", albumId));

  let [errorGettingAllTracks, tracksSnapshot] = await to(getDocs(allTracksFromAlbumIdRef));
  if (errorGettingAllTracks) {
    dispatch(createFireStoreError("Error obteniendo los tracks del Lanzamiento a eliminar.", errorGettingAllTracks));
    writeCloudLog("FS Error getting all tracks from album to delete", { userId, albumId, collection }, errorGettingAllTracks, "error");
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
    dispatch(createFireStoreError("Error eliminando los tracks del Lanzamiento. ", errorDeletingAllTracks));
    writeCloudLog("FS Error deleting all tracks from album", { userId, albumId, collection }, errorDeletingAllTracks, "error");
    return "ERROR";
  }

  await updateStatsOfCollection("tracks", (-1) * cantTracksToDelete, dispatch);
  await updateStatsOfUserDoc(userId, "totalTracks", (-1) * cantTracksToDelete, dispatch);
  await updateStatsOfUserDoc(userId, "totalTracksDeleted", cantTracksToDelete, dispatch);

  return "SUCCESS";
}

//===========================================================STATS============================================================================\\
export const updateStatsOfCollection = async (targetCollection, amount, dispatch) => {
  const elementStatsDbRef = doc(db, targetCollection, "stats");
  let [errorUpdatingStatsInCollection] = await to(updateDoc(elementStatsDbRef, { total: increment(amount) }));
  if (errorUpdatingStatsInCollection) {
    dispatch(createFireStoreError(`Error actualizando stats en ${targetCollection}`, errorUpdatingStatsInCollection));
    writeCloudLog("FS Error updating stats of collection", { targetCollection, amount, collection }, errorUpdatingStatsInCollection, "error");

    return "ERROR";
  }
}

export const updateStatsOfUserDoc = async (targetUserId, targetStat, amount, dispatch) => {
  if (targetStat === "") return;
  const usersDbRef = doc(db, "users", targetUserId);
  let [errorUpdatingStatsInUser] = await to(updateDoc(usersDbRef, { [`stats.${targetStat}`]: increment(amount) }));
  if (errorUpdatingStatsInUser) {
    dispatch(createFireStoreError(`Error actualizando las estadísticas en el usuario.`, errorUpdatingStatsInUser));
    writeCloudLog("FS Error updating stats of user", { targetUserId, targetStat, amount }, errorUpdatingStatsInUser, "error");
    return "ERROR";
  };
}


//==============================================================ISRCS=================================================================\\

export const getAmountOfIsrcCodesToUseFS = async (amountOfIsrcs, dispatch) => {
  if (amountOfIsrcs === 0) return [];
  const batch = writeBatch(db);

  const isrcsDbRef = query(collection(db, "isrcs"), where("used", "==", false), orderBy("isrc", "asc"), limit(amountOfIsrcs));
  let [errorGettingIsrcs, isrcsSnapshot] = await to(getDocs(isrcsDbRef));
  if (errorGettingIsrcs) {
    dispatch(createFireStoreError("Error obteniendo los ISRC.", errorGettingIsrcs));
    writeCloudLog("FS Error getting ISRCS", amountOfIsrcs, errorGettingIsrcs, "error");
    return "ERROR";
  }

  if (isrcsSnapshot.empty) {
    dispatch(createFireStoreError("No hay ISRCS disponibles. Contactar a soporte."));
    writeCloudLog("FS Error ISRCS empty", amountOfIsrcs, "NO MORE ISRCS", "error");
    return "ISRCS NO DISPONIBLES";
  }

  let isrcs = [];
  isrcsSnapshot.forEach(isrcDoc => {
    isrcs.push(isrcDoc.data().isrc);
    batch.update(isrcDoc.ref, { used: true });
  });

  let [errorUpdatingIsrcsStates] = await to(batch.commit());
  if (errorUpdatingIsrcsStates) {
    dispatch(createFireStoreError("Error actualizando los isrcs ya usados. ", errorUpdatingIsrcsStates));
    writeCloudLog("FS Error updating ISRCS state", amountOfIsrcs, errorUpdatingIsrcsStates, "error");
    return "ERROR";
  }

  return isrcs;
}

//========================================================MISCELLANEUS======================================================\\

export const createSubgenreInUserDocFS = async (subgenre, userId, dispatch) => {
  let userInDBRef = doc(db, "users", userId);
  let [errorUpdatingUserSignIn] = await to(updateDoc(userInDBRef, { subgenerosPropios: arrayUnion(subgenre) }));
  if (errorUpdatingUserSignIn) {
    dispatch(createFireStoreError("Error al actualizar al usuario. Intente nuevamente.", errorUpdatingUserSignIn));
    writeCloudLog("FS Error getting ISRCS", { subgenre, userId }, errorUpdatingUserSignIn, "error");
    return "ERROR";
  };
}
