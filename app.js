const MAX_LOG = 400;
const GRID_SIZE = 20;
const INVENTORY_SIZE = 4;
const WEAPON_CAPACITY = {
  Pistol: 3,
  Shotgun: 2,
};
const PASSIVE_LIMIT = {
  Pistol: 9,
  Shotgun: 8,
};
const PLAYER_PRESETS = [
  { name: "Red", color: "#e55353" },
  { name: "Green", color: "#3fbf7f" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#f5c542" },
];

const state = {
  mapName: null,
  map: null,
  players: [],
  items: [],
  currentPlayerIndex: 0,
  round: 1,
  moves: 0,
  weaponPoints: 0,
  attackMode: null,
  log: [],
  seed: null,
  rng: null,
  nextItemId: 1,
};

const mapLibrary = {
  Maze: buildMazeMap(),
  Riverside: buildRiversideMap(),
};

const elements = {
  grid: document.getElementById("grid"),
  mapSelect: document.getElementById("mapSelect"),
  playerCount: document.getElementById("playerCount"),
  seedInput: document.getElementById("seedInput"),
  newGame: document.getElementById("newGame"),
  resetGame: document.getElementById("resetGame"),
  saveGame: document.getElementById("saveGame"),
  loadGame: document.getElementById("loadGame"),
  turnInfo: document.getElementById("turnInfo"),
  groundItems: document.getElementById("groundItems"),
  inventory: document.getElementById("inventory"),
  log: document.getElementById("log"),
  rollMin: document.getElementById("rollMin"),
  rollMax: document.getElementById("rollMax"),
  rollButton: document.getElementById("rollButton"),
  endTurn: document.getElementById("endTurn"),
  useMedkit: document.getElementById("useMedkit"),
};

function buildMazeMap() {
  const grid = makeEmptyGrid();
  addBorderWalls(grid);
  addRectWall(grid, 5, 2, 5, 18);
  addRectWall(grid, 15, 2, 15, 18);
  addRectWall(grid, 2, 5, 18, 5);
  addRectWall(grid, 2, 15, 18, 15);
  carveGaps(grid, [
    { x: 5, y: 8 },
    { x: 5, y: 12 },
    { x: 15, y: 7 },
    { x: 15, y: 13 },
    { x: 8, y: 5 },
    { x: 12, y: 5 },
    { x: 7, y: 15 },
    { x: 13, y: 15 },
  ]);
  placeSpawn(grid, [
    { x: 4, y: 4 },
    { x: 17, y: 4 },
    { x: 4, y: 17 },
    { x: 17, y: 17 },
  ]);
  return { name: "Maze", grid };
}

function buildRiversideMap() {
  const grid = makeEmptyGrid();
  addBorderWalls(grid);
  for (let y = 2; y <= 19; y += 1) {
    grid[y - 1][10] = "R";
    if (y % 3 !== 0) {
      grid[y - 1][11] = "R";
    }
  }
  addRectWall(grid, 3, 3, 3, 18);
  addRectWall(grid, 18, 3, 18, 18);
  carveGaps(grid, [
    { x: 3, y: 6 },
    { x: 3, y: 12 },
    { x: 18, y: 9 },
    { x: 18, y: 15 },
  ]);
  placeSpawn(grid, [
    { x: 6, y: 4 },
    { x: 14, y: 4 },
    { x: 6, y: 17 },
    { x: 14, y: 17 },
  ]);
  return { name: "Riverside", grid };
}

function makeEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ".")
  );
}

function addBorderWalls(grid) {
  for (let i = 0; i < GRID_SIZE; i += 1) {
    grid[0][i] = "W";
    grid[GRID_SIZE - 1][i] = "W";
    grid[i][0] = "W";
    grid[i][GRID_SIZE - 1] = "W";
  }
}

function addRectWall(grid, x1, y1, x2, y2) {
  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) {
      grid[y - 1][x - 1] = "W";
    }
  }
}

function carveGaps(grid, gaps) {
  gaps.forEach(({ x, y }) => {
    grid[y - 1][x - 1] = ".";
  });
}

function placeSpawn(grid, spots) {
  spots.forEach(({ x, y }) => {
    grid[y - 1][x - 1] = "S";
  });
}

