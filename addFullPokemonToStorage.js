const db = require("./pokemon-firebase");
const pokemonRef = db.collection('pokemon');
const pokemonMovesRef = db.collection('pokemonMoves');
const evoRef = db.collection('evolutions');
const alternateRef = db.collection('alternateForms');

let pokemonList = [];
let addedPokemon = [];
let name = 'bulbasaur'

addPokemon(name);

function addPokemon(name) {
  if (addedPokemon.includes(name)) return;
  addedPokemon.push(name);
  pokemonRef.where('name', '==', name).get().then(snap => {
    snap.forEach(doc => {
      let pokemon = {};
      pokemon.info = doc.data();

      pokemonMovesRef.doc(pokemon.info.id.toString()).get().then(doc => {
        pokemon.moves = doc.data();
        pokemonList.push({
          [pokemon.info.name]: pokemon
        });
        pokemonList.forEach(poke => {
          // console.log(poke)
        })
        console.log('getting info and moves for ' + pokemon.info.name);
      })

      if (pokemon.info.evolutionId && pokemon.info.alternateForms) {
        getEvoAndForms(pokemon);
        getAllEvoData(pokemon.info.evolutionId.toString());
        if (pokemon.info.alternateId) {
          getAllAlternateData(pokemon.info.alternateId.toString());
          console.log('getting evolution and alternate forms data for ' + pokemon.info.name);
        } else {
          getAllAlternateData(pokemon.info.id.toString());
          console.log('getting evolution and alternate forms data for ' + pokemon.info.name);
        }
      }

      if (pokemon.info.evolutionId && !pokemon.info.alternateForms) {
        getOnlyEvo(pokemon);
        getAllEvoData(pokemon.info.evolutionId.toString());
        console.log('getting evolution data for ' + pokemon.info.name);
      }

      if (!pokemon.info.evolutionId && pokemon.info.alternateForms) {
        getOnlyForms(pokemon);
        if (pokemon.info.alternateId) {
          getAllAlternateData(pokemon.info.alternateId.toString());
          console.log('getting alternate forms info for ' + pokemon.info.name);
        } else {
          getAllAlternateData(pokemon.info.id.toString());
          console.log('getting alternate forms info for ' + pokemon.info.name);
        }
      }
    })
  })
}

function getEvoAndForms(pokemon) {
  getOnlyEvo(pokemon);
  getOnlyForms(pokemon);
}

function getOnlyEvo(pokemon) {
  evoRef.doc(pokemon.info.evolutionId.toString()).get().then(doc => {
    pokemon.evolutions = doc.data();
    let index = getIndex(pokemon);

    if (index != null) {
      pokemonList[index] = {
        [pokemon.info.name]: pokemon
      }
      pokemonList.forEach(poke => {
        // console.log(poke);
      })
    }
  })
}

function getOnlyForms(pokemon) {
  let currentId;
  if (pokemon.info.alternateId) {
    currentId = pokemon.info.alternateId;
  } else {
    currentId = pokemon.info.id;
  }

  alternateRef.doc(currentId.toString()).get().then(doc => {
    pokemon.forms = doc.data();
    let index = getIndex(pokemon);

    if (index != null) {
      pokemonList[index] = {
        [pokemon.info.name]: pokemon
      }
      pokemonList.forEach(poke => {
        // console.log(poke);
      })
    }
  })
}

function getAllEvoData(id) {
  evoRef.doc(id).get().then(doc => {
    let keys = Object.keys(doc.data());
    keys.forEach(key => {
      let name = doc.data()[key].name;
      addPokemon(name);
    })
  })
}

function getAllAlternateData(id) {
  alternateRef.doc(id).get().then(doc => {
    let keys = Object.keys(doc.data());
    keys.forEach(key => {
      let name = doc.data()[key].name;

      addPokemon(name);
    })
  })
}

function getIndex(pokemon) {
  for (let i = 0; i < pokemonList.length; i++) {
    let current = pokemonList[i];
    if (current.hasOwnProperty(pokemon.info.name)) {
      return i;
    }
  }
  return null;
}