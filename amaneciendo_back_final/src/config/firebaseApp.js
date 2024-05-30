const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');
const serviceAccount = require("./3dPrintSage_key/dprintsage-firebase-adminsdk-ehuno-98de0b50bd.json");

const amaneciendoApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  storageBucket: firebaseConfig.storageBucket
}, 'amaneciendoApp');

module.exports = amaneciendoApp;