function init() {
  Object.keys(mapLibrary).forEach((mapName) => {
    const option = document.createElement("option");
    option.value = mapName;
    option.textContent = mapName;
    elements.mapSelect.appendChild(option);
  });

  elements.newGame.addEventListener("click", () => startNewGame());
  elements.resetGame.addEventListener("click", () => startNewGame(true));
  elements.saveGame.addEventListener("click", saveGame);
  elements.loadGame.addEventListener("click", loadGame);
  elements.endTurn.addEventListener("click", endTurn);
  elements.useMedkit.addEventListener("click", useMedkit);
  elements.rollButton.addEventListener("click", rollRandom);

  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => handleMove(button.dataset.move));
  });
  document.querySelectorAll("[data-weapon]").forEach((button) => {
    button.addEventListener("click", () => enterAttackMode(Number(button.dataset.weapon)));
  });
  document.querySelectorAll("[data-reload]").forEach((button) => {
    button.addEventListener("click", () => reloadWeapon(Number(button.dataset.reload)));
  });
  document.querySelectorAll("[data-drop-weapon]").forEach((button) => {
    button.addEventListener("click", () => dropWeapon(Number(button.dataset.dropWeapon)));
  });

  buildGrid();
  startNewGame(true);
}

function buildGrid() {
  elements.grid.innerHTML = "";
  for (let y = 1; y <= GRID_SIZE; y += 1) {
    for (let x = 1; x <= GRID_SIZE; x += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.addEventListener("click", () => handleCellClick(x, y));
      elements.grid.appendChild(cell);
    }
  }
}

function startNewGame(keepMapSelection = false) {
  state.items = [];
  state.nextItemId = 1;
  state.log = [];
  state.attackMode = null;
  state.round = 1;
  state.currentPlayerIndex = 0;

  if (!keepMapSelection) {
    elements.mapSelect.value = elements.mapSelect.value || "Maze";
  }
  const mapName = elements.mapSelect.value || "Maze";
  state.mapName = mapName;
  state.map = cloneMap(mapLibrary[mapName]);

  const count = Number(elements.playerCount.value);
  state.players = createPlayers(count);

  const seedValue = elements.seedInput.value ? Number(elements.seedInput.value) : Date.now();
  state.seed = seedValue;
  state.rng = mulberry32(seedValue);

  assignSpawnPoints();
  startTurn();
  logEvent(`New game started on ${mapName} with seed ${seedValue}.`);
  render();
}

function cloneMap(map) {
  return {
    name: map.name,
    grid: map.grid.map((row) => [...row]),
  };
}

function createPlayers(count) {
  return Array.from({ length: count }, (_, index) => {
    const preset = PLAYER_PRESETS[index];
    return {
      id: index + 1,
      name: preset.name,
      color: preset.color,
      status: "Alive",
      x: 0,
      y: 0,
      health: 3,
      headArmor: 0,
      bodyArmor: 0,
      leftArmArmor: 0,
      rightArmArmor: 0,
      leftLegArmor: 0,
      rightLegArmor: 0,
      weapons: [
        { weaponName: "Pistol", activeAmmo: 3, passiveAmmo: 3 },
        { weaponName: "Knife", activeAmmo: 0, passiveAmmo: 0 },
      ],
      frags: 0,
      deaths: 0,
      inventory: [],
    };
  });
}

function assignSpawnPoints() {
  const spawns = [];
  state.map.grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "S") {
        spawns.push({ x: x + 1, y: y + 1 });
      }
    });
  });
  const fallback = { x: 2, y: 2 };

  state.players.forEach((player, index) => {
    const spawn = spawns[index] || fallback;
    player.x = spawn.x;
    player.y = spawn.y;
  });
}

function startTurn() {
  const player = getCurrentPlayer();
  if (player.status === "Dead") {
    respawnPlayer(player);
  }
  updateActionPoints(player);
  if (player.id === 1 && state.round % 5 === 1) {
    spawnCrate();
  }
  logEvent(`Turn ${state.round} player ${player.name}.`);
}

function updateActionPoints(player) {
  state.moves = calculateMoves(player);
  state.weaponPoints = calculateWeaponPoints(player);
}

