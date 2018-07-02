const db = require("./pokemon-firebase");
const axios = require("axios");

let fetechedMoves = [];
let fetechedMovesIndex = [];
let savedCalls = 0;

for (let i = 1; i <= 9; i++) {
  getMove(i);
  // db.collection("pokemonMoves")
  // .doc(i.toString())
  // .get()
  // .then(doc => {
  // if (!doc.exists) {
  // getMove(i);
  // }
  // });
}

function getMove(i) {
  axios.get("https://pokeapi.co/api/v2/pokemon/" + i).then(response => {
    let moves = response.data.moves;

    moves.forEach(move => {
      let previousLearnLevel = 0;
      let learnInfo = {
        learnMethod: [],
        learnLevel: 0
      };
      move.version_group_details.forEach(detail => {
        if (detail.version_group.name == "sun-moon") {
          if (learnInfo.learnMethod.includes(detail.move_learn_method.name) == false) {
            learnInfo.learnMethod.push(detail.move_learn_method.name);
          }
          if (detail.level_learned_at > previousLearnLevel) {
            previousLearnLevel = detail.level_learned_at;
            learnInfo.learnLevel = detail.level_learned_at;
          } else {
            learnInfo.learnLevel = previousLearnLevel;
          }
        }
        if (detail.version_group.name == "omega-ruby-alpha-sapphire" && detail.move_learn_method.name == "tutor") {
          if (learnInfo.learnMethod.includes("tutor") == false) {
            learnInfo.learnMethod.push("tutor");
          }
        }
      });
      if (learnInfo.learnMethod.length > 0 && learnInfo.learnLevel != null) {
        addMove(move, learnInfo, i);
      }
    });
  });
}

function addMove(move, learnInfo, i) {
  let url = move.move.url;
  let moveId = url.slice(31, url.length - 1);
  let currentMove = {};
  let index = fetechedMovesIndex.indexOf(moveId);

  if (index >= 0) {
    savedCalls++;
    console.log(savedCalls + ' calls saved');
    currentMove = fetechedMoves[index];
    currentMove[moveId].learnMethod = learnInfo.learnMethod;
    currentMove[moveId].learnLevel = learnInfo.learnLevel;

    db.collection("pokemonMoves")
      .doc(i.toString())
      .set(currentMove, {
        merge: true
      });
  } else {
    db.collection("moves")
      .doc(moveId)
      .get()
      .then(doc => {
        let data = doc.data();
        currentMove = {
          [moveId]: {
            id: parseInt(moveId),
            name: data.name,
            power: data.power,
            shortEffectInfo: data.shortEffectInfo,
            type: data.type,
            accuracy: data.accuracy,
            pp: data.pp,
            category: data.category
          }
        };

        fetechedMoves.push(currentMove);
        fetechedMovesIndex.push(moveId);

        currentMove[moveId].learnMethod = learnInfo.learnMethod;
        currentMove[moveId].learnLevel = learnInfo.learnLevel;

        db.collection("pokemonMoves")
          .doc(i.toString())
          .set(currentMove, {
            merge: true
          });
      });
  }
}