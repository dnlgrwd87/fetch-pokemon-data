const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');

// go through every move
let pokemonRef = db.collection('pokemon');
let pokeMovesRef = db.collection('pokemonMoves');
let movesRef = db.collection('moves');
let movesPokeRef = db.collection('movesPokemon');
let pokemon = {};

movesRef.doc('14').get().then(doc => {

  // go through pokeMoves
  pokeMovesRef.get().then(snap => {
    snap.docs.forEach(doc => {
      let moveId = doc.data()[doc.id]; // find move id if pokemon has it
      if (moveId) {
        console.log(doc.id + ' can learn ' + moveId);
        let pokeId = doc.id; // gets pokemon id that can learn searched move
        pokemon.id = pokeId;
        pokemon.learnMethod = moveId.learnMethod;
        pokemon.learnLevel = moveId.learnLevel;
        console.log(pokemon);
        getPokemonInfo(pokemon, moveId);
      }
    })
  })
})

// get pokemon that can learn the move
function getPokemonInfo(pokemon, moveId) {
  pokemonRef.doc(pokemon.id.toString()).get().then(doc => {
    let data = doc.data();
    pokemon.name = data.name;
    pokemon.baseStats = data.baseStats;
    pokemon.abilities = {
      normal: data.abilities.normal,
      hidden: data.abilities.hidden
    }
    pokemon.types = Object.keys(data.types);
    let currentPokemon = {
      [pokemon.id]: pokemon
    }
    console.log(currentPokemon);
    // addToDatabase(moveId, currentPokemon);
  })
}

// add pokemon to movesPokemon dataabase
function addToDatabase(moveId, currentPokemon) {
  movesPokeRef.doc(moveId)
    .set(currentPokemon, {
      merge: true
    })
}