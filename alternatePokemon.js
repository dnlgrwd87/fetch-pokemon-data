const db = require("./pokemon-firebase");
const axios = require("axios");

// alternate forms: 10001 - 10147
// last added: 10021
// NEED TO ADD 10026 - 10032, THESE FORMS NOT PRESENT IN BASTION API
// ALSO 10061, (10080 - 10085, 10094 - 10099) ALL PIKACHU FORMS

addPokemon(10100);

function addPokemon(id) {
  let newPokemon = {};
  newPokemon.evolutionId = null;
  newPokemon.baseId = null;
  newPokemon.id = id;

  axios.get("https://pokeapi.co/api/v2/pokemon/" + id).then(response => {
    let data = response.data;
    newPokemon.baseStats = getBaseStats(data.stats);
    newPokemon.sprites = getSprites(data.sprites);
    newPokemon.name = data.forms[0].name;

    axios.get(data.species.url).then(response => {
      let data = response.data;
      let speciesId = data.id;
      newPokemon.alternateForms = true;
      newPokemon.alternateId = speciesId;

      axios.get(data.evolution_chain.url).then(response => {
        let data = response.data;
        if (data.chain.evolves_to.length > 0) {
          newPokemon.evolutionId = data.id;
          if (data.chain.species.name != newPokemon.name) {
            let baseId = parseInt(
              data.chain.species.url.slice(42, data.chain.species.url.length - 1)
            );
            newPokemon.baseId = baseId;
          }
        }

        axios
          .get("https://pokeapi.bastionbot.org/v1/pokemon/" + speciesId)
          .then(response => {
            let data = response.data[1];

            if (data) {
              let bastionName = response.data[1].name;
              newPokemon.species = data.species.toLowerCase();
              newPokemon.types = getValues(data.types);
              newPokemon.height = data.height;
              newPokemon.weight = data.weight;
              newPokemon.generation = data.gen;
              newPokemon.genderRatio = getGenderRatio(data.gender);
              newPokemon.eggGroups = getValues(data.eggGroups);
              newPokemon.abilities = getAbilities(data.abilities);

              addPokemonToDatabase(newPokemon, id);
              console.log('#' + id + " " + newPokemon.name + "/ " + bastionName + ", species #" + speciesId + " added successfully!");
            } else {
              console.log(newPokemon.name + " species #" + speciesId + " has no base form on Bastion API");
            }
          });
      })
    })
  });
}

function getBaseStats(stats) {
  let statsTotal = 0;
  stats.forEach(s => {
    statsTotal += s.base_stat;
  });
  let statsInfo = {
    speed: stats[0].base_stat,
    specialDefense: stats[1].base_stat,
    specialAttack: stats[2].base_stat,
    defense: stats[3].base_stat,
    attack: stats[4].base_stat,
    hp: stats[5].base_stat,
    total: statsTotal
  };

  return statsInfo;
}

function getSprites(sprites) {
  return {
    normal: sprites.front_default,
    shiny: sprites.front_shiny,
  };
}

function getValues(values) {
  let pokeValues = {};
  values.forEach(value => {
    pokeValues[value.toLowerCase()] = true;
  });
  return pokeValues;
}

function getGenderRatio(ratio) {
  if (ratio.length > 0) {
    return {
      male: ratio[0],
      female: ratio[1]
    };
  } else {
    return "genderless";
  }
}

function getAbilities(abilities) {
  let pokeAbilities = {};
  let normal = abilities.normal.map(a => a.toLowerCase());
  normal.forEach(a => (pokeAbilities[a] = true));
  pokeAbilities.normal = normal;
  if (abilities.hidden != "") {
    let hidden = abilities.hidden.map(a => a.toLowerCase());
    hidden.forEach(a => (pokeAbilities[a] = true));
    pokeAbilities.hidden = hidden;
  } else {
    pokeAbilities.hidden = [];
  }
  return pokeAbilities;
}

function addPokemonToDatabase(pokemon, id) {
  db.collection("pokemon")
    .doc(id.toString())
    .set(pokemon);
}