const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require("firebase");

// break up all 719 moves into 4 collections

// movesPokemon2
// small moves done: up to 150
// large moves done: up to 92

const pokemonRef = db.collection("pokemonShort");
const pokeMovesRef = db.collection("pokemonMoves");
const movesPokeRef = db.collection("movesPokemon2");

for (let i = 401; i <= 719; i++) {
  if (i != 92 && i != 104 && i != 156 && i != 164 && i != 182 && i != 207 && i != 213 && i != 214 && i != 216 && i != 218 && i != 237 && i != 240 && i != 241 && i != 263 && i != 290 && i != 496 && i != 590) {
    addMovesPokemon(i)
  }
}

function addMovesPokemon(i) {
  let moveName;
  pokeMovesRef.get().then(snap => {
    snap.docs.forEach(doc => {
      let moveId = i.toString();
      let pokemonId = doc.id;
      let move = doc.data()[moveId];

      if (move) {
        moveName = move.name;
        if (parseInt(pokemonId) >= 453 && parseInt(pokemonId) <= 802) {
          pokemonRef
            .doc(pokemonId.toString())
            .get()
            .then(doc => {
              let data = doc.data();
              let pokemon = {
                name: data.name,
                id: data.id,
                sprite: data.sprite,
                types: data.types.all,
                abilities: {
                  normal: data.abilities.normal,
                  hidden: data.abilities.hidden
                },
                baseStats: data.baseStats,
                learnMethod: move.learnMethod,
                learnLevel: move.learnLevel
              };
              currentPokemon = {
                [pokemonId]: pokemon
              };
              movesPokeRef.doc(moveId).set(currentPokemon, {
                merge: true
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    });
    if (moveName) {
      console.log("adding pokemon for " + moveName);
    }
  });
}

// exclude the large moves
// if (i != 92 && i != 104 && i != 156 && i != 164 && i != 182 && i != 207 && i != 213 && i != 214 && i != 216 && i != 218 && i != 237 && i != 240 && i != 241 && i != 263 && i != 290 && i != 496 && i != 590) {
//   addMovesPokemon(i)
// }

// include only the large moves
// if (i == 92 || i == 104 || i == 156 || i == 164 || i == 182 || i == 207 || i == 213 || i == 214 || i == 216 || i == 218 || i == 237 || i == 240 || i == 241 || i == 263 || i == 290 || i == 496 || i == 590) {
//   addMovesPokemon(i)
// }

































// MOVESPOKEMON 3
// if (parseInt(pokemonId) == 550 || parseInt(pokemonId) == 555 || parseInt(pokemonId) == 648 || parseInt(pokemonId) == 641 || parseInt(pokemonId) == 642 || parseInt(pokemonId) == 645 || parseInt(pokemonId) == 647 || parseInt(pokemonId) == 678 || parseInt(pokemonId) == 681 || parseInt(pokemonId) == 718)

// MOVESPOKEMON 4
// if (parseInt(pokemonId) == 741 || parseInt(pokemonId) == 745)
