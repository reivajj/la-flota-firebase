import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import { addArtistsInvited, invitedArtistSignOut } from './ArtistsInvitedActions';
import { addCollaborators, collaboratorsSignOut } from './CollaboratorsActions';
import { albumsAddStore } from './AlbumsActions';
import { labelsAddStore } from './LabelsActions';
import { artistsAddStore } from './ArtistsActions';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { activitiesAddStore, activitiesSignOut } from './ActivitiesActions';
import { usersAddStore, usersSignOut } from './UsersActions';
import { payoutsAddStore } from './PayoutsActions';

export const userDataAddInfoStore = userInfo => {
  return {
    type: ReducerTypes.USER_DATA_SIGN_IN,
    payload: userInfo
  }
}

// ACTION CREATORS
export const userDataSignIn = (userInfo, albums, users, artists, labels, invitedArtists, collaborators, activities, payouts) => async dispatch => {
  dispatch(userDataAddInfoStore(userInfo));
  dispatch(artistsAddStore(Array.isArray(artists) ? artists : []));
  dispatch(usersAddStore(Array.isArray(users) ? users : []));
  dispatch(albumsAddStore(Array.isArray(albums) ? albums : []));
  dispatch(labelsAddStore(Array.isArray(labels) ? labels : []));
  dispatch(addArtistsInvited(Array.isArray(invitedArtists) ? invitedArtists : []));
  dispatch(addCollaborators(Array.isArray(collaborators) ? collaborators : []));
  dispatch(activitiesAddStore(Array.isArray(activities) ? activities : []));
  dispatch(payoutsAddStore(Array.isArray(payouts) ? payouts : []));
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
  dispatch(usersSignOut());
  dispatch(activitiesSignOut());
};

export const userDataAddImage = (urlImage) => {
  return {
    type: ReducerTypes.USER_DATA_ADD_IMAGE,
    payload: urlImage
  };
};

export const userDataUpdateRedux = newProfile => async dispatch => {
  // Si da error simplemente genero la notificacion.
  let resultEdit = await FirestoreServices.editUserDataWithOutCredentials(newProfile, dispatch);
  if (resultEdit === "EDITED") {
    dispatch({
      type: ReducerTypes.USER_DATA_EDIT_PERFIL,
      payload: newProfile
    })
    return "SUCCESS";
  }
  else return "ERROR";
};

export const addSubgenreToUserStore = newSubgenreNameAndId => {
  return {
    type: ReducerTypes.USER_DATA_ADD_SUBGENERO,
    payload: newSubgenreNameAndId
  }
}

export const createSubgenreRedux = (newSubgenreName, userId) => async dispatch => {
  let subgenreFromFuga = await BackendCommunication.createSubgenreFuga(newSubgenreName, dispatch);
  if (subgenreFromFuga === "ERROR") return "ERROR";

  await FirestoreServices.createSubgenreInUserDocFS(subgenreFromFuga, userId);

  dispatch(addSubgenreToUserStore(subgenreFromFuga));
  return subgenreFromFuga;
}
