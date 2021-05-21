import {
  USER_DATA_SIGN_IN, USER_DATA_SIGN_OUT, USER_DATA_ADD_IMAGE, USER_DATA_ADD_ARTIST
} from "redux/actions/Types";

const initialState = {
  rol: '', email: '', userName: '', id: '', ciudad: '', telefono: '', direccion: '', nombre: '',
  apellido: '', dni: '', imagen: '', artists: [],
}

const UserDataReducer = (state = initialState, action) => {
  let userData = action.payload;
  switch (action.type) {
    case USER_DATA_SIGN_IN:
      console.log("USerData: ", userData);
      return {
        rol: userData.rol,
        email: userData.email,
        id: userData.id,
        ciudad: userData.ciudad,
        provincia: userData.provincia,
        telefono: userData.telefono,
        direccion: userData.direccion,
        nombre: userData.nombre,
        apellido: userData.apellido,
        dni: userData.dni,
        imagen: userData.imagen,
        usuarioActivo: userData.usuario,
        artists: userData.artists || [],
      } || initialState;
    case USER_DATA_SIGN_OUT:
      return initialState;
    // case USER_DATA_EDIT_PERFIL:
    //   return { ...action.payload };
    case USER_DATA_ADD_IMAGE:
      return { ...state, imagen: action.payload };
    case USER_DATA_ADD_ARTIST:
      return { ...state, artists: [ ...state.artists, userData.artist ] }  
    default:
      return state;
  }
};

export default UserDataReducer;