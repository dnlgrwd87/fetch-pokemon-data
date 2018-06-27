const db = require("./pokemon-firebase");
const axios = require("axios");


db.collection('pokemon').get().then(snapshot => {
  console.log(snapshot.size);
  snapshot.docs.forEach(doc => {
    let data = doc.data();
    let currentPokemon = {
      id: data.id,
      name: data.name,
      baseStats: data.baseStats,
      sprite: data.id.toString() + '.png',
      types: data.types,
      abilities: data.abilities
    }
    db.collection('pokemonShort').doc(data.id.toString()).get().then(doc => {
      if (!doc.exists) {
        db.collection('pokemonShort').doc(data.id.toString()).set(currentPokemon, {
          merge: true
        });
      }
    })
  })
})