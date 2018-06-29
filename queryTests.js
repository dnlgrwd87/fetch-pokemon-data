const db = require("./pokemon-firebase");
const axios = require("axios");


// IGNORE 29 TO 34
for (let i = 326; i <= 386; i++) {

  axios.get("https://pokeapi.bastionbot.org/v1/pokemon/" + i).then(response => {
    let data = response.data[0];
    let name = data.name;
    let evolutionLine = data.family.evolutionLine;

    if (evolutionLine.indexOf(name) > 0) {
      let baseForm = evolutionLine[0];
      axios.get("https://pokeapi.bastionbot.org/v1/pokemon/" + baseForm).then(response => {
        let data = response.data[0];
        let baseFormId = parseInt(data.number);
        db.collection('pokemon').doc(i.toString()).update({
          baseId: baseFormId
        })
        console.log('base form updated')
      })
    } else {
      db.collection('pokemon').doc(i.toString()).update({
        baseId: null
      })
      console.log('base form set to null');
    }
  })
}