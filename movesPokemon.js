const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');

// break up all 719 moves into 4 collections

// movesPokemon1 => 1 - 251        !!!!! DONE !!!!!
// movesPokemon2 => 252 - 493      !!!!! DONE !!!!!
// movesPokemon3 => 494 - 721      !!!!! DONE !!!!!
// movesPokemon4 => 722 - 802      !!!!! DONE !!!!!

const pokemonRef = db.collection('pokemonShort');
const pokeMovesRef = db.collection('pokemonMoves');
const movesPokeRef = db.collection('movesPokemon4');

for (let i = 1; i <= 1; i++) {
  addMovesPokemon(i)
}

function addMovesPokemon(i) {
  pokeMovesRef.get().then(snap => {
    snap.docs.forEach(doc => {
      let moveId = i.toString();
      let pokemonId = doc.id;
      let move = doc.data()[moveId];

      if (move) {
        if (parseInt(pokemonId) >= 722 && parseInt(pokemonId) <= 802) {
          pokemonRef.doc(pokemonId.toString()).get().then(doc => {
            let data = doc.data();
            let pokemon = {
              name: data.name,
              id: data.id,
              sprite: data.sprite,
              types: data.types,
              abilities: {
                normal: data.abilities.normal,
                hidden: data.abilities.hidden
              },
              baseStats: data.baseStats,
              learnMethod: move.learnMethod,
              learnLevel: move.learnLevel
            }
            currentPokemon = {
              [pokemonId]: pokemon
            }
            movesPokeRef.doc(moveId).set(currentPokemon, {
              merge: true
            });
          }).catch(err => {
            console.log(err);
          })
        }
      }
    })
    console.log('adding pokemon for move ' + i);
  })
}



// exclude the large moves
// if (i != 92 && i != 104 && i != 156 && i != 164 && i != 182 && i != 207 && i != 213 &&i != 214 &&i != 216 &&i != 218 &&i != 237 && i != 240 && i != 241 && i != 263 && i != 290 && i != 496 && i != 590) {
//   addMovesPokemon(i)
// }

// include only the large moves
// if (i == 92 || i == 104 || i == 156 || i == 164 || i == 182 || i == 207 || i == 213 || i == 214 || i == 216 || i == 218 || i == 237 || i == 240 || i == 241 || i == 263 || i == 290 || i == 496 || i == 590) {
//   addMovesPokemon(i)
// }