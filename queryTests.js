const db = require("./pokemon-firebase");
const axios = require("axios");


/*
  63 - hyper-beam has 471 pokemon and was able to fit into a document

  // DEFINITELY TOO LARGE
  92 - toxic
  104 - double-team
  156 - rest
  164 - substitute
  182 - protect
  207 - swagger
  213 - attract
  214 - sleep-talk
  216 - return
  218 - frustration
  237 - hidden-power
  263 - facade
  290 - secret-power
  496 - round
  590 - confide

  // POSSIBLY TOO LARGE
  240 - rain-dance
  241 - sunny day
*/
const pokemonRef = db.collection('pokemon');
const movesPokemonRef = db.collection('movesPokemon1');
const pokemonMovesRef = db.collection('pokemonMoves');
const movesRef = db.collection('moves');

movesPokemonRef.get().then(snap => {
  console.log(snap.size);
})