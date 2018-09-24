const db = require("./pokemon-firebase");
const axios = require("axios");
const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";
const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";


function getFromSpecies(id) {
  axios.get(speciesUrl + id).then(response => {
    const data = response.data;
    let captureRate = data.capture_rate;
    let baseHappiness = data.base_happiness;
    let eggCycles = data.hatch_counter;
    let growthRate = data.growth_rate.name;

    db.collection("pokemon").doc(id.toString()).get().then(doc => {
      if (doc.exists) {
        console.log("adding data for #" + doc.data().id + " " + doc.data().name);
        db.collection("pokemon").doc(id.toString()).update({
          captureRate: captureRate,
          baseHappiness: baseHappiness,
          eggCycles: eggCycles,
          growthRate: growthRate
        })
      }
    })

  })
}

function getBaseExpAndEvYield(id) {
  axios.get(pokemonUrl + id).then(response => {

    const data = response.data;
    let baseExp = data.base_experience;
    let evYield = getEvYield(data.stats);
    db.collection("pokemon").doc(id.toString()).get().then(doc => {
      if (doc.exists) {
        console.log("adding data for #" + doc.data().id + " " + doc.data().name);
        db.collection("pokemon").doc(id.toString()).update({
          baseExp: baseExp,
          evYield: evYield
        })
      }
    })

  })
}

function getEvYield(stats) {
  let evYields = {};
  stats.forEach(stat => {
    if (stat.effort > 0) {
      let statName = stat.stat.name;
      let evYield = stat.effort;
      evYields[statName] = evYield;
    }
  })
  return evYields;
}


for (let i = 10002; i <= 10136; i++) {
  db.collection("pokemon").doc(i.toString()).get().then(doc => {
    if (doc.exists) {
      let altId = doc.data().alternateId;
      db.collection("pokemon").doc(altId.toString()).get().then(doc => {
        let data = doc.data();
        let captureRate = data.captureRate;
        let baseHappiness = data.baseHappiness;
        let eggCycles = data.eggCycles;
        let growthRate = data.growthRate;
        db.collection("pokemon").doc(i.toString()).update({
          captureRate: captureRate,
          baseHappiness: baseHappiness,
          eggCycles: eggCycles,
          growthRate: growthRate
        })
      })
    }
  })
}