function calculateMoves(player) {
  const leftDamaged = player.leftLegArmor < 0;
  const rightDamaged = player.rightLegArmor < 0;
  if (leftDamaged && rightDamaged) return 0;
  if (leftDamaged || rightDamaged) return 1;
  return 3;
}

function calculateWeaponPoints(player) {
  const leftDamaged = player.leftArmArmor < 0;
  const rightDamaged = player.rightArmArmor < 0;
  if (leftDamaged && rightDamaged) return 0;
  return 1;
}

function handleMove(direction) {
  if (state.attackMode) {
    logEvent("Cancel target selection to move.");
    return;
  }
  const delta = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
  }[direction];

  attemptMove(delta.dx, delta.dy);
}

function attemptMove(dx, dy) {
  const player = getCurrentPlayer();
  if (state.moves <= 0) {
    logEvent("No move points left.");
    return;
  }
  const nextX = player.x + dx;
  const nextY = player.y + dy;
  if (!isWithinBounds(nextX, nextY)) {
    logEvent("Cannot move outside map.");
    return;
  }
  const cellType = getCellType(nextX, nextY);
  if (cellType === "W" || cellType === "R") {
    logEvent("Blocked by obstacle.");
    return;
  }
  if (getPlayerAt(nextX, nextY)) {
    logEvent("Another player occupies that cell.");
    return;
  }

  player.x = nextX;
  player.y = nextY;
  state.moves -= 1;
  handleCratePickup(nextX, nextY);
  render();
}

function handleCratePickup(x, y) {
  const crateIndex = state.items.findIndex(
    (item) => item.type === "Crate" && item.x === x && item.y === y
  );
  if (crateIndex === -1) return;
  state.items.splice(crateIndex, 1);
  const prizeRoll = roll(1, 6);
  logEvent("Crate opened.");
  createCratePrize(prizeRoll, x, y);
  render();
}

function createCratePrize(rollValue, x, y) {
  switch (rollValue) {
    case 1:
      addGroundItem({
        displayName: "Medkit",
        category: "Medkit",
        quantity: 1,
      }, x, y);
      logEvent("Crate contains Medkit.");
      break;
    case 2:
      addGroundItem({
        displayName: "Shotgun ammo (4)",
        category: "Ammo",
        quantity: 4,
        additional: "Shotgun",
      }, x, y);
      addGroundItem({
        displayName: "Pistol ammo (6)",
        category: "Ammo",
        quantity: 6,
        additional: "Pistol",
      }, x, y);
      logEvent("Crate contains ammo pack.");
      break;
    case 3:
      addGroundItem({
        displayName: "Shotgun",
        category: "Weapon",
        quantity: 2,
        additional: "Shotgun",
      }, x, y);
      addGroundItem({
        displayName: "Shotgun ammo (4)",
        category: "Ammo",
        quantity: 4,
        additional: "Shotgun",
      }, x, y);
      logEvent("Crate contains shotgun kit.");
      break;
    case 4:
      [
        { part: "Head", label: "Helmet" },
        { part: "Body", label: "Body armor" },
        { part: "Left Arm", label: "Left arm armor" },
        { part: "Right Arm", label: "Right arm armor" },
        { part: "Left Leg", label: "Left leg armor" },
        { part: "Right Leg", label: "Right leg armor" },
      ].forEach((armor) => {
        addGroundItem({
          displayName: armor.label,
          category: "Armor",
          quantity: 1,
          additional: armor.part,
        }, x, y);
      });
      logEvent("Crate contains full armor (+1).");
      break;
    case 5: {
      const partRoll = roll(1, 6);
      const partMap = [
        "Body",
        "Left Arm",
        "Right Arm",
        "Left Leg",
        "Right Leg",
        "Head",
      ];
      const part = partMap[partRoll - 1];
      addGroundItem({
        displayName: `${part} armor (+3)`,
        category: "Armor",
        quantity: 3,
        additional: part,
      }, x, y);
      logEvent(`Crate contains +3 armor for ${part}.`);
      break;
    }
    case 6:
      addGroundItem({
        displayName: "Sword",
        category: "Weapon",
        quantity: 0,
        additional: "Sword",
      }, x, y);
      logEvent("Crate contains a Sword.");
      break;
    default:
      break;
  }
}

