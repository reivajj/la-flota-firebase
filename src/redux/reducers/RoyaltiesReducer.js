import * as ReducerTypes from 'redux/actions/Types';

const filterArtistsWithSameIdThanNewOne = (oldArtists, addedArtists) => {
  if (!Array.isArray(addedArtists) || addedArtists.length === 0) return oldArtists;
  return oldArtists.filter(artist => !addedArtists.map(addedArtist => addedArtist.id).includes(artist.id));
}


const initialState = [];

const RoyaltiesReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ROYALTIES_ADD:
      const oldUniqueArtistsInvited = filterArtistsWithSameIdThanNewOne(state.artists, action.payload);
      return { addingArtist: initialState.addingArtist, artists: [...action.payload, ...oldUniqueArtistsInvited] }

    case ReducerTypes.ROYALTIES_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default RoyaltiesReducer;