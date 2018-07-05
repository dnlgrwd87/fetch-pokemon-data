const db = require("./pokemon-firebase");
const axios = require("axios");


db.collection('pokemonMoves').get().then(snap => {
  console.log(snap.size);
})