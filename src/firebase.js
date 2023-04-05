const admin = require("firebase-admin");

const serviceAccount = require(__dirname + "/wordsapi.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
module.exports = db;