const axios = require("axios");
const db = require("./pokemon-firebase");
const url = "https://pokeapi.co/api/v2/evolution-chain/";

let currentChain = {};

// ALL ADDED TO FIRESTORE
// 423 is the last evolution stage available
for (let i = 10; i <= 10; i++) {
  axios.get(url + i).then(response => {
    let chain = response.data.chain;
    let chainId = response.data.id;
    if (response.data.chain.evolves_to.length > 0) {
      getcurrentChain(chain, chainId);
    }
  });
}

function getcurrentChain(chain, chainId) {
  let baseName = chain.species.name;
  let baseId = parseInt(
    chain.species.url.slice(42, chain.species.url.length - 1)
  );
  let baseSprite = baseId + ".png";
  let base = {
    name: baseName,
    id: baseId,
    sprite: baseSprite
  };
  currentChain.base = base;

  let previousId = baseId;
  let previousName = baseName;
  let currentStage = chain.evolves_to;

  while (currentStage[0]) {
    for (let i = 0; i < currentStage.length; i++) {
      let details = currentStage[i].evolution_details[0];
      getCurrentPokemon(currentStage[i], details, previousId, previousName);
    }
    if (currentStage[0]) {
      previousId = parseInt(
        currentStage[0].species.url.slice(42, chain.species.url.length - 1)
      );
      previousName = currentStage[0].species.name;
      currentStage = currentStage[0].evolves_to;
    }
  }
  addChainToDatabase(currentChain, chainId);
}

function getCurrentPokemon(evolution, details, previousId, previousName) {
  let currentPokemon = {};
  currentPokemon.name = evolution.species.name;
  currentPokemon.id = parseInt(
    evolution.species.url.slice(42, evolution.species.url.length - 1)
  );
  currentPokemon.name = evolution.species.name;
  currentPokemon.evolvesFrom = previousName;
  currentPokemon.evolvesFromId = previousId;
  currentPokemon.sprite = currentPokemon.id + ".png";

  Object.keys(details).forEach(key => {
    if (details[key] != null && details[key] != false) {
      if (details[key].name != null) {
        currentPokemon[key] = details[key].name;
      } else {
        currentPokemon[key] = details[key];
      }
    }
  });
  currentChain[currentPokemon.id] = currentPokemon;
}

function addChainToDatabase(chainToAdd, chainId) {
  currentChain = {};
  db.collection("evolutions")
    .doc(chainId.toString())
    .get()
    .then(doc => {
      if (!doc.exists) {
        db.collection("evolutions")
          .doc(chainId.toString())
          .set(chainToAdd, {
            merge: true
          });
      }
      console.log(
        chainToAdd.base.name + "'s evolution chain added successfully!"
      );
    });
}