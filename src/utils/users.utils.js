import { planesLaFlota, subscriptionsStatusLaFlota, colorFromSubIdState } from '../variables/varias';

export const getEmailIfNotHaveUser = userData => userData.nombre ? `${userData.nombre} ${userData.apellido}` : `${userData.email}`;

export const userIsAdmin = rol => rol.indexOf('admin') >= 0;

export const getPlanNameFromId = planId => {
  return planesLaFlota.find(plan => plan.id === planId)?.name || "Desconocido"
}

export const getPlanIdFromName = planName => {
  return planesLaFlota.find(plan => plan.name === planName)?.id || "charly-garcia"
}

export const getSubscriptionStatusFromId = subId => {
  return subscriptionsStatusLaFlota.find(sub => sub.id === subId)?.name || "Activa"
}

export const getSubscriptionStatusIdFromName = subName => {
  return subscriptionsStatusLaFlota.find(sub => sub.name === subName)?.id || "Activa"
}

export const getSubStatusColor = subId => {
  if (!subscriptionsStatusLaFlota.map(sub => sub.id).includes(subId)) return "rgb(10, 109, 15)";
  return colorFromSubIdState[subId];
}

export const getUsersPropsForDataTable = users => {
  let usersPropsToTable = [];
  users.forEach(user => {
    usersPropsToTable.push([
      user.email,
      user.password,
      user.nombre + " " + user.apellido,
      getPlanNameFromId(user.plan),
      user.userIdWp,
      user.usuarioActivo
    ]);
  });
  return usersPropsToTable;
}

export const sortUsersByField = (users, field) => {
  return users.sort((uA, uB) => {
    if (uA[field] > uB[field]) return - 1;
    else return 1
  });
}