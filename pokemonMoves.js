const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require("firebase");

for (let i = 6; i <= 6; i++) {
  axios.get("https://pokeapi.co/api/v2/pokemon/" + i).then(response => {
    let moves = response.data.moves;
    moves.forEach(move => {
      let learnInfo = {
        learnMethod: [],
        learnLevel: 0
      };
      move.version_group_details.forEach(detail => {
        if (detail.version_group.name == "sun-moon") {
          if (learnInfo.learnMethod.includes(detail.move_learn_method.name) == false) {
            learnInfo.learnMethod.push(detail.move_learn_method.name);
          }
          learnInfo.learnLevel = detail.level_learned_at;
        }
        if (detail.version_group.name == "omega-ruby-alpha-sapphire" && detail.move_learn_method.name == 'tutor') {
          if (learnInfo.learnMethod.includes('tutor') == false) {
            learnInfo.learnMethod.push('tutor');
          }
        }
      });
      if (learnInfo.learnMethod.length > 0 && learnInfo.learnLevel != null) {
        console.log(move.move.name + ' added!');
        addMove(move, learnInfo, i);
      }
    });
  });
}

function addMove(move, learnInfo, i) {
  let url = move.move.url;
  let moveId = url.slice(31, url.length - 1); // grabs move id from url string
  db.collection("moves")
    .doc(moveId)
    .get()
    .then(doc => {
      let data = doc.data();
      let currentMove = {
        [moveId]: {
          id: moveId,
          name: data.name,
          power: data.power,
          shortEffectInfo: data.shortEffectInfo,
          type: data.type,
          accuracy: data.accuracy,
          pp: data.pp,
          category: data.category,
          learnMethod: learnInfo.learnMethod,
          learnLevel: learnInfo.learnLevel
        }
      };
      db.collection("pokemonMoves")
        .doc(i.toString())
        .set(currentMove, {
          merge: true
        });
    });
}