function spawnCrate() {
  const available = [];
  for (let y = 1; y <= GRID_SIZE; y += 1) {
    for (let x = 1; x <= GRID_SIZE; x += 1) {
      const cell = getCellType(x, y);
      if (cell === "W" || cell === "R") continue;
      if (getPlayerAt(x, y)) continue;
      if (state.items.some((item) => item.type === "Crate" && item.x === x && item.y === y)) {
        continue;
      }
      available.push({ x, y });
    }
  }
  if (available.length === 0) return;
  const spot = available[roll(0, available.length - 1)];
  state.items.push({
    id: getNextItemId(),
    type: "Crate",
    x: spot.x,
    y: spot.y,
    displayName: "Supply Crate",
  });
  logEvent("Supply crate spawned.");
}

function enterAttackMode(slot) {
  const player = getCurrentPlayer();
  if (player.weapons[slot].weaponName === "None") {
    logEvent("No weapon in that slot.");
    return;
  }
  state.attackMode = { slot };
  render();
}

function handleCellClick(x, y) {
  if (!state.attackMode) return;
  const slot = state.attackMode.slot;
  state.attackMode = null;
  executeAttack(slot, x, y);
}

function executeAttack(slot, targetX, targetY) {
  const attacker = getCurrentPlayer();
  const weapon = attacker.weapons[slot];

  if (state.weaponPoints <= 0) {
    logEvent("No weapon points left.");
    return;
  }
  if (attacker.leftArmArmor < 0 && attacker.rightArmArmor < 0) {
    logEvent("You have no usable arms.");
    return;
  }
  const distance = Math.abs(targetX - attacker.x) + Math.abs(targetY - attacker.y);
  if (distance > 6) {
    logEvent("Target is too far.");
    return;
  }
  if (["Pistol", "Shotgun"].includes(weapon.weaponName) && weapon.activeAmmo <= 0) {
    logEvent("Out of ammo.");
    return;
  }
  const target = getPlayerAt(targetX, targetY);
  if (!target) {
    logEvent("No target on that cell.");
    return;
  }

  const shots = ["Shotgun", "Sword"].includes(weapon.weaponName) ? 2 : 1;
  const distancePenalty = attacker.leftArmArmor < 0 || attacker.rightArmArmor < 0 ? 2 : 0;

  for (let shot = 0; shot < shots; shot += 1) {
    const distanceCheck = roll(1, 6);
    if (distanceCheck - distancePenalty >= distance) {
      applyHit(attacker, target);
      if (target.status === "Dead") {
        break;
      }
    } else {
      logEvent(`${attacker.name} missed (roll ${distanceCheck}).`);
    }
  }

  state.weaponPoints = Math.max(0, state.weaponPoints - 1);
  if (["Pistol", "Shotgun"].includes(weapon.weaponName)) {
    weapon.activeAmmo = Math.max(0, weapon.activeAmmo - 1);
  } else {
    state.moves = 0;
  }

  render();
}

