const axios = require("axios");
const url = "https://pokeapi.co/api/v2/evolution-chain/";

for (let i = 47; i <= 47; i++) {
  // 423 is the last evolution stage available
  axios.get(url + i).then(response => {
    let evoBase = response.data.chain;

    let currentEvoLevel = null;

    let evoTrigger = null;

    // get first pokemon name in evo chain
    let currentName = previousName = evoBase.species.name;

    // set currentEvo to next pokemon in chain
    let currentEvo = evoBase.evolves_to;

    while (currentEvo) {

      for (let i = 0; i < currentEvo.length; i++) {
        console.log("Evochain #" + (i + 1));

        let details = currentEvo[i].evolution_details[0];
        let triggerItem = null;

        currentName = currentEvo[i].species.name;
        currentEvoLevel = details.min_level;
        currentTrigger = details.trigger.name;
        triggerItem = details.item ? details.item.name : "no trigger item";

        console.log(
          previousName +
            " evolves into " +
            currentName +
            " at level " +
            currentEvoLevel + " by " + currentTrigger + " with " + triggerItem
        );
      }
      previousName = currentName;

      // set current evolution stage to next stage
      currentEvo = currentEvo[0] ? currentEvo[0].evolves_to : null;
      console.log("\n");
    }
  });
}
