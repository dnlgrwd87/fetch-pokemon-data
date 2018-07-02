const db = require("./pokemon-firebase");
const axios = require("axios");


// bulbasaur   57
// ivysaur  45
// venusaur  55

for (let i = 1; i <= 20; i++) {
  db.collection('pokemonMoves').doc(i.toString()).get().then(doc => {
    if (doc.exists) {
      console.log(i + ' still exists');
    } else {
      console.log(i + ' was deleted correctly');
    }
  })
}