import firebaseApp from 'firebaseConfig/firebase.js';
import { getAuth, reauthenticateWithCredential, updatePassword, updateEmail, signInWithPopup, GoogleAuthProvider, deleteUser } from "firebase/auth";
import { to } from 'utils';

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
auth.languageCode = 'sp';

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

export const signInWithGoogle = async () => {

  let [errorSignInWithGoogle, resultSignInWithGoogle] = await to(signInWithPopup(auth, provider));
  if (errorSignInWithGoogle) console.log("ERROR SIGN IN WITH GOOGLE: ", errorSignInWithGoogle);

  const user = resultSignInWithGoogle.user;
  return user;
}

export const deleteCurrentAuthUser = async () => {
  const user = auth.currentUser;
  deleteUser(user);
}
