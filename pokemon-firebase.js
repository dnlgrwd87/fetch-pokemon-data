const firebase = require('firebase');

var config = {

  // POKEMON DATABASE FIRESTORE
  apiKey: "AIzaSyCfYYt526UpQf_ulnS2k-jckmZz45xfSZs",
  authDomain: "pokemon-database-68c5a.firebaseapp.com",
  databaseURL: "https://pokemon-database-68c5a.firebaseio.com",
  projectId: "pokemon-database-68c5a",
  storageBucket: "pokemon-database-68c5a.appspot.com",
  messagingSenderId: "203199597724"

  // POKEDEX FIRESTORE
  // apiKey: "AIzaSyDrrLpq8gfmiXcrExVDK1A1B1veoxiPKFk",
  // authDomain: "pokedex-a1ffa.firebaseapp.com",
  // databaseURL: "https://pokedex-a1ffa.firebaseio.com",
  // projectId: "pokedex-a1ffa",
  // storageBucket: "",
  // messagingSenderId: "895028197463"
};
const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({
  timestampsInSnapshots: true
});

module.exports = firebaseApp.firestore();