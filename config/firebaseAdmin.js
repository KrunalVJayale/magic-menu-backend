const admin = require("firebase-admin");
// const serviceAccount = require("/etc/secrets/magicmenu-riderapp-firebase-adminsdk-fbsvc-850c2bcadf.json"); // Download this from Firebase Console > Project Settings > Service accounts

const serviceAccount = require("../assets/magicmenu-riderapp-firebase-adminsdk-fbsvc-850c2bcadf.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
