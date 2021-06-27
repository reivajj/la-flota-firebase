import * as ReducerTypes from 'redux/actions/Types';

const checkNewArtists = (oldArtists, artists) => {
  return artists.filter(artist => !oldArtists.map(oldArtist => oldArtist.id).includes(artist.id))
}

const initialState = {
  artists: []
}

const ArtistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_ARTISTS:
      const newArtists = checkNewArtists(state.artists, action.payload);
      return { ...state, artists: [...state.artists, ...newArtists] }
    case ReducerTypes.ARTISTS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default ArtistsReducer;