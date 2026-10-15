let phase = 1;
let phaseTimer = 0;

function updatePhase() {
  phaseTimer++;

  if (phaseTimer > 1500 && phase === 1) {
    phase = 2;
    spawnGreekTradeRoutes();
  }

  if (phaseTimer > 3000 && phase === 2) {
    phase = 3;
    spawnRomanRoads();
  }
}

function spawnGreekTradeRoutes() {
  for (let i = 0; i < 10; i++) {
    resources.push({
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
      type: "ship"
    });
  }
}

function spawnRomanRoads() {
  for (let i = 0; i < 10; i++) {
    resources.push({
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
      type: "road"
    });
  }
}
