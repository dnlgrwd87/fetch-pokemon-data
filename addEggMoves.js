const db = require("./pokemon-firebase");
const axios = require("axios");

let prevBaseId = 0;
let eggMoves = [];

// last updated was fearow
// next to update is arbok

db.collection("pokemon")
  .where("baseId", ">=", 10)
  .where("baseId", "<=", 20)
  .get()
  .then(snap => {
    snap.docs.forEach(doc => {
      let data = doc.data();
      let baseId = data.baseId;
      let currentId = doc.id;
      if (baseId == prevBaseId) {
        console.log(data.id + ' ' + data.name + ', ' + ' has the same base id as previous pokemon');
        transferEggMoves(eggMoves, currentId);
      } else {
        eggMoves = [];
        prevBaseId = baseId;
        console.log(currentId + ' ' + data.name + ' has a different id than the previous pokemon');
        db.collection("pokemonMoves")
          .doc(baseId.toString())
          .get()
          .then(doc => {
            if (doc.exists) {
              let moves = doc.data();
              copyEggMoves(moves);
              transferEggMoves(eggMoves, currentId);
            }
          });
      }
    });
  });

function copyEggMoves(moves) {
  Object.keys(moves).forEach(key => {
    let currentMove = moves[key];
    if (currentMove.learnMethod.includes("egg")) {
      eggMoves.push(currentMove);
    }
  });
}

function transferEggMoves(eggMoves, currentId) {
  db.collection("pokemonMoves")
    .doc(currentId)
    .get()
    .then(doc => {
      if (doc.exists) {
        let moves = doc.data();

        eggMoves.forEach(eggMove => {

          if (moves.hasOwnProperty(eggMove.id)) {
            let currentMove = moves[eggMove.id];
            currentMove.learnMethod.push("egg");
            db.collection("pokemonMoves")
              .doc(currentId)
              .update({
                [eggMove.id]: currentMove
              });
          } else {
            db.collection("pokemonMoves")
              .doc(currentId)
              .update({
                [eggMove.id]: eggMove
              });
          }
        });
      }
    });
}