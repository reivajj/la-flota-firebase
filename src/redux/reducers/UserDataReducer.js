import * as ReducerTypes from 'redux/actions/Types';

const initialStats = { totalAlbums: 0, totalArtists: 0, totalLabels: 0, totalTracks: 0 };
const initialWithdrawals = {
  usd: { totalAmount: 0, totalWithdrawals: 0 },
  pesos: { totalAmount: 0, totalWithdrawals: 0 },
  cupones: { totalAmount: 0, totalWithdrawals: 0 }
}

const initialState = {
  rol: '', email: '', userName: '', id: '', ciudad: '', telefono: '', direccion: '', nombre: '',
  apellido: '', dni: '', imagen: '', stats: initialStats, usuarioActivo: false, generos: [],
  subgenerosPropios: [], plan: "charly-garcia", withdrawals: initialWithdrawals, actividadReciente: [],
  timestampWhenCreatedUser: '', lastTimeSignedInString: '', lastTimeSignedIn: '', isNewInFBSystem: false,
  cuit: '',
}

const addNewSubgenero = (newSubgenero, oldSubgeneros) => {
  if (!oldSubgeneros.find(oldS => newSubgenero.name === oldS.name)) return [...oldSubgeneros, newSubgenero];
  else return oldSubgeneros;
}

const UserDataReducer = (state = initialState, action) => {
  let userData = action.payload;
  switch (action.type) {
    case ReducerTypes.USER_DATA_SIGN_IN:
      return {
        rol: userData.rol,
        isNewInFBSystem: userData.isNewInFBSystem,
        email: userData.email,
        id: userData.id,
        ciudad: userData.ciudad,
        provincia: userData.provincia,
        telefono: userData.telefono,
        nombre: userData.nombre,
        apellido: userData.apellido,
        dni: userData.dni,
        imagenUrl: userData.imagen,
        userStatus: userData.userStatus,
        usuarioActivo: userData.usuarioActivo,
        stats: userData.stats || initialStats,
        withdrawals: userData.withdrawals || initialWithdrawals,
        lastTimeSignedIn: userData.lastTimeSignedIn,
        lastTimeSignedInString: userData.lastTimeSignedInString,
        timestampWhenCreatedUser: userData.timestampWhenCreatedUser,
        lastUpdateTS: userData.lastUpdateTS || 0,
        plan: userData.plan || initialState.plan,
        subgenerosPropios: userData.subgenerosPropios || initialState.subgenerosPropios,
        generos: userData.generos || initialState.generos,
        actividadReciente: userData.actividadReciente || initialState.actividadReciente,
      } || initialState;

    case ReducerTypes.USER_DATA_SIGN_OUT:
      return initialState;

    case ReducerTypes.USER_DATA_EDIT_PERFIL:
      return { ...state, ...action.payload };

    case ReducerTypes.USER_DATA_ADD_IMAGE:
      return { ...state, imagen: action.payload };

    case ReducerTypes.USER_DATA_ADD_SUBGENERO:
      return { ...state, subgenerosPropios: addNewSubgenero(action.payload, state.subgenerosPropios) }

    default:
      return state;
  }
};

export default UserDataReducer;