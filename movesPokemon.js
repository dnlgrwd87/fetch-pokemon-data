const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');

// go through every move (719)

// break up all 719 moves into 4 collections
// movesPokemon1 => 1 - 251
// movesPokemon2 => 252 - 493
// movesPokemon3 => 494 - 721
// movesPokemon4 => 722 - 802

const pokemonRef = db.collection('pokemonShort');
const pokeMovesRef = db.collection('pokemonMoves');
const movesPokeRef = db.collection('movesPokemon1');

for (let i = 1; i <= 50; i++) {
  pokeMovesRef.get().then(snap => {
      snap.docs.forEach(doc => {
        let moveId = i.toString();
        let pokemonId = doc.id;
        let move = doc.data()[moveId];
        
        if (move) {
          if (parseInt(pokemonId) >= 1 && parseInt(pokemonId) <= 251) {
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
          } else {
            // console.log('not searching for pokemon id #' + doc.id);
          }
        }
      })
      console.log('adding pokemon for move ' + i);
    })
    .catch(err => {
      console.log(err);
    })
}