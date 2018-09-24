const db = require("./pokemon-firebase");
const axios = require("axios");
const typeUrl = "https://pokeapi.co/api/v2/type/";


// for (let i = 2; i <= 18; i++) {
  axios.get(typeUrl + 18).then(response => {
    const data = response.data;
    const name = data.name;
    const halfDamageFrom = getDamageRealations(data.damage_relations.half_damage_from);
    const noDamageFrom = getDamageRealations(data.damage_relations.no_damage_from);
    const halfDamageTo = getDamageRealations(data.damage_relations.half_damage_to);
    const doubleDamageFrom = getDamageRealations(data.damage_relations.double_damage_from);
    const noDamageTo = getDamageRealations(data.damage_relations.no_damage_to);
    const doubleDamageTo = getDamageRealations(data.damage_relations.double_damage_to);

    db.collection("types").doc(name).set({
      name: name,
      halfDamageFrom: halfDamageFrom,
      noDamageFrom: noDamageFrom,
      halfDamageTo: halfDamageTo,
      doubleDamageFrom: doubleDamageFrom,
      noDamageTo: noDamageTo,
      doubleDamageTo: doubleDamageTo
    }, { merge: true })
  })
// }

function getDamageRealations(relation) {
  let relationTypes = [];
  relation.forEach(rel => {
    relationTypes.push(rel.name);
  })
  return relationTypes;
}

