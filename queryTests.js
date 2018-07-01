const db = require("./pokemon-firebase");
const axios = require("axios");

db.collection('pokemon').get().then(snap => {
  console.log(snap.size);
})