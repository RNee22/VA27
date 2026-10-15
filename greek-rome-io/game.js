const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const CELL = 20;
const COLS = canvas.width / CELL;
const ROWS = canvas.height / CELL;

// 0 = 空地；1 = 玩家領土；2 = 玩家軌跡
const grid = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => 0)
);

const player = {
  x: 10,
  y: 10,
  color: "#2f6fed",
  culture: 0,
  trade: 0,
  trail: []
};

const resources = [];

function spawnResource() {
  resources.push({
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
    type: ["olive", "pottery", "temple"][Math.floor(Math.random() * 3)]
  });
}

for (let i = 0; i < 30; i++) spawnResource();

// 起始領土
for (let y = 9; y <= 11; y++) {
  for (let x = 9; x <= 11; x++) {
    grid[y][x] = 1;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") player.y--;
  if (event.key === "ArrowDown") player.y++;
  if (event.key === "ArrowLeft") player.x--;
  if (event.key === "ArrowRight") player.x++;

  player.x = Math.max(0, Math.min(COLS - 1, player.x));
  player.y = Math.max(0, Math.min(ROWS - 1, player.y));

  handleCell(player.x, player.y);
});

function handleCell(x, y) {
  // 吃資源
  const index = resources.findIndex(r => r.x === x && r.y === y);
  if (index !== -1) {
    const resource = resources[index];
    if (resource.type === "olive") player.trade++;
    if (resource.type === "pottery") player.trade++;
    if (resource.type === "temple") player.culture++;
    resources.splice(index, 1);
    spawnResource();
  }

  // 在自己領土上：關閉軌跡，占領圍起來的區域
  if (grid[y][x] === 1 && player.trail.length > 0) {
    claimTerritory();
    player.trail = [];
    return;
  }

  // 在空地：留下軌跡
  if (grid[y][x] === 0) {
    grid[y][x] = 2;
    player.trail.push({ x, y });
  }
}

// 簡化版：把軌跡與軌跡周圍一格變成領土
// 之後再改成真正的 flood-fill 圍地
function claimTerritory() {
  for (const cell of player.trail) {
    grid[cell.y][cell.x] = 1;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = cell.y + dy;
        const nx = cell.x + dx;
        if (
          ny >= 0 && ny < ROWS &&
          nx >= 0 && nx < COLS &&
          grid[ny][nx] === 0
        ) {
          grid[ny][nx] = 1;
        }
      }
    }
  }
}

function updateUI() {
  document.getElementById("culture").textContent = player.culture;
  document.getElementById("trade").textContent = player.trade;

  let land = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell === 1) land++;
    }
  }
  document.getElementById("land").textContent = land;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === 1) {
        ctx.fillStyle = "#bcd7ff";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
      if (grid[y][x] === 2) {
        ctx.fillStyle = "#ffd166";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  for (const resource of resources) {
    if (resource.type === "olive") ctx.fillStyle = "#6aa84f";
    if (resource.type === "pottery") ctx.fillStyle = "#b5651d";
    if (resource.type === "temple") ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(
      resource.x * CELL + CELL / 2,
      resource.y * CELL + CELL / 2,
      CELL / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x * CELL, player.y * CELL, CELL, CELL);

  updateUI();
  requestAnimationFrame(draw);
}

draw();
