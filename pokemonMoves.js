const db = require("./pokemon-firebase");
const axios = require("axios");
const firebase = require('firebase');


for (let i = 1; i <= 15; i++) {
  axios.get('https://pokeapi.co/api/v2/pokemon/' + i)
    .then(response => {
      let moves = response.data.moves;
      moves.forEach(move => {
        let learnInfo = {};
        move.version_group_details.forEach(detail => {

          if (detail.version_group.name == 'sun-moon') {
            learnInfo = {
              learnMethod: detail.move_learn_method.name,
              learnLevel: detail.level_learned_at
            }
            addMove(move, learnInfo, i);
          }
        })
      })
    });
}

function addMove(move, learnInfo, i) {
  let url = move.move.url;
  let moveId = url.slice(31, url.length - 1);
  db.collection('moves').doc(moveId).get().then(doc => {
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
    }
    db.collection('pokemonMoves').doc(i.toString())
      .set(currentMove, {
        merge: true
      });
  })
}