function applyHit(attacker, target) {
  const bodyCheck = roll(1, 6);
  let part = "Body";
  if (bodyCheck >= 4) {
    const partCheck = roll(1, 6);
    const parts = ["Body", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Head"];
    part = parts[partCheck - 1];
  }

  logEvent(`${attacker.name} hit ${target.name} in ${part}.`);
  applyDamage(target, part, attacker);
}

function applyDamage(target, part, attacker) {
  switch (part) {
    case "Body":
      if (target.bodyArmor > 0) {
        target.bodyArmor -= 1;
      } else {
        target.health -= 1;
      }
      if (target.health <= 0) {
        handleDeath(attacker, target);
      }
      break;
    case "Head":
      target.headArmor -= 1;
      if (target.headArmor < 0) {
        handleDeath(attacker, target);
      }
      break;
    case "Left Arm":
      target.leftArmArmor -= 1;
      break;
    case "Right Arm":
      target.rightArmArmor -= 1;
      break;
    case "Left Leg":
      target.leftLegArmor -= 1;
      break;
    case "Right Leg":
      target.rightLegArmor -= 1;
      break;
    default:
      break;
  }
}

function handleDeath(attacker, target) {
  target.status = "Dead";
  target.deaths += 1;
  if (attacker) {
    attacker.frags += 1;
  }
  logEvent(`${target.name} died.`);
  dropPlayerLoot(target);
  target.x = 0;
  target.y = 0;
}

function dropPlayerLoot(player) {
  const { x, y } = player;
  if (!x || !y) return;

  player.weapons.forEach((weapon) => {
    if (weapon.weaponName !== "None" && weapon.weaponName !== "Knife") {
      addGroundItem({
        displayName: weapon.weaponName,
        category: "Weapon",
        quantity: weapon.activeAmmo,
        additional: weapon.weaponName,
      }, x, y);
      if (weapon.passiveAmmo > 0) {
        addGroundItem({
          displayName: `${weapon.weaponName} ammo (${weapon.passiveAmmo})`,
          category: "Ammo",
          quantity: weapon.passiveAmmo,
          additional: weapon.weaponName,
        }, x, y);
      }
    }
    weapon.weaponName = "None";
    weapon.activeAmmo = 0;
    weapon.passiveAmmo = 0;
  });

  player.inventory.forEach((item) => {
    addGroundItem(item, x, y);
  });
  player.inventory = [];

  const armorDrops = [
    { part: "Head", value: player.headArmor, label: "Helmet" },
    { part: "Body", value: player.bodyArmor, label: "Body armor" },
    { part: "Left Arm", value: player.leftArmArmor, label: "Left arm armor" },
    { part: "Right Arm", value: player.rightArmArmor, label: "Right arm armor" },
    { part: "Left Leg", value: player.leftLegArmor, label: "Left leg armor" },
    { part: "Right Leg", value: player.rightLegArmor, label: "Right leg armor" },
  ];
  armorDrops.forEach((armor) => {
    if (armor.value > 0) {
      addGroundItem({
        displayName: armor.label,
        category: "Armor",
        quantity: armor.value,
        additional: armor.part,
      }, x, y);
    }
  });
}

function respawnPlayer(player) {
  const spawnPoints = [];
  state.map.grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "S") {
        spawnPoints.push({ x: x + 1, y: y + 1 });
      }
    });
  });
  const openSpawns = spawnPoints.filter(
    (spawn) => !getPlayerAt(spawn.x, spawn.y)
  );
  const spawn = openSpawns.length
    ? openSpawns[roll(0, openSpawns.length - 1)]
    : { x: 2, y: 2 };

  player.status = "Alive";
  player.x = spawn.x;
  player.y = spawn.y;
  player.health = 3;
  player.headArmor = 0;
  player.bodyArmor = 0;
  player.leftArmArmor = 0;
  player.rightArmArmor = 0;
  player.leftLegArmor = 0;
  player.rightLegArmor = 0;
  player.weapons = [
    { weaponName: "Pistol", activeAmmo: 3, passiveAmmo: 0 },
    { weaponName: "Knife", activeAmmo: 0, passiveAmmo: 0 },
  ];
  player.inventory = [];
  logEvent(`${player.name} respawned.`);
}

function reloadWeapon(slot) {
  const player = getCurrentPlayer();
  const weapon = player.weapons[slot];
  if (!WEAPON_CAPACITY[weapon.weaponName]) {
    logEvent("This weapon cannot be reloaded.");
    return;
  }
  const maxAmmo = WEAPON_CAPACITY[weapon.weaponName];
  if (weapon.activeAmmo >= maxAmmo) {
    logEvent("Weapon already full.");
    return;
  }
  if (weapon.passiveAmmo <= 0) {
    logEvent("No spare ammo.");
    return;
  }
  const needed = maxAmmo - weapon.activeAmmo;
  const toLoad = Math.min(needed, weapon.passiveAmmo);
  weapon.activeAmmo += toLoad;
  weapon.passiveAmmo -= toLoad;
  logEvent(`Reloaded ${weapon.weaponName} by ${toLoad}.`);
  render();
}

