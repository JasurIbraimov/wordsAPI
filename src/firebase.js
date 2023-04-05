const admin = require("firebase-admin");

const serviceAccount = require("../wordsapi-5942f-firebase-adminsdk-ux6ly-c9180f2eb5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
module.exports = db;