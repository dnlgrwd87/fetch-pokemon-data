const db = require("./pokemon-firebase");
const typesRef = db.collection("types");
const typeDefensesRef = db.collection("typeDefenses");
const shortRef = db.collection("pokemonShort");

for (let i = 551; i <= 802; i++) {
  getTypeDefenses(i);
}

function getTypeDefenses(i) {
  let typeDefenses = {
    normal: "neutral",
    fire: "neutral",
    fighting: "neutral",
    water: "neutral",
    flying: "neutral",
    grass: "neutral",
    poison: "neutral",
    electric: "neutral",
    ground: "neutral",
    psychic: "neutral",
    rock: "neutral",
    ice: "neutral",
    bug: "neutral",
    dragon: "neutral",
    ghost: "neutral",
    dark: "neutral",
    steel: "neutral",
    fairy: "neutral"
  };

  shortRef
    .doc(i.toString())
    .get()
    .then(doc => {
      const data = doc.data();
      const types = data.types.all;

      console.log(data.name);

      types.forEach(type => {
        typesRef
          .doc(type)
          .get()
          .then(doc => {
            let data = doc.data();
            typeDefenses = getHalf(data.halfDamageFrom, typeDefenses);
            typeDefenses = getDouble(data.doubleDamageFrom, typeDefenses);
            typeDefenses = getNone(data.noDamageFrom, typeDefenses);
            typeDefensesRef.doc(i.toString()).set(typeDefenses);
          });
      });
    });
}

function getNone(data, typeDefenses) {
  data.forEach(type => {
    typeDefenses[type] = "none";
  });
  return typeDefenses;
}

function getHalf(data, typeDefenses) {
  data.forEach(type => {
    if (typeDefenses[type] == "half") {
      typeDefenses[type] = "fourth";
    } else if (typeDefenses[type] == "double") {
      typeDefenses[type] = "neutral";
    } else if (typeDefenses[type] == "neutral") {
      typeDefenses[type] = "half";
    }
  });
  return typeDefenses;
}

function getDouble(data, typeDefenses) {
  data.forEach(type => {
    if (typeDefenses[type] == "half") {
      typeDefenses[type] = "neutral";
    } else if (typeDefenses[type] == "double") {
      typeDefenses[type] = "quadruple";
    } else {
      typeDefenses[type] = "double";
    }
  });
  return typeDefenses;
}
