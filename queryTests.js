const db = require("./pokemon-firebase");

db.collection("pokemonMoves")
  .doc("6")
  .get()
  .then(doc => {

    console.log(doc.data()['52'])

  });