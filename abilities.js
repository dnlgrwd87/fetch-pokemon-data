const db = require("./pokemon-firebase");
const axios = require("axios");
abilityUrl = "https://pokeapi.co/api/v2/ability/";



// there are 232 abilitiesconst db = require("./pokemon-firebase");

for (let i = 1; i <= 232; i++) {
  axios.get(abilityUrl + i).then(response => {
    const data = response.data;
    const name = data.name;
    const shortEffect = data.effect_entries[0].short_effect;
    const effect = data.effect_entries[0].effect;

    db.collection("abilities").doc(name).set({
      name: name,
      effect: effect,
      shortEffect: shortEffect
    }, { merge: true })
  })
}
