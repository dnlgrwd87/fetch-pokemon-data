const db = require("./pokemon-firebase");
const axios = require("axios");

for (let i = 10001; i <= 10143; i++) {
  db.collection('pokemonShort').doc(i.toString()).get().then(doc => {
    if (doc.exists) {
      db.collection('pokemonShort').doc(i.toString()).update({
        id: i
      })
      console.log(doc.data().name + " updated");
    }
  })
}