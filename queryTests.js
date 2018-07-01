const db = require("./pokemon-firebase");
const axios = require("axios");

db.collection('pokemonShort').where('id', '>=', 1).where('id', '<=', 98).get().then(snap => {
  console.log(snap.size);
})