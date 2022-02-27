export const getEmailIfNotHaveUser = userData => userData.nombre ? `${userData.nombre} ${userData.apellido}` : `${userData.email}`;

export const userIsAdmin = rol => rol.indexOf('admin') >= 0;