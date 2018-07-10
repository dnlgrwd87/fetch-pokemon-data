const db = require("./pokemon-firebase");
const axios = require("axios");

// db.collection("pokemon")
//   .where("id", "<=", 801)
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       let data = doc.data();
//       let currentPokemon = {
//         id: data.id,
//         name: data.name,
//         baseStats: data.baseStats,
//         sprite: data.id.toString() + ".png",
//         types: data.types,
//         abilities: data.abilities
//       };
//       console.log("#" + data.id + " " + data.name + " added successfuly!");
//       db.collection("pokemonShort")
//         .doc(data.id.toString())
//         .get()
//         .then(doc => {
//           if (!doc.exists) {
//             db.collection("pokemonShort")
//               .doc(data.id.toString())
//               .set(currentPokemon, {
//                 merge: true
//               });
//           }
//         });
//     });
//   });



// FOR ALTERNATE FORMS

for (let i = 10026; i <= 10026; i++) {
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