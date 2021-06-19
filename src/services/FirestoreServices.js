import firebase from 'firebaseConfig/firebase.js';

const db = firebase.firestore();

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

// Siempre que creo un Artista, tambien actualizare el documento del Usuario que creo el Artista.
export const createArtist = async (artist, userId) => {
  let [errorCreatingArtistInArtistsCollection] = await to(db.collection('artists').doc(artist.id).set(artist));
  if (errorCreatingArtistInArtistsCollection) console.log("Error al crear al artista en la DB, coleccion de artistas: ", errorCreatingArtistInArtistsCollection);

  let [errorCreatingArtistInUser] = await to(db.collection('users').doc(userId).update({ artists: firebase.firestore.FieldValue.arrayUnion(artist) }));
  if (errorCreatingArtistInUser) console.log("Error al agregar al artista en la DB, coleccion del users: ", errorCreatingArtistInUser);
}

// Siempre que creo un Sello, tambien actualizare el documento del Usuario que creo el Sello.
export const createLabel = async (label, userId) => {
  let [errorCreatingLabelInLabelsCollection] = await to(db.collection('labels').doc(label.id).set(label));
  if (errorCreatingLabelInLabelsCollection) console.log("Error al crear al Sello en la DB, coleccion de labels: ", errorCreatingLabelInLabelsCollection);

  let [errorCreatingLabelInUser] = await to(db.collection('users').doc(userId).update({ labels: firebase.firestore.FieldValue.arrayUnion(label) }));
  if (errorCreatingLabelInUser) console.log("Error al agregar al Sello en la DB, coleccion del users: ", errorCreatingLabelInUser);
}