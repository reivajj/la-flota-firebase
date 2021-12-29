import {
  USER_DATA_SIGN_IN, USER_DATA_SIGN_OUT, USER_DATA_ADD_IMAGE, USER_DATA_EDIT_PERFIL
} from "redux/actions/Types";


const initialStats = {
  totalAlbums: 0, totalArtists: 0, totalLabels: 0, totalTracks: 0,
  withdrawals: {
    usd: { totalAmount: 0, totalWithdrawals: 0 },
    pesos: { totalAmount: 0, totalWithdrawals: 0 },
    cupones: { totalAmount: 0, totalWithdrawals: 0 }
  }
}

const initialState = {
  rol: '', email: '', userName: '', id: '', ciudad: '', telefono: '', direccion: '', nombre: '',
  apellido: '', dni: '', imagen: '', stats: initialStats, usuarioActivo: false
}

const UserDataReducer = (state = initialState, action) => {
  let userData = action.payload;
  switch (action.type) {
    case USER_DATA_SIGN_IN:
      return {
        rol: userData.rol,
        email: userData.email,
        id: userData.id,
        ciudad: userData.ciudad,
        provincia: userData.provincia,
        telefono: userData.telefono,
        nombre: userData.nombre,
        apellido: userData.apellido,
        dni: userData.dni,
        imagenUrl: userData.imagen,
        usuarioActivo: userData.usuarioActivo,
        stats: userData.stats,
        lastTimeSignedIn: userData.lastTimeSignedIn,
        lastTimeSignedInString: userData.lastTimeSignedInString,
        withdrawals: userData.withdrawals,
        timestampWhenCreatedUser: userData.timestampWhenCreatedUser,
      } || initialState;
    case USER_DATA_SIGN_OUT:
      return initialState;
    case USER_DATA_EDIT_PERFIL:
      return { ...state, ...action.payload };
    case USER_DATA_ADD_IMAGE:
      return { ...state, imagen: action.payload };
    default:
      return state;
  }
};

export default UserDataReducer;