function dropWeapon(slot) {
  const player = getCurrentPlayer();
  const weapon = player.weapons[slot];
  if (weapon.weaponName === "None") {
    logEvent("Nothing to drop.");
    return;
  }
  addGroundItem({
    displayName: weapon.weaponName,
    category: "Weapon",
    quantity: weapon.activeAmmo,
    additional: weapon.weaponName,
  }, player.x, player.y);
  if (weapon.passiveAmmo > 0) {
    addGroundItem({
      displayName: `${weapon.weaponName} ammo (${weapon.passiveAmmo})`,
      category: "Ammo",
      quantity: weapon.passiveAmmo,
      additional: weapon.weaponName,
    }, player.x, player.y);
  }
  player.weapons[slot] = { weaponName: "None", activeAmmo: 0, passiveAmmo: 0 };
  render();
}

function useMedkit() {
  const player = getCurrentPlayer();
  const medkitIndex = player.inventory.findIndex((item) => item.category === "Medkit");
  if (medkitIndex === -1) {
    logEvent("No medkit in inventory.");
    return;
  }
  player.health = 3;
  if (player.leftLegArmor === -1) player.leftLegArmor = 0;
  if (player.rightLegArmor === -1) player.rightLegArmor = 0;
  if (player.leftArmArmor === -1) player.leftArmArmor = 0;
  if (player.rightArmArmor === -1) player.rightArmArmor = 0;
  player.inventory.splice(medkitIndex, 1);
  logEvent("Medkit was used.");
  render();
}

function endTurn() {
  state.attackMode = null;
  state.currentPlayerIndex += 1;
  if (state.currentPlayerIndex >= state.players.length) {
    state.currentPlayerIndex = 0;
    state.round += 1;
  }
  startTurn();
  render();
}

function handleGroundItemAction(itemId, action, slot) {
  const itemIndex = state.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return;
  const item = state.items[itemIndex];
  const player = getCurrentPlayer();

  switch (action) {
    case "equip":
      if (item.category === "Weapon") {
        equipWeapon(item, slot, itemIndex);
      } else if (item.category === "Ammo") {
        equipAmmo(item, slot, itemIndex);
      } else if (item.category === "Armor") {
        equipArmor(item, itemIndex);
      } else {
        logEvent("Item cannot be equipped.");
      }
      break;
    case "take":
      takeItem(item, itemIndex, player);
      break;
    case "destroy":
      state.items.splice(itemIndex, 1);
      logEvent("Item destroyed.");
      break;
    default:
      break;
  }
  render();
}

function equipWeapon(item, slot, itemIndex) {
  const player = getCurrentPlayer();
  if (player.weapons[slot].weaponName !== "None") {
    logEvent("Drop your current weapon first.");
    return;
  }
  player.weapons[slot] = {
    weaponName: item.additional,
    activeAmmo: item.quantity,
    passiveAmmo: 0,
  };
  state.items.splice(itemIndex, 1);
  logEvent(`${item.additional} equipped in slot ${slot + 1}.`);
}

function equipAmmo(item, slot, itemIndex) {
  const player = getCurrentPlayer();
  const weapon = player.weapons[slot];
  if (weapon.weaponName !== item.additional) {
    logEvent("This ammo doesn't fit to your gun.");
    return;
  }
  const limit = PASSIVE_LIMIT[item.additional] || 0;
  const space = limit - weapon.passiveAmmo;
  if (space <= 0) {
    logEvent("No space for more ammo.");
    return;
  }
  const toAdd = Math.min(space, item.quantity);
  weapon.passiveAmmo += toAdd;
  const leftover = item.quantity - toAdd;
  state.items.splice(itemIndex, 1);
  if (leftover > 0) {
    addGroundItem({
      displayName: `${item.additional} ammo (${leftover})`,
      category: "Ammo",
      quantity: leftover,
      additional: item.additional,
    }, player.x, player.y);
  }
  logEvent(`Ammo equipped to slot ${slot + 1}.`);
}

