const db = require("./pokemon-firebase");
const axios = require("axios");

// range is [1, 719]
for (let i = 481; i <= 719; i++) {
  db.collection("moves")
    .doc(i.toString())
    .get()
    .then(doc => {
      if (!doc.exists) {
        getMove(i);
      }
    });
}

function getMove(i) {
  axios.get("https://pokeapi.co/api/v2/move/" + i).then(response => {
    const data = response.data;
    let newMove = {};

    newMove.name = data.name;
    newMove.id = data.id;
    newMove.pp = data.pp;
    newMove.accuracy = data.accuracy;
    newMove.power = data.power;
    newMove.type = data.type.name;
    newMove.category = data.damage_class.name;
    newMove.effectInfo = data.effect_entries[0].effect.replace(
      "$effect_chance",
      data.effect_chance
    );
    newMove.shortEffectInfo = data.effect_entries[0].short_effect.replace(
      "$effect_chance",
      data.effect_chance
    );
    newMove.flavorText = getFlavorText(data.flavor_text_entries);

    addMoveToDatabase(newMove);
    console.log(`#${newMove.id} ${newMove.name} added successfuly!`);
  });
}

function getFlavorText(flavorText) {
  let text = "";
  flavorText.forEach(ft => {
    let language = ft.language.name;
    let version = ft.version_group.name;
    if (language == "en" && version == "sun-moon") {
      text = ft.flavor_text.replace(/\n/g, " "); // gets rid of \n character
    }
  });
  return text;
}

function addMoveToDatabase(move) {
  db.collection("moves")
    .doc(move.id.toString())
    .set(move)
    .catch(error => {
      console.log("Error occurred: " + error);
    });
}
