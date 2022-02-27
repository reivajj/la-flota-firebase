const admin = require("firebase-admin");
admin.initializeApp();

// The Firebase Admin SDK to access Cloud Firestore.

exports.storage = require("./storage/images");
// exports.emails = require("./emails/authEmails");
exports.users = require("./users/user");
exports.logs = require("./logs/logs");