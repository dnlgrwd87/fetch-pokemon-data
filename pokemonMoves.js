const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');

// go through every move
let pokemonRef = db.collection('pokemon');
let pokeMovesRef = db.collection('pokemonMoves');
let movesRef = db.collection('moves');
let movesPokeRef = db.collection('movesPokemon');
let pokemon = {};

let moveId = '22';
// go through pokeMoves
pokeMovesRef.get().then(snap => {
  snap.docs.forEach(doc => {
    let pokeId = doc.id;
    let move = doc.data()[moveId];
    if (move) {
      let currentPokemon = getCurrentPokemon(pokeId, move);
    }
  })
})

// get pokemon that can learn the move
function getCurrentPokemon(pokemonId, move) {
  let currentPokemon = {};
  pokemonRef.doc(pokemonId.toString()).get().then(doc => {
    let data = doc.data();
    let pokemon = {
      name: data.name,
      id: data.id,
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
  })
}