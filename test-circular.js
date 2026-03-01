const { genesisPhase } = require("./dist/src/app/core/phases/genesisPhase.js");
console.log("genesisPhase moves:", Object.keys(genesisPhase.turn.stages.editing.moves));
