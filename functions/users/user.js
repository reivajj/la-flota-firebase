const functions = require('firebase-functions');
const hasher = require('wordpress-hash-node');

exports.checkPasswordInWpDB = functions.https.onCall(async (data) => {
  const { passwordHashInDB, password } = data;
  const checked = hasher.CheckPassword(password, passwordHashInDB);
  return checked;
});
