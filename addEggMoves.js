const db = require("./pokemon-firebase");
const axios = require("axios");

let prevBaseId = 0;
let eggMoves = [];

// last updated was fearow
// next to update is arbok

db.collection("pokemon")
  .where("baseId", ">=", 10)
  .where("baseId", "<=", 19)
  .get()
  .then(snap => {
    snap.docs.forEach(doc => {
      let data = doc.data();
      let baseId = data.baseId;
      let currentId = doc.id;
      if (baseId == prevBaseId) {
        console.log(currentId + ' ' + data.name + ', ' + ' has the same base id as previous pokemon');
        transferEggMoves(eggMoves, currentId);
      } else {

        console.log(currentId + ' ' + data.name + ' has a different id than the previous pokemon');
        db.collection("pokemonMoves")
          .doc(baseId.toString())
          .get()
          .then(doc => {
            if (doc.exists) {
              let moves = doc.data();
              copyEggMoves(moves);
              transferEggMoves(eggMoves, currentId);
              eggMoves = [];
              prevBaseId = baseId;
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
            console.log(eggMove.name + ' egg move added');
          } else {
            db.collection("pokemonMoves")
              .doc(currentId)
              .update({
                [eggMove.id]: eggMove
              });
            console.log(eggMove.name + ' egg move added');
          }
        });
      }
    });
}