const db = require("./pokemon-firebase");

let url = 'https://pokeapi.co/api/v2/evolution-chain/1/';


let moves = [];

db.collection('pokemon').get().then(snapshot => {
  console.log(snapshot.size);
})