import firebaseApp from 'firebaseConfig/firebase.js';
import { getAnalytics, logEvent } from "firebase/analytics"

const analytics = getAnalytics(firebaseApp);

const ourEmails = ["javierpetri2012@gmail.com", "jog@laflota.com", "tester@laflota.com.ar", "pick@laflota.com.ar"];

export const logLoginAnalyticEvent = userData => {
  if (ourEmails.includes(userData.email)) return;
  logEvent(analytics, 'login', {
    userId: userData.id,
    userName: userData.name + " " + userData.apellido,
    email: userData.email
  });
}

export const logReleaseDeliveryAnalyticEvent = albumData => {
  if (ourEmails.includes(albumData.title.indexOf("TEST") >= 0)) return;
  logEvent(analytics, 'release_delivered', {
    userId: albumData.ownerId,
    email: albumData.ownerEmail,
    albumTitle: albumData.title
  })
}