function equipArmor(item, itemIndex) {
  const player = getCurrentPlayer();
  const part = item.additional;
  const partMap = {
    Head: "headArmor",
    Body: "bodyArmor",
    "Left Arm": "leftArmArmor",
    "Right Arm": "rightArmArmor",
    "Left Leg": "leftLegArmor",
    "Right Leg": "rightLegArmor",
  };
  const targetKey = partMap[part];
  if (!targetKey) return;
  if ((part === "Left Arm" && player.leftArmArmor < 0)
    || (part === "Right Arm" && player.rightArmArmor < 0)
    || (part === "Left Leg" && player.leftLegArmor < 0)
    || (part === "Right Leg" && player.rightLegArmor < 0)) {
    logEvent("You can't wear it on damaged body part.");
    return;
  }
  const currentValue = player[targetKey];
  if (currentValue > 0) {
    addGroundItem({
      displayName: `${part} armor (${currentValue})`,
      category: "Armor",
      quantity: currentValue,
      additional: part,
    }, player.x, player.y);
  }
  player[targetKey] = item.quantity;
  state.items.splice(itemIndex, 1);
  logEvent(`${part} armor equipped.`);
}

function takeItem(item, itemIndex, player) {
  if (player.inventory.length >= INVENTORY_SIZE) {
    logEvent("Inventory is full.");
    return;
  }
  player.inventory.push(stripItem(item));
  state.items.splice(itemIndex, 1);
  logEvent("Item added to inventory.");
}

function dropInventoryItem(index) {
  const player = getCurrentPlayer();
  if (!player.inventory[index]) return;
  const item = player.inventory.splice(index, 1)[0];
  addGroundItem(item, player.x, player.y);
  logEvent("Inventory item dropped.");
  render();
}

function addGroundItem(item, x, y) {
  state.items.push({
    id: getNextItemId(),
    type: "GroundItem",
    x,
    y,
    displayName: item.displayName,
    category: item.category,
    quantity: item.quantity,
    additional: item.additional,
  });
}

function rollRandom() {
  const min = Number(elements.rollMin.value);
  const max = Number(elements.rollMax.value);
  if (Number.isNaN(min) || Number.isNaN(max) || min > max) {
    logEvent("Invalid roll range.");
    return;
  }
  const value = roll(min, max);
  logEvent(`Rolled ${value} (range ${min}-${max}).`);
}

function getCurrentPlayer() {
  return state.players[state.currentPlayerIndex];
}

function getPlayerAt(x, y) {
  return state.players.find(
    (player) => player.status === "Alive" && player.x === x && player.y === y
  );
}

function getCellType(x, y) {
  return state.map.grid[y - 1][x - 1];
}

function isWithinBounds(x, y) {
  return x >= 1 && x <= GRID_SIZE && y >= 1 && y <= GRID_SIZE;
}

function render() {
  renderGrid();
  renderTurnInfo();
  renderGroundItems();
  renderInventory();
  renderLog();
}

function renderGrid() {
  const cells = elements.grid.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.innerHTML = "";
  });

  state.map.grid.forEach((row, y) => {
    row.forEach((cellType, x) => {
      const index = y * GRID_SIZE + x;
      const cell = cells[index];
      if (!cell) return;
      if (cellType === "W") cell.classList.add("wall");
      if (cellType === "R") cell.classList.add("river");
      if (cellType === "S") cell.classList.add("spawn");
    });
  });

  state.items.forEach((item) => {
    if (item.type === "Crate") {
      const cell = getCellElement(item.x, item.y);
      if (cell) cell.textContent = "📦";
    }
  });

  state.players.forEach((player) => {
    if (player.status !== "Alive") return;
    const cell = getCellElement(player.x, player.y);
    if (!cell) return;
    const token = document.createElement("div");
    token.className = "player-token";
    token.style.background = player.color;
    token.textContent = String(player.id);
    cell.appendChild(token);
  });

  if (state.attackMode) {
    const player = getCurrentPlayer();
    const cellsToHighlight = elements.grid.querySelectorAll(".cell");
    cellsToHighlight.forEach((cell) => {
      const x = Number(cell.dataset.x);
      const y = Number(cell.dataset.y);
      const distance = Math.abs(x - player.x) + Math.abs(y - player.y);
      if (distance <= 6) {
        cell.classList.add("targeting");
      }
    });
  }
}

