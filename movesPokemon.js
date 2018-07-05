const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');

// go through every move
let pokemonRef = db.collection('pokemon');
let pokeMovesRef = db.collection('pokemonMoves');
let movesPokeRef = db.collection('movesPokemon');
let pokemon = {};
let fetchedIndexes = [];
let fetchedPokemon = [];

for (let i = 1; i <= 50; i++) {
  pokeMovesRef.get().then(snap => {
    snap.docs.forEach(doc => {
      let moveId = i.toString();
      let pokeId = doc.id;
      let move = doc.data()[moveId];
      if (move) {
        getCurrentPokemon(pokeId, move, moveId);
      }
    })
    console.log('added pokemon for move ' + i);
  })
}



// get pokemon that can learn the move
function getCurrentPokemon(pokemonId, move, moveId) {
  let currentPokemon = {};

  let index = fetchedIndexes.indexOf(pokemonId);
  if (index >= 0) {
    currentPokemon = fetchedPokemon[index];
    currentPokemon.learnMethod = move.learnMethod;
    currentPokemon.learnLevel = move.learnLevel;
    console.log('saved database call for pokemon ' + pokemonId);
  } else {

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

      fetchedPokemon.push(currentPokemon);
      fetchedIndexes.push(pokemonId);

      movesPokeRef.doc(moveId).set(currentPokemon, {
        merge: true
      });
    })
  }
}