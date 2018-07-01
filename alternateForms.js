const db = require("./pokemon-firebase");
const axios = require("axios");


db.collection('pokemon').where('alternateForms', '==', true).get().then(snapshot => {
  snapshot.docs.forEach(doc => {

    db.collection('alternateForms').doc(doc.id).get().then(doc => {
      if (!doc.exists) {
        axios.get("https://pokeapi.co/api/v2/pokemon-species/" + doc.id).then(response => {
          addFormsToDatabase(response.data.varieties, doc.id);
        })
      }
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
    if (form.pokemon.name.indexOf('mega') > -1) {
      currentForm.sprite = id + '-mega.png';
    } else if (form.pokemon.name.indexOf('alola') > -1) {
      currentForm.sprite = id + '-alolan.png';
    }
    let formToAdd = {
      [currentForm.id]: currentForm
    }

    db.collection('alternateForms').doc(id).get().then(doc => {
      db.collection('alternateForms').doc(id).set(formToAdd, {
        merge: true
      });
      console.log(form.pokemon.name + ' added successfully');
    })
  })
}