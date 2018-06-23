const axios = require('axios');
const db = require("./pokemon-firebase");
const FieldValue = require('firebase-admin').firestore.FieldValue;


db.collection('pokemon').get().then(snapshot => {
  snapshot.docs.forEach(doc => {
    db.collection('pokemon').doc(doc.id).update({
      newField: 'new value'
    })
  })
})

