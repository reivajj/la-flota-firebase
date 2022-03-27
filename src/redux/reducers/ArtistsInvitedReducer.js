import * as ReducerTypes from 'redux/actions/Types';

const filterArtistsWithSameIdThanNewOne = (oldArtists, addedArtists) => {
  if (!addedArtists) return oldArtists;
  return oldArtists.filter(artist => !addedArtists.map(addedArtist => addedArtist.id).includes(artist.id));
}

const editAndAddArtist = (oldArtists, editedFieldsFromArtist) => {
  return oldArtists.map(oldArtist => {
    if (oldArtist.id === editedFieldsFromArtist.id) return { ...oldArtist, ...editedFieldsFromArtist };
    else return oldArtist;
  })
}

const initialState = [];

const ArtistsInvitedReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.INVITED_ARTISTS_ADD:
      const oldUniqueArtistsInvited = filterArtistsWithSameIdThanNewOne(state, action.payload);
      return [...oldUniqueArtistsInvited, ...action.payload]

    case ReducerTypes.INVITED_ARTIST_EDIT_WITH_ID:
      return editAndAddArtist(state, action.payload);

    case ReducerTypes.INVITED_ARTIST_DELETE_WITH_ID:
      return state.filter(artist => artist.id !== action.payload);

    case ReducerTypes.INVITED_ARTISTS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default ArtistsInvitedReducer;