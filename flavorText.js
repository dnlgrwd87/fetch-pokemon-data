const db = require("./pokemon-firebase");
const axios = require("axios");
const url = "https://pokeapi.co/api/v2/pokemon-species/";

for (let i = 1; i <= 250; i++) {
  axios.get(url + i).then(response => {
    const data = response.data;
    const entries = data.flavor_text_entries;
    let text = null;

    entries.forEach(entry => {
      if (entry.language.name == "en") {
        if (entry.version.name == "omega-ruby") {
          text = entry.flavor_text;
        } else if (entry.version.name == "moon") {
          text = entry.flavor_text;
        }
      }
    });
    console.log(data.name + " added");
    db.collection("pokemonEntryText")
      .doc(i.toString())
      .set(
        {
          flavorText: text
        },
        { merge: true }
      );
  });
}
