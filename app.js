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
  crateInterval: 5,
  lastActionMessage: "—",
  nextItemId: 1,
};

const MAZE_LAYOUT = `
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|S||||||W||||||W|S|W|W|W
W|W|W|W|W|W||||W|W|W|W|W||||W|W|W
W|W|W|||||W||W||||||W|W|W|W|W
W|W|W|||||W||||||||||W|W|W
W|W|W|||W||W|W||W|W|||W|||W|W|W
W|W|W|||W||W||||W|||W|||W|W|W
W|W|W||W|W||||||||W|W|W||W|W|W
W|W|W|||W||W||||W||||||W|W|W
W|W|W|W||W||W|W||W|W|W|W|W|||W|W|W
W|W|W|||W||||||||W||||W|W|W
W|W|W||W|W|W|W|W||W|W||W|W||W|W|W|W
W|W|W|||W|||W||W|||||||W|W|W
W|W|W|||W|||||W|W|W|W||||W|W|W
W|W|W|S|||||||||||||S|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
`;

const RIVERSIDE_LAYOUT = `
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|||W||||||S|R|R|R||W||||S|W
W|||||||||R|R|R|||||W|||W
W|||W|||||R|R|R|W|||W||W|||W
W|W|W|W|R|R||R|R|W|W|W|||W||W|W||W
W|||R|R|R||R||W|||||W|||||W
W|R|R|R|R||||||||||W||W|W|W|W
W|R|R|R|S||||||||||W|||||W
W|||||W|W|||W||W|W|W|W|W|W||W|W
W|||||||||W|||||||W|||W
W|||||||||W||W|W||W|||||W
W|||||||||W|||||W|W|W|W||W
W|||||||||W||W||||||||W
W|||||||||W||W||W|W||W|W||W
W||W|W||W|W|||W||W|||W||W|S||W
W||W||||W|||W||W||W|W||W|W||W
W||W|S|||W|||||W||W||||||W
W||W|W|W|W|W|||W|W|W||W|W|W|W|W||W
W|||||||||||||||||||W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
`;

const mapLibrary = {
  Maze: buildFixedMap("Maze", MAZE_LAYOUT),
  Riverside: buildFixedMap("Riverside", RIVERSIDE_LAYOUT),
};

const elements = {
  grid: document.getElementById("grid"),
  mapSelect: document.getElementById("mapSelect"),
  playerCount: document.getElementById("playerCount"),
  seedInput: document.getElementById("seedInput"),
  crateInterval: document.getElementById("crateInterval"),
  newGame: document.getElementById("newGame"),
  resetGame: document.getElementById("resetGame"),
  saveGame: document.getElementById("saveGame"),
  loadGame: document.getElementById("loadGame"),
  turnInfo: document.getElementById("turnInfo"),
  playerSummary: document.getElementById("playerSummary"),
  groundItems: document.getElementById("groundItems"),
  inventory: document.getElementById("inventory"),
  log: document.getElementById("log"),
  lastActionMessage: document.getElementById("lastActionMessage"),
  endTurn: document.getElementById("endTurn"),
  useMedkit: document.getElementById("useMedkit"),
};

function buildFixedMap(name, layout) {
  const rows = layout
    .trim()
    .split("\n")
    .map((line) => line.trim());
  const grid = rows.map((row) =>
    row.split("|").map((cell) => (cell === "" ? "." : cell))
  );
  return { name, grid };
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

  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => handleMove(button.dataset.move));
  });

  document.addEventListener("keydown", handleHotkeys);

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
  state.lastActionMessage = "—";

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
  state.crateInterval = Math.max(1, Number(elements.crateInterval.value) || 5);

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
  let safety = 0;
  while (safety < state.players.length) {
    const player = getCurrentPlayer();
    if (player.status === "Dead") {
      const respawned = respawnPlayer(player);
      if (respawned) {
        logEvent(`${player.name} respawned and skips the turn.`);
      } else {
        logEvent(`${player.name} cannot respawn and skips the turn.`);
      }
      advanceTurn();
      safety += 1;
      continue;
    }
    updateActionPoints(player);
    const interval = Math.max(1, Number(state.crateInterval) || 1);
    if (player.id === 1 && (state.round - 1) % interval === 0) {
      spawnCrate();
    }
    logEvent(`Turn ${state.round} player ${player.name}.`);
    return;
  }
  logEvent("No active players to take a turn.");
}