function renderTurnInfo() {
  const player = getCurrentPlayer();
  const weaponInfo = player.weapons
    .map((weapon, index) => {
      if (weapon.weaponName === "None") return `Slot ${index + 1}: Empty`;
      return `Slot ${index + 1}: ${weapon.weaponName} (${weapon.activeAmmo}/${weapon.passiveAmmo})`;
    })
    .join("<br />");

  elements.turnInfo.innerHTML = `
    <span><strong>Round:</strong> ${state.round}</span>
    <span><strong>Current player:</strong> ${player.name}</span>
    <span><strong>Status:</strong> ${player.status}</span>
    <span><strong>Moves:</strong> ${state.moves}</span>
    <span><strong>Weapon points:</strong> ${state.weaponPoints}</span>
    <span><strong>HP:</strong> ${player.health}</span>
    <span><strong>Head/Body:</strong> ${player.headArmor} / ${player.bodyArmor}</span>
    <span><strong>Arms:</strong> L ${player.leftArmArmor} / R ${player.rightArmArmor}</span>
    <span><strong>Legs:</strong> L ${player.leftLegArmor} / R ${player.rightLegArmor}</span>
    <span><strong>Frags/Deaths:</strong> ${player.frags} / ${player.deaths}</span>
    <span><strong>Weapons:</strong><br />${weaponInfo}</span>
  `;
}

function renderGroundItems() {
  const player = getCurrentPlayer();
  const items = state.items.filter(
    (item) => item.type === "GroundItem" && item.x === player.x && item.y === player.y
  );
  elements.groundItems.innerHTML = "";
  if (items.length === 0) {
    elements.groundItems.innerHTML = '<div class="muted">No items here.</div>';
    return;
  }
  items.slice(0, 8).forEach((item) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <span>${item.displayName}</span>
      <button data-action="equip" data-slot="0">Equip A</button>
      <button data-action="equip" data-slot="1">Equip B</button>
      <button data-action="take">Take</button>
      <button data-action="destroy">Destroy</button>
    `;
    row.querySelectorAll("button").forEach((button) => {
      const action = button.dataset.action;
      button.addEventListener("click", () => {
        const slot = button.dataset.slot ? Number(button.dataset.slot) : null;
        handleGroundItemAction(item.id, action, slot ?? 0);
      });
    });
    elements.groundItems.appendChild(row);
  });
}

function renderInventory() {
  const player = getCurrentPlayer();
  elements.inventory.innerHTML = "";
  if (player.inventory.length === 0) {
    elements.inventory.innerHTML = '<div class="muted">Inventory is empty.</div>';
    return;
  }
  player.inventory.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "inventory-row";
    row.innerHTML = `
      <span>${item.displayName}</span>
      <button>Drop</button>
    `;
    row.querySelector("button").addEventListener("click", () => dropInventoryItem(index));
    elements.inventory.appendChild(row);
  });
}

function renderLog() {
  elements.log.innerHTML = "";
  state.log.slice(-MAX_LOG).forEach((entry) => {
    const row = document.createElement("div");
    row.className = "log-entry";
    row.textContent = entry;
    elements.log.appendChild(row);
  });
}

function getCellElement(x, y) {
  return elements.grid.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function logEvent(message) {
  state.log.push(message);
  if (state.log.length > MAX_LOG) {
    state.log.shift();
  }
}

function roll(min, max) {
  return Math.floor(state.rng() * (max - min + 1)) + min;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function saveGame() {
  const payload = JSON.stringify(state);
  localStorage.setItem("cellshot-save", payload);
  logEvent("Game saved to local storage.");
  renderLog();
}

function loadGame() {
  const payload = localStorage.getItem("cellshot-save");
  if (!payload) {
    logEvent("No save found.");
    renderLog();
    return;
  }
  const data = JSON.parse(payload);
  Object.assign(state, data);
  state.rng = mulberry32(state.seed);
  logEvent("Game loaded.");
  elements.mapSelect.value = state.mapName;
  render();
}

function stripItem(item) {
  return {
    displayName: item.displayName,
    category: item.category,
    quantity: item.quantity,
    additional: item.additional,
  };
}

function getNextItemId() {
  state.nextItemId += 1;
  return state.nextItemId;
}

init();
