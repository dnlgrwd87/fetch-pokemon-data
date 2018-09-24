const db = require("./pokemon-firebase");

for (let i = 10001; i <= 10026; i++) {
  db.collection("pokemon").doc(i.toString())
    .get()
    .then(doc => {
      if (doc.exists) {
        let data = doc.data();
        let currentPokemon = {
          id: data.id,
          name: data.name,
          baseStats: data.baseStats,
          sprite: data.id.toString() + ".png",
          types: data.types,
          abilities: data.abilities
        };
        console.log("#" + data.id + " " + data.name + " added successfuly!");
        db.collection("pokemonShort")
          .doc(i.toString())
          .get()
          .then(doc => {
            if (!doc.exists) {
              db.collection("pokemonShort")
                .doc(i.toString())
                .set(currentPokemon, {
                  merge: true
                });
            }
          });
      }
    });
}