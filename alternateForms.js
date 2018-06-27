const db = require("./pokemon-firebase");
const axios = require("axios");


db.collection('pokemon').where('alternateForms', '==', true).get().then(snapshot => {
  console.log(snapshot.size);
  snapshot.docs.forEach(doc => {
    axios.get("https://pokeapi.co/api/v2/pokemon-species/" + doc.id).then(response => {
      // addFormsToDatabase(response.data.varieties, doc.id);
      console.log('forms for ' + response.data.varieties[0].pokemon.name + ' added successfully');
    })
  })
})

function addFormsToDatabase(forms, id) {
  forms.forEach(form => {
    let currentForm = {
      id: parseInt(form.pokemon.url.slice(34, form.pokemon.url.length - 1)),
      name: form.pokemon.name,
      sprite: id + '.png'
    }
    let formToAdd = {
      [currentForm.id]: currentForm
    }
    db.collection('alternateForms').doc(id).set(formToAdd, {
      merge: true
    });
  })
}