import firebaseApp from 'firebaseConfig/firebase.js';
import { getFirestore, updateDoc, doc, setDoc, arrayUnion, query, collection, getDocs, where } from "firebase/firestore";

const db = getFirestore(firebaseApp);

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

// Siempre que creo un Artista, tambien actualizare el documento del Usuario que creo el Artista.
export const createArtist = async (artist, userId) => {
  const artistDbRef = doc(db, "artists", artist.id);
  let [errorCreatingArtistInArtistsCollection] = await to(setDoc(artistDbRef, artist));
  if (errorCreatingArtistInArtistsCollection) {
    console.log("Error al crear al artista en la DB, coleccion de artistas: ", errorCreatingArtistInArtistsCollection);
    throw new Error({ msg: "Error al crear al artista en la DB, coleccion de artistas: ", error: errorCreatingArtistInArtistsCollection });
  }

  const usersDbRef = doc(db, "users", userId);
  let [errorCreatingArtistInUser] = await to(updateDoc(usersDbRef, { artists: arrayUnion(artist) }));
  if (errorCreatingArtistInUser) {
    console.log("Error al agregar al artista en la DB, coleccion del users: ", errorCreatingArtistInUser);
    throw new Error({ msg: "Error al agregar al artista en la DB, coleccion del users: ", error: errorCreatingArtistInUser });
  };
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

export const getAlbums = async userId => {
  const albumsDbFromUserRef = query(collection(db, "albums"), where("ownerId", "==", userId));
  let [errorGettingAlbumsFromUser, albumsFromUserSnapshot] = await to(getDocs(albumsDbFromUserRef));
  if (errorGettingAlbumsFromUser) console.log("Error getting user albums: ", errorGettingAlbumsFromUser);

  let albumsFromUser = [];
  albumsFromUserSnapshot.forEach(albumDoc => {
    albumsFromUser.push(albumDoc.data());
  });

  return albumsFromUser;
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