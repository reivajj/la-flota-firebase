import firebaseApp from 'firebaseConfig/firebase.js';
import { getFirestore, updateDoc, doc, setDoc, arrayUnion, query, collection, getDocs, where, increment } from "firebase/firestore";
import { to } from 'utils';
import { createFireStoreError } from 'redux/actions/ErrorHandlerActions';

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
export const createElementFS = async (element, userId, collection, fieldToIncrementInUserStats, amountToIncrement, dispatch) => {
  const elementDbRef = doc(db, collection, element.id);

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

// Siempre que creo un Sello, tambien actualizare el documento del Usuario que creo el Sello.
export const createLabel = async (label, userId) => {
  const labelsDbRef = doc(db, "labels", label.id);
  let [errorCreatingLabelInLabelsCollection] = await to(setDoc(labelsDbRef, label));
  if (errorCreatingLabelInLabelsCollection) {
    console.log("Error al crear al Sello en la DB, coleccion de labels: ", errorCreatingLabelInLabelsCollection);
    throw new Error({ msg: "Error al crear al Sello en la DB, coleccion de labels: ", error: errorCreatingLabelInLabelsCollection });
  }

  const usersDbRef = doc(db, "users", userId);
  let [errorCreatingLabelInUser] = await to(updateDoc(usersDbRef, { labels: arrayUnion(label) }));
  if (errorCreatingLabelInUser) {
    console.log("Error al agregar al Sello en la DB, coleccion del users: ", errorCreatingLabelInUser);
    throw new Error({ msg: "Error al agregar al Sello en la DB, coleccion del users: ", error: errorCreatingLabelInUser });
  }
}

export const createAlbum = async (album, userId) => {
  const albumsDbRef = doc(db, "albums", album.id);
  let [errorCreatingAlbumInAlbumsCollection] = await to(setDoc(albumsDbRef, album));
  if (errorCreatingAlbumInAlbumsCollection) {
    console.log("Error al crear al Album en la DB, coleccion de albums: ", errorCreatingAlbumInAlbumsCollection);
    throw new Error({ msg: "Error al crear al Album en la DB, coleccion de albums: ", error: errorCreatingAlbumInAlbumsCollection });
  }

  const usersDbRef = doc(db, "users", userId);
  let [errorCreatingAlbumInUser] = await to(updateDoc(usersDbRef, { albums: arrayUnion(album) }));
  if (errorCreatingAlbumInUser) {
    console.log("Error al agregar al Album en la DB, coleccion del users: ", errorCreatingAlbumInUser);
    throw new Error({ msg: "Error al agregar al Album en la DB, coleccion del users: ", error: errorCreatingAlbumInUser });
  };
}

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