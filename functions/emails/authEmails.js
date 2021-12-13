const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

const db = admin.firestore();
const { log } = functions.logger;
const logError = functions.logger.error;

function to(promise) {
  return promise
    .then((data) => [null, data])
    .catch((err) => [err]);
}

const transporter = nodemailer.createTransport({
  host: '70.39.235.122',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: functions.config().emailinfo.email,
    pass: functions.config().emailinfo.password,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    logError(error);
  } else {
    log('Server is ready to take our messages: ', success);
  }
});

// var htmlmail = fs.readFileSync("welcome.html", "utf-8").toString();
// No funciona a la hora de hacer el deploy... Por tener que incluir el welcome.html, averiguar.
// Aun asi puede poner todo el html aca dentro, es mejor, puedo usar las variables y todo.

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const dest = user.email;

  const mailOptions = {
    from: '"La Flota" <info@laflota.com.ar>',
    to: dest,
    subject: `${user.displayName} Bienvenido a La Flota`,
    html: '<b>Hola</b>',
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) return logError(error.toString(), '/ MailDest: ', dest);
    return log('Sended to :', dest, '/ Info: ', info);
  });
});

// exports.createUserInFirebaseAuthAndDB = functions.https.onCall(async (data) => {
//   const { prestadorData } = data;

//   const [errorCreatingPrestadorDoc, prestadorDocRef] = await to(
//     db.collection('prestadores').add(prestadorData),
//   );
//   if (errorCreatingPrestadorDoc) logError('Error creating Prestador Doc from CM:', errorCreatingPrestadorDoc);

//   const prestadorId = prestadorDocRef.id;
//   const [errorUpdatingIdInPrestadorDoc] = await to(
//     prestadorDocRef.update({
//       agenda: {
//         vacia: true,
//         agendaParameters: { consultoriosConfiguraciones: [] },
//       },
//       id: prestadorId,
//     }),
//   );
//   if (errorUpdatingIdInPrestadorDoc) logError('Error updating Prestador Doc with ID, from CM', errorUpdatingIdInPrestadorDoc);

//   const [errorCreatingAuthUser, userPrestadorAuth] = await to(
//     admin.auth().createUser({
//       uid: prestadorId,
//       email: prestadorData.email,
//       password: prestadorId,
//     }),
//   );
//   if (errorCreatingAuthUser) logError('Error creating the user in Auth: ', errorCreatingAuthUser);

//   return userPrestadorAuth;
// });

// exports.deleteUserAuth = functions.https.onCall(async (data) => {
//   log('Data: ', data);
//   const { userId } = data;
//   const [errorDeletingAuthUser] = await to(admin.auth().deleteUser(userId));
//   if (errorDeletingAuthUser) logError('Error deleting the user in Auth: ', errorDeletingAuthUser);

//   return errorDeletingAuthUser || 'SUCCESS';
// });

// exports.updateUserAuth = functions.https.onCall(async (data) => {
//   log('Data: ', data);
//   const { userId, newValues } = data;
//   const [errorUpdatingAuthUser] = await to(admin.auth().updateUser(userId, ...newValues));
//   if (errorUpdatingAuthUser) logError('Error updating the user auth data in Auth: ', errorUpdatingAuthUser);

//   return errorUpdatingAuthUser || 'SUCCESS UPDATING AUTH USER DATA';
// });

// Parece que no necesita el cors, averiguar bien. Funciona sin el igual
// const cors = require('cors')({ origin: true });
// const fs = require('fs');

// Buen ejemplo de Firebase con el tema MAIL! MIRARLO
// https://github.com/firebase/functions-samples/blob/master/quickstarts/email-users/functions/index.js

