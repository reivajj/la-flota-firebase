import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import { addArtistsInvited } from './ArtistsInvitedActions';
import { addCollaborators } from './CollaboratorsActions';

// ACTION CREATORS
export const userDataSignIn = (userInfo, albums, artists, labels, invitedArtists, collaborators) => async dispatch => {
  console.log("INVITED ARTISTS: ", invitedArtists);
  dispatch({
    type: ReducerTypes.USER_DATA_SIGN_IN,
    payload: userInfo
  });

  dispatch({
    type: ReducerTypes.ADD_ARTISTS,
    payload: artists
  });

  dispatch({
    type: ReducerTypes.ADD_ALBUMS,
    payload: albums
  });

  dispatch({
    type: ReducerTypes.ADD_LABELS,
    payload: labels
  });

  dispatch(addArtistsInvited(invitedArtists));
  dispatch(addCollaborators(collaborators));

  return;

};

export const userDataSignOut = () => async dispatch => {
  dispatch({
    type: ReducerTypes.USER_DATA_SIGN_OUT
  })

  dispatch({
    type: ReducerTypes.ARTISTS_SIGN_OUT
  })

  dispatch({
    type: ReducerTypes.ALBUMS_SIGN_OUT
  })

  dispatch({
    type: ReducerTypes.LABELS_SIGN_OUT
  })

  dispatch({
    type: ReducerTypes.TRACKS_SIGN_OUT
  })

  dispatch({
    type: ReducerTypes.INVITED_ARTISTS_SIGN_OUT
  })
};

export const userDataAddImage = (urlImage) => {
  return {
    type: ReducerTypes.USER_DATA_ADD_IMAGE,
    payload: urlImage
  };
};

export const editPerfil = newProfile => async dispatch => {
  // Si da error simplemente genero la notificacion.
  let resultEdit = await FirestoreServices.editUserDataWithOutCredentials(newProfile, dispatch);
  if (resultEdit === "EDITED") {
    dispatch({
      type: ReducerTypes.USER_DATA_EDIT_PERFIL,
      payload: newProfile
    })
    return "success";
  }
};
