const axios = require("axios");
const url = "https://pokeapi.co/api/v2/evolution-chain/";

for (let i = 67; i <= 67; i++) {
  // 423 is the last evolution stage available
  axios.get(url + i).then(response => {
    const chain = response.data.chain;
    if (response.data.chain.evolves_to.length > 0) {
      getEvolutionChain(chain);
    }
  });
}

function getEvolutionChain(chain) {
  let baseName = chain.species.name;
  let baseId = parseInt(chain.species.url.slice(42, chain.species.url.length - 1));
  let baseSprite = baseId + '.png';
  let base = {
    name: baseName,
    id: baseId,
    sprite: baseSprite
  }
  console.log(base);

  let previousId = baseId;
  let currentStage = chain.evolves_to;

  while (currentStage) {
    for (let i = 0; i < currentStage.length; i++) {
      let details = currentStage[i].evolution_details[0];
      getCurrentPokemon(currentStage[i], details, previousId);
    }
    if (currentStage[0]) {
      previousId = parseInt(currentStage[0].species.url.slice(42, chain.species.url.length - 1));
      currentStage = currentStage[0].evolves_to;
    }
  }
}

function getCurrentPokemon(evolution, details, previousId) {

  let currentPokemon = {};

  currentPokemon.name = evolution.species.name;
  currentPokemon.id = parseInt(evolution.species.url.slice(42, evolution.species.url.length - 1));
  currentPokemon.name = evolution.species.name;
  currentPokemon.evolvesFrom = previousId;
  currentPokemon.sprite = currentPokemon.id + '.png';

  Object.keys(details).forEach(key => {
    if (details[key] != null && details[key] != false) {
      if (details[key].name !== null) {
        currentPokemon[key] = details[key].name;
      } else {
        currentPokemon[key] = details[key];
      }
    }
  })
  console.log(currentPokemon);
  console.log('\n****************\n')
}