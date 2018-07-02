const db = require("./pokemon-firebase");
const axios = require("axios");

db.collection('alternateForms').get().then(snap => {
  console.log(snap.size);
})