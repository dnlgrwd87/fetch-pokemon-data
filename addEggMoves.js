const db = require("./pokemon-firebase");
const axios = require("axios");

// LAST ADDED WAS BLASTOISE WITH BASE ID 7

let prevBaseId = 0;
let eggMoves = [];

db.collection("pokemon")
  .where("baseId", "<=", 7)
  .get()
  .then(snap => {
    snap.docs.forEach(doc => {
      let data = doc.data();
      let baseId = data.baseId;
      let currentId = doc.id;
      db.collection("pokemonMoves")
        .doc(baseId.toString())
        .get()
        .then(doc => {
          if (doc.exists) {
            let moves = doc.data();
            if (baseId == prevBaseId) {
              transferEggMoves(eggMoves, currentId)
              console.log(data.name + ' has same id as previous pokemon, copying moves now');
            } else {
              if (prevBaseId != 0) {
                eggMoves = [];
                console.log('egg moves cleared');
              }
              console.log(data.name + ' does not have the same id as the previous pokemon, copying moves now');
              copyEggMoves(moves);
              transferEggMoves(eggMoves, currentId);
            }
          }
          prevBaseId = baseId;
        });
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
            eggMove.learnMethod = ['egg']; // makes sure move is only copied as egg move if not already known
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