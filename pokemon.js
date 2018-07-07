const db = require("./pokemon-firebase");
const axios = require("axios");

// normal: 1 - 802
// alternate forms: 10001 - 10147

for (let i = 52; i <= 151; i++) {
  // db.collection('pokemon').doc(i.toString()).get().then(doc => {
  // if (!doc.exists) {
  addPokemon(i);
  // }
  // })
}

function addPokemon(id) {
  let newPokemon = {};

  axios
    .get("https://pokeapi.bastionbot.org/v1/pokemon/" + id)
    .then(response => {
      let data = response.data[0];
      newPokemon.id = id;
      newPokemon.species = data.species.toLowerCase();
      newPokemon.types = getValues(data.types);
      newPokemon.height = data.height;
      newPokemon.weight = data.weight;
      newPokemon.generation = data.gen;
      newPokemon.genderRatio = getGenderRatio(data.gender);
      newPokemon.eggGroups = getValues(data.eggGroups);
      newPokemon.abilities = getAbilities(data.abilities);
      newPokemon.evolutionId = null;
      newPokemon.baseId = null;

      axios.get("https://pokeapi.co/api/v2/pokemon/" + id).then(response => {
        let data = response.data;
        newPokemon.baseStats = getBaseStats(data.stats);
        newPokemon.sprites = getSprites(data.sprites);

        axios.get(data.species.url).then(response => {
          let data = response.data;
          newPokemon.name = data.name;
          newPokemon.alternateForms = data.varieties.length > 1;

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
            addPokemonToDatabase(newPokemon);
            console.log('#' + newPokemon.id + " " + newPokemon.name + " added successfully!");
          });
        })
      })
    })
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

function addPokemonToDatabase(pokemon) {
  db.collection("pokemon")
    .doc(pokemon.id.toString())
    .set(pokemon);
}