import firebaseApp from 'firebaseConfig/firebase.js';
import { getAuth, reauthenticateWithCredential, updatePassword, updateEmail } from "firebase/auth";
import { to } from 'utils';

const auth = getAuth(firebaseApp);

export const reauthenticateWithCredentialOk = async (currentEmail, currentPassword) => {
  console.log("Credentials recibidas: ", { currentEmail, currentPassword });
  const credential = auth.EmailAuthProvider.credential(
    currentEmail, currentPassword
  );
  let [errorReatuhenticating] = await to(reauthenticateWithCredential(auth.currentUser, credential));
  if (errorReatuhenticating) {
    console.log("Error reauthenticating user: ", errorReatuhenticating);
    return false;
  }
  return true;
}

export const authUpdateEmail = async (newEmail) => {
  let [errorUpdatingEmail, successUpdatingEmail] = await to(updateEmail(auth.currentUser, newEmail));
  if (errorUpdatingEmail) {
    console.log("Error updating email: ", errorUpdatingEmail);
    return false;
  }
  console.log("Success updating email: ", successUpdatingEmail);
  return true;
}

export const authUpdatePassword = async (newPassword) => {
  let [errorUpdatingPassword, successUpdatingPassword] = await to(updatePassword(auth.currentUser, newPassword));
  if (errorUpdatingPassword) {
    console.log("Error updating password: ", errorUpdatingPassword);
    return false;
  }
  console.log("Success updating password: ", successUpdatingPassword);
  return true;
}