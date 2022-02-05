import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import { addArtistsInvited, invitedArtistSignOut } from './ArtistsInvitedActions';
import { addCollaborators, collaboratorsSignOut } from './CollaboratorsActions';
import { albumsAddStore } from './AlbumsActions';
import { labelsAddStore } from './LabelsActions';
import { artistsAddStore } from './ArtistsActions';

export const userDataAddInfoStore = userInfo => {
  return {
    type: ReducerTypes.USER_DATA_SIGN_IN,
    payload: userInfo
  }
}

// ACTION CREATORS
export const userDataSignIn = (userInfo, albums, artists, labels, invitedArtists, collaborators) => async dispatch => {
  dispatch(userDataAddInfoStore(userInfo));
  dispatch(artistsAddStore(artists));
  dispatch(albumsAddStore(albums));
  dispatch(labelsAddStore(labels));
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

  dispatch(invitedArtistSignOut());
  dispatch(collaboratorsSignOut());
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