function updateActionPoints(player) {
  state.moves = calculateMoves(player);
  state.weaponPoints = calculateWeaponPoints(player);
}

function calculateMoves(player) {
  const leftDamaged = player.leftLegArmor < 0;
  const rightDamaged = player.rightLegArmor < 0;
  let baseMoves = 3;
  if (leftDamaged && rightDamaged) {
    baseMoves = 0;
  } else if (leftDamaged || rightDamaged) {
    baseMoves = 1;
  }
  return baseMoves + getMoveBonus(player);
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

function handleHotkeys(event) {
  if (event.repeat) return;
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (["input", "select", "textarea"].includes(activeTag)) return;
  const key = event.key.toLowerCase();
  if (state.attackMode && /^\d$/.test(key)) {
    event.preventDefault();
    handleTargetHotkey(Number(key));
    return;
  }
  const moveMap = {
    arrowup: "up",
    w: "up",
    arrowdown: "down",
    s: "down",
    arrowleft: "left",
    a: "left",
    arrowright: "right",
    d: "right",
  };
  if (moveMap[key]) {
    event.preventDefault();
    handleMove(moveMap[key]);
    return;
  }
  if (key === "1" || key === "2") {
    event.preventDefault();
    enterAttackMode(Number(key) - 1);
    return;
  }
  if (key === "e" || key === "enter") {
    event.preventDefault();
    endTurn();
  }
}

function handleTargetHotkey(targetId) {
  if (!state.attackMode) return;
  const attacker = getCurrentPlayer();
  const target = state.players.find(
    (player) => player.id === targetId && player.status === "Alive"
  );
  if (!target) {
    logEvent("Target is not available.");
    return;
  }
  if (target.id === attacker.id) {
    logEvent("Cannot target yourself.");
    return;
  }
  const slot = state.attackMode.slot;
  state.attackMode = null;
  executeAttack(slot, target.x, target.y);
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
  const prizeRoll = roll(1, 7);
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
    case 7:
      addGroundItem({
        displayName: "Exoskeleton",
        category: "Exoskeleton",
        quantity: 1,
      }, x, y);
      logEvent("Crate contains an Exoskeleton.");
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
      if (state.items.some((item) => item.x === x && item.y === y)) continue;
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
  const weaponName = player.weapons[slot].weaponName;
  if (["Knife", "Sword"].includes(weaponName)) {
    const targets = getPotentialTargets(player, weaponName);
    if (targets.length === 1) {
      executeAttack(slot, targets[0].x, targets[0].y);
      return;
    }
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
  const range = getWeaponRange(weapon.weaponName);
  if (distance > range) {
    logEvent("Target is too far.");
    return;
  }
  if (!canTargetCell(attacker, weapon.weaponName, targetX, targetY)) {
    logEvent("Line of sight blocked by wall.");
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
  const shotReports = [];

  for (let shot = 0; shot < shots; shot += 1) {
    const distanceCheck = roll(1, 6);
    if (distanceCheck - distancePenalty >= distance) {
      const hitInfo = applyHit(attacker, target);
      const locationDetails = hitInfo.partRoll
        ? `location roll ${hitInfo.bodyRoll}, part roll ${hitInfo.partRoll} -> ${hitInfo.part}`
        : `location roll ${hitInfo.bodyRoll} -> ${hitInfo.part}`;
      let report = `Shot ${shot + 1}: hit (roll ${distanceCheck}), ${locationDetails}.`;
      if (hitInfo.killed) {
        report += ` ${target.name} died (hit ${hitInfo.part}).`;
      }
      logEvent(report);
      shotReports.push(report);
      if (hitInfo.killed) {
        break;
      }
    } else {
      const report = `Shot ${shot + 1}: missed (roll ${distanceCheck}).`;
      logEvent(report);
      shotReports.push(report);
    }
  }

  state.weaponPoints = Math.max(0, state.weaponPoints - 1);
  if (["Pistol", "Shotgun"].includes(weapon.weaponName)) {
    weapon.activeAmmo = Math.max(0, weapon.activeAmmo - 1);
  } else {
    state.moves = 0;
  }

  if (shotReports.length > 0) {
    setLastActionMessage(`${attacker.name} attacked ${target.name}: ${shotReports.join(" ")}`);
  }
  render();
}

function applyHit(attacker, target) {
  const bodyCheck = roll(1, 6);
  let part = "Body";
  let partCheck = null;
  if (bodyCheck >= 4) {
    partCheck = roll(1, 6);
    const parts = ["Body", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Head"];
    part = parts[partCheck - 1];
  }

  const wasAlive = target.status === "Alive";
  applyDamage(target, part, attacker);
  const killed = wasAlive && target.status === "Dead";
  return {
    part,
    bodyRoll: bodyCheck,
    partRoll: partCheck,
    killed,
  };
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
        handleDeath(attacker, target, part);
      }
      break;
    case "Head":
      target.headArmor -= 1;
      if (target.headArmor < 0) {
        handleDeath(attacker, target, part);
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

function handleDeath(attacker, target, part) {
  target.status = "Dead";
  target.deaths += 1;
  if (attacker) {
    attacker.frags += 1;
  }
  logEvent(`${target.name} died (hit ${part}).`);
  dropPlayerLoot(target);
  target.x = 0;
  target.y = 0;
}

function dropPlayerLoot(player) {
  const { x, y } = player;
  if (!x || !y) return;

  player.weapons.forEach((weapon) => {
    if (weapon.weaponName !== "None" && weapon.weaponName !== "Knife" && weapon.weaponName !== "Pistol") {
      addGroundItem({
        displayName: weapon.weaponName,
        category: "Weapon",
        quantity: weapon.activeAmmo,
        additional: weapon.weaponName,
      }, x, y);
    }
    if (weapon.weaponName === "Pistol") {
      const ammoTotal = weapon.activeAmmo + weapon.passiveAmmo;
      if (ammoTotal > 0) {
        addGroundItem({
          displayName: `Pistol ammo (${ammoTotal})`,
          category: "Ammo",
          quantity: ammoTotal,
          additional: "Pistol",
        }, x, y);
      }
    } else if (weapon.passiveAmmo > 0) {
      addGroundItem({
        displayName: `${weapon.weaponName} ammo (${weapon.passiveAmmo})`,
        category: "Ammo",
        quantity: weapon.passiveAmmo,
        additional: weapon.weaponName,
      }, x, y);
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
  if (openSpawns.length === 0) {
    return false;
  }
  const spawn = openSpawns[roll(0, openSpawns.length - 1)];

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
  return true;
}

function reloadWeapon(slot) {
  const player = getCurrentPlayer();
  const weapon = player.weapons[slot];
  if (!WEAPON_CAPACITY[weapon.weaponName]) {
    logEvent("This weapon cannot be reloaded.");
    return;
  }
  if (state.weaponPoints <= 0) {
    logEvent("No weapon points left.");
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
  state.weaponPoints = Math.max(0, state.weaponPoints - 1);
  logEvent(`Reloaded ${weapon.weaponName} by ${toLoad}.`);
  render();
}

function dropWeapon(slot) {
  const player = getCurrentPlayer();
  const dropped = dropWeaponFromSlot(player, slot, player.x, player.y);
  if (!dropped) {
    logEvent("Nothing to drop.");
    return;
  }
  logEvent(`${dropped} dropped.`);
  render();
}

function dropWeaponFromSlot(player, slot, x, y) {
  const weapon = player.weapons[slot];
  if (weapon.weaponName === "None") {
    return null;
  }
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
  const name = weapon.weaponName;
  player.weapons[slot] = { weaponName: "None", activeAmmo: 0, passiveAmmo: 0 };
  return name;
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
  advanceTurn();
  startTurn();
  render();
}

function advanceTurn() {
  state.currentPlayerIndex += 1;
  if (state.currentPlayerIndex >= state.players.length) {
    state.currentPlayerIndex = 0;
    state.round += 1;
  }
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
    const dropped = dropWeaponFromSlot(player, slot, player.x, player.y);
    if (dropped) {
      logEvent(`${dropped} dropped from slot ${slot + 1}.`);
    }
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
  const hadExoskeleton = player.inventory.some((entry) => entry.category === "Exoskeleton");
  player.inventory.push(stripItem(item));
  state.items.splice(itemIndex, 1);
  if (item.category === "Exoskeleton" && !hadExoskeleton) {
    state.moves += 2;
  }
  logEvent("Item added to inventory.");
}

function dropInventoryItem(index) {
  const player = getCurrentPlayer();
  if (!player.inventory[index]) return;
  const item = player.inventory.splice(index, 1)[0];
  addGroundItem(item, player.x, player.y);
  if (item.category === "Exoskeleton") {
    const stillHasExoskeleton = player.inventory.some(
      (entry) => entry.category === "Exoskeleton"
    );
    if (!stillHasExoskeleton) {
      state.moves = Math.max(0, state.moves - 2);
    }
  }
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

function getWeaponRange(weaponName) {
  if (weaponName === "Knife" || weaponName === "Sword") {
    return 1;
  }
  return 6;
}

function canTargetCell(attacker, weaponName, x, y) {
  if (!isWithinBounds(x, y)) return false;
  if (getCellType(x, y) === "W") return false;
  const distance = Math.abs(x - attacker.x) + Math.abs(y - attacker.y);
  const range = getWeaponRange(weaponName);
  if (distance > range) return false;
  if (range === 1) {
    return distance === 1;
  }
  return hasLineOfSight(attacker.x, attacker.y, x, y);
}

function getPotentialTargets(attacker, weaponName) {
  return state.players.filter((player) => {
    if (player.status !== "Alive") return false;
    if (player.id === attacker.id) return false;
    return canTargetCell(attacker, weaponName, player.x, player.y);
  });
}

function hasLineOfSight(x1, y1, x2, y2) {
  let x = x1;
  let y = y1;
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (!(x === x2 && y === y2)) {
    const err2 = 2 * err;
    if (err2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (err2 < dx) {
      err += dx;
      y += sy;
    }
    if (x === x2 && y === y2) break;
    if (getCellType(x, y) === "W") {
      return false;
    }
  }
  return true;
}

function render() {
  renderGrid();
  renderTurnInfo();
  renderPlayerSummary();
  renderControls();
  renderLastAction();
  renderGroundItems();
  renderInventory();
  renderLog();
}

function renderGrid() {
  const cells = elements.grid.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.innerHTML = "";
    cell.removeAttribute("data-tooltip");
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

  const occupiedByPlayer = new Set(
    state.players
      .filter((player) => player.status === "Alive")
      .map((player) => `${player.x},${player.y}`)
  );
  const cratesByCell = new Set(
    state.items
      .filter((item) => item.type === "Crate")
      .map((item) => `${item.x},${item.y}`)
  );
  const groundItemsByCell = new Map();
  state.items
    .filter((item) => item.type === "GroundItem")
    .forEach((item) => {
      const key = `${item.x},${item.y}`;
      if (!groundItemsByCell.has(key)) {
        groundItemsByCell.set(key, []);
      }
      groundItemsByCell.get(key).push(item.displayName);
    });
  const itemCells = new Set(
    state.items
      .filter((item) => item.type === "Crate" || item.type === "GroundItem")
      .map((item) => `${item.x},${item.y}`)
  );
  itemCells.forEach((key) => {
    if (occupiedByPlayer.has(key)) return;
    const [x, y] = key.split(",").map(Number);
    const cell = getCellElement(x, y);
    if (cell) {
      cell.classList.add("has-items");
      if (!cratesByCell.has(key) && groundItemsByCell.has(key)) {
        cell.dataset.tooltip = groundItemsByCell.get(key).join("\n");
      }
    }
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
    const weaponName = player.weapons[state.attackMode.slot].weaponName;
    const cellsToHighlight = elements.grid.querySelectorAll(".cell");
    cellsToHighlight.forEach((cell) => {
      const x = Number(cell.dataset.x);
      const y = Number(cell.dataset.y);
      if (canTargetCell(player, weaponName, x, y)) {
        cell.classList.add("targeting");
      }
    });
  }
}

function renderTurnInfo() {
  const player = getCurrentPlayer();
  const moveDisplayMax = player.inventory.some((item) => item.category === "Exoskeleton") ? 5 : 3;
  const weaponInfo = player.weapons
    .map((weapon, index) => {
      const canReload = Boolean(WEAPON_CAPACITY[weapon.weaponName]);
      const disabled = weapon.weaponName === "None" ? "disabled" : "";
      return `
      <div class="weapon-card">
        <div class="weapon-title">Slot ${index + 1}</div>
        <div class="weapon-name">${weapon.weaponName}</div>
        <div class="weapon-ammo">${
    weapon.weaponName === "None"
      ? "—"
      : `${weapon.activeAmmo}/${weapon.passiveAmmo}`
  }</div>
        <div class="weapon-actions">
          <button data-weapon="${index}" ${disabled}>Attack</button>
          ${canReload ? `<button data-reload="${index}" ${disabled}>Reload</button>` : ""}
          <button data-drop-weapon="${index}" ${disabled}>Drop</button>
        </div>
      </div>
    `;
    })
    .join("");

  elements.turnInfo.innerHTML = `
    <div class="turn-header">
      <div class="badge">Round ${state.round}</div>
      <div class="badge player-badge" style="--player-color: ${player.color}">
        ${player.name}
      </div>
      <div class="badge status-${player.status.toLowerCase()}">${player.status}</div>
    </div>
    <div class="turn-layout">
      <div class="avatar-panel">
        <div class="avatar">
          ${renderAvatarParts(player)}
        </div>
        <div class="hp-row">${renderHearts(player.health)}</div>
      </div>
      <div class="action-panel">
        <div class="action-group">
          <span class="action-label">Moves</span>
          <div class="point-boxes">${renderPointBoxes(state.moves, moveDisplayMax)}</div>
        </div>
        <div class="action-group">
          <span class="action-label">Weapon</span>
          <div class="point-boxes">${renderPointBoxes(state.weaponPoints, 1)}</div>
        </div>
        <div class="stat-pills">
          <div class="stat-pill">Frags ${player.frags}</div>
          <div class="stat-pill">Deaths ${player.deaths}</div>
        </div>
      </div>
      <div class="weapon-panel">
        ${weaponInfo}
      </div>
    </div>
  `;

  elements.turnInfo.querySelectorAll("[data-weapon]").forEach((button) => {
    button.addEventListener("click", () => enterAttackMode(Number(button.dataset.weapon)));
  });
  elements.turnInfo.querySelectorAll("[data-reload]").forEach((button) => {
    button.addEventListener("click", () => reloadWeapon(Number(button.dataset.reload)));
  });
  elements.turnInfo.querySelectorAll("[data-drop-weapon]").forEach((button) => {
    button.addEventListener("click", () => dropWeapon(Number(button.dataset.dropWeapon)));
  });
}

function renderAvatarParts(player) {
  return `
    <div class="body-part head ${partStateClass(player.headArmor)}">
      ${renderArmorBadge(player.headArmor)}
    </div>
    <div class="body-part torso ${partStateClass(player.bodyArmor)}">
      ${renderArmorBadge(player.bodyArmor)}
    </div>
    <div class="body-part arm left ${partStateClass(player.leftArmArmor)}">
      ${renderArmorBadge(player.leftArmArmor)}
    </div>
    <div class="body-part arm right ${partStateClass(player.rightArmArmor)}">
      ${renderArmorBadge(player.rightArmArmor)}
    </div>
    <div class="body-part leg left ${partStateClass(player.leftLegArmor)}">
      ${renderArmorBadge(player.leftLegArmor)}
    </div>
    <div class="body-part leg right ${partStateClass(player.rightLegArmor)}">
      ${renderArmorBadge(player.rightLegArmor)}
    </div>
  `;
}

function renderPlayerSummary() {
  if (!elements.playerSummary) return;
  elements.playerSummary.innerHTML = state.players
    .map((player) => {
      const weaponSummary = player.weapons
        .map((weapon, index) => `Slot ${index + 1}: ${weapon.weaponName}`)
        .join("<br />");
      return `
        <div class="player-summary-card">
          <div class="mini-avatar">
            <div class="avatar">
              ${renderAvatarParts(player)}
            </div>
          </div>
          <div class="player-summary-main">
            <div class="player-summary-header">
              <span class="player-color-dot" style="--player-color: ${player.color}"></span>
              <span>${player.name}</span>
              <span class="muted">${player.status}</span>
            </div>
            <div class="hp-row">${renderHearts(player.health)}</div>
            <div class="player-summary-stats">
              <span>Frags ${player.frags}</span>
              <span>Deaths ${player.deaths}</span>
            </div>
            <div class="player-summary-weapons">
              ${weaponSummary}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderControls() {
  const player = getCurrentPlayer();
  const hasMedkit = player.inventory.some((item) => item.category === "Medkit");
  elements.useMedkit.style.display = hasMedkit ? "inline-flex" : "none";
  const endTurnIsDanger = state.moves === 0 && state.weaponPoints === 0;
  elements.endTurn.classList.toggle("danger", endTurnIsDanger);
}

function partStateClass(value) {
  if (value < 0) return "is-damaged";
  if (value > 0) return "is-armored";
  return "is-healthy";
}

function renderArmorBadge(value) {
  if (value > 0) {
    return `<span class="armor-tag">+${value}</span>`;
  }
  if (value < 0) {
    return '<span class="armor-tag broken">✕</span>';
  }
  return "";
}

function renderHearts(count) {
  return Array.from({ length: 3 }, (_, index) => `
    <span class="heart ${index < count ? "full" : "empty"}">❤</span>
  `).join("");
}

function renderPointBoxes(count, max) {
  return Array.from({ length: max }, (_, index) => `
    <span class="point-box ${index < count ? "filled" : ""}">${index + 1}</span>
  `).join("");
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
      ${renderGroundItemButtons(item)}
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

function renderGroundItemButtons(item) {
  const buttons = [];
  if (item.category === "Armor") {
    buttons.push({ label: "Equip", action: "equip" });
    buttons.push({ label: "Take", action: "take" });
  } else if (item.category === "Exoskeleton") {
    buttons.push({ label: "Take", action: "take" });
    buttons.push({ label: "Destroy", action: "destroy" });
  } else if (item.category === "Medkit") {
    buttons.push({ label: "Take", action: "take" });
    buttons.push({ label: "Destroy", action: "destroy" });
  } else if (item.category === "Weapon") {
    buttons.push({ label: "Equip A", action: "equip", slot: 0 });
    buttons.push({ label: "Equip B", action: "equip", slot: 1 });
    buttons.push({ label: "Take", action: "take" });
    buttons.push({ label: "Destroy", action: "destroy" });
  } else if (item.category === "Ammo") {
    buttons.push({ label: "Equip A", action: "equip", slot: 0 });
    buttons.push({ label: "Equip B", action: "equip", slot: 1 });
    buttons.push({ label: "Take", action: "take" });
    buttons.push({ label: "Destroy", action: "destroy" });
  } else {
    buttons.push({ label: "Take", action: "take" });
    buttons.push({ label: "Destroy", action: "destroy" });
  }

  return buttons
    .map(
      (button) => `
        <button data-action="${button.action}"${button.slot !== undefined ? ` data-slot="${button.slot}"` : ""}>
          ${button.label}
        </button>
      `
    )
    .join("");
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

function renderLastAction() {
  if (elements.lastActionMessage) {
    const entries = state.log.slice(-5).reverse();
    if (entries.length === 0) {
      elements.lastActionMessage.textContent = "—";
      return;
    }
    elements.lastActionMessage.innerHTML = entries
      .map((entry) => `<div class="action-entry">${entry}</div>`)
      .join("");
  }
}

function getCellElement(x, y) {
  return elements.grid.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function setLastActionMessage(message) {
  state.lastActionMessage = message;
  if (elements.lastActionMessage) {
    renderLastAction();
  }
}

function logEvent(message) {
  state.log.push(message);
  setLastActionMessage(message);
  if (state.log.length > MAX_LOG) {
    state.log.shift();
  }
}

function getMoveBonus(player) {
  const hasExoskeleton = player.inventory.some((item) => item.category === "Exoskeleton");
  return hasExoskeleton ? 2 : 0;
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
  elements.crateInterval.value = state.crateInterval || 5;
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
