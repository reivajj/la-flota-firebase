import {
  USER_DATA_SIGN_IN, USER_DATA_SIGN_OUT, USER_DATA_ADD_IMAGE
} from 'redux/actions/Types';
import firebase from '../../firebaseConfig/firebase';
import { USER_DATA_ADD_ARTIST } from 'redux/actions/Types';

const db = firebase.firestore();

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

// ACTION CREATORS
export const userDataSignIn = userInfo => {
  return {
    type: USER_DATA_SIGN_IN,
    payload: userInfo
  };
};

export const userDataSignOut = () => {
  return {
    type: USER_DATA_SIGN_OUT
  };
};

export const userDataAddImage = (urlImage) => {
  return {
    type: USER_DATA_ADD_IMAGE,
    payload: urlImage
  };
};

export const editPerfil = () => {
  return async () => {
    return console.log("error");
  }
};

export const userDataCreateArtist = (artist, userId) => {
  return async (dispatch) => {
    console.log("creando artista: ", artist);
    let id = Math.random().toString(36).substr(2, 15);
    artist.id = id;

    let [errorCreatingArtistInArtistsCollection, artistSnapshot] = await to(db.collection('artists').doc(id).set(artist));
    if (errorCreatingArtistInArtistsCollection) console.log("Error al crear al artista en la DB: ", errorCreatingArtistInArtistsCollection);

    let [errorCreatingArtistInUser] = await to(db.collection('users').doc(userId).update({ artists: firebase.firestore.FieldValue.arrayUnion(artist) }));
    if (errorCreatingArtistInUser) console.log("Error al crear al artista en la DB: ", errorCreatingArtistInUser);

    return dispatch({
      type: USER_DATA_ADD_ARTIST,
      payload: artist
    })
  } 
}