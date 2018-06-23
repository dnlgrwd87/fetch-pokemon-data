const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyCfYYt526UpQf_ulnS2k-jckmZz45xfSZs",
    authDomain: "pokemon-database-68c5a.firebaseapp.com",
    databaseURL: "https://pokemon-database-68c5a.firebaseio.com",
    projectId: "pokemon-database-68c5a",
    storageBucket: "pokemon-database-68c5a.appspot.com",
    messagingSenderId: "203199597724"
};
const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({
  timestampsInSnapshots: true
});

module.exports = firebaseApp.firestore();