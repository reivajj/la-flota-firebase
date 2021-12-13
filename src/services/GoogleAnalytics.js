import firebaseApp from 'firebaseConfig/firebase.js';
import { getAnalytics, logEvent } from "firebase/analytics"
import { to } from 'utils';

const analytics = getAnalytics(firebaseApp);

export const logLoginAnalyticEvent = user => {
  logEvent(analytics, 'login', {
    userId: user.id,
    userName: user.name + " " + user.apellido
  });
}