import {
  USER_DATA_SIGN_IN, USER_DATA_SIGN_OUT, USER_DATA_ADD_IMAGE,
} from "redux/actions/Types";

const initialState = {
  rol: '', email: '', userName: '', id: '', ciudad: '', telefono: '', direccion: '', nombre: '',
  apellido: '', dni: '', imagen: '',
}

const UserDataReducer = (state = initialState, action) => {
  let userData = action.payload;
  console.log("USerData: ", userData);
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
        usuarioActivo: userData.usuario,
      } || initialState;
    case USER_DATA_SIGN_OUT:
      return initialState;
    // case USER_DATA_EDIT_PERFIL:
    //   return { ...action.payload };
    case USER_DATA_ADD_IMAGE:
      return { ...state, imagen: action.payload };
    default:
      return state;
  }
};

export default UserDataReducer;