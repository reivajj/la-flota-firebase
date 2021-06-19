import * as ReducerTypes from 'redux/actions/Types';

// ACTION CREATORS
export const userDataSignIn = userInfo => {
  return async (dispatch) => {

    dispatch({
      type: ReducerTypes.USER_DATA_SIGN_IN,
      payload: userInfo
    })

    dispatch({
      type: ReducerTypes.ADD_ARTISTS,
      payload: userInfo.artists
    })

    dispatch({
      type: ReducerTypes.ADD_ALBUMS,
      payload: userInfo.albums
    })

    dispatch({
      type: ReducerTypes.ADD_LABELS,
      payload: userInfo.labels
    })

  };
};

export const userDataSignOut = () => {
  return async (dispatch) => {

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
  };
};

export const userDataAddImage = (urlImage) => {
  return {
    type: ReducerTypes.USER_DATA_ADD_IMAGE,
    payload: urlImage
  };
};

export const editPerfil = () => {
  return async () => {
    return console.log("error");
  };
};
