const db = require("./pokemon-firebase");

let url = 'https://pokeapi.co/api/v2/evolution-chain/1/';


db.collection('pokemon').get().then(snapshot => {
  snapshot.docs.forEach(doc => {
    db.collection('pokemon').doc(doc.id).update({
      newProp: 'new property!'
    })
  })
})