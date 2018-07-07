const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');

// go through every move
let pokemonRef = db.collection('pokemon');
let pokeMovesRef = db.collection('pokemonMoves');
let movesPokeRef = db.collection('movesPokemon');


// move 92 toxic has too many pokemon to store in one document


for (let i = 101; i <= 105; i++) {
  pokeMovesRef.get().then(snap => {
      snap.docs.forEach(doc => {
        let moveId = i.toString();
        let pokemonId = doc.id;
        let move = doc.data()[moveId];
        if (move) {
          getCurrentPokemon(pokemonId, move, moveId);
        }
      })
      console.log('added pokemon for move ' + i);
    })
    .catch(err => {
      console.log(err);
    })
}

// get pokemon that can learn the move
function getCurrentPokemon(pokemonId, move, moveId) {
  let currentPokemon = {};

  pokemonRef.doc(pokemonId.toString()).get().then(doc => {
    let data = doc.data();
    let pokemon = {
      name: data.name,
      id: data.id,
      sprites: data.sprites,
      types: Object.keys(data.types),
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