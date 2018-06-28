const db = require("./pokemon-firebase");

/**
 * CAREFUL USING THIS A LOT, IT ADDS TO DAILY LIMIT FOR FIRESTORE OPERATIONS
 */

// db.collection('pokemon').get().then(snapshot => {
//   console.log('All pokemon: ' + snapshot.size);
// })

// db.collection('pokemonMoves').get().then(snapshot => {
//   console.log('Pokemon with moves stored: ' + snapshot.size);
// })

// db.collection('pokemonShort').get().then(snapshot => {
//   console.log('Pokemon condensed: ' + snapshot.size);
// })

// db.collection('moves').get().then(snapshot => {
//   console.log('All moves: ' + snapshot.size);
// })

// db.collection('alternateForms').get().then(snapshot => {
//   console.log('Alternate forms: ' + snapshot.size);
// })