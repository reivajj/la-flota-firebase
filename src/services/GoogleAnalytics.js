import firebaseApp from 'firebaseConfig/firebase.js';
import { getAnalytics, logEvent } from "firebase/analytics"

const analytics = getAnalytics(firebaseApp);

export const logLoginAnalyticEvent = user => {
  console.log("Log analityc event");
  logEvent(analytics, 'login', {
    userId: user.id,
    userName: user.name + " " + user.apellido
  });
}