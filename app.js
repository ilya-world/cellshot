const MAX_LOG = 400;
const GRID_SIZE = 20;
const INVENTORY_SIZE = 4;
const AI_ACTION_DELAY = 1000;
const GENERATED_MAP_NAME = "Generated";
const GENERATED_DEFAULT_SEED = "12345";
const GENERATED_DEFAULT_WALL_THICKNESS = 1;
const WEAPON_CAPACITY = {
  Pistol: 3,
  Shotgun: 2,
  Bazooka: 1,
};
const PASSIVE_LIMIT = {
  Pistol: 9,
  Shotgun: 8,
  Bazooka: 1,
};
const PLAYER_PRESETS = [
  { nameKey: "Red", color: "#e55353" },
  { nameKey: "Green", color: "#3fbf7f" },
  { nameKey: "Blue", color: "#3b82f6" },
  { nameKey: "Yellow", color: "#f5c542" },
];
const LANGUAGE_STORAGE_KEY = "cellshot-lang";
const translations = {
  ru: {
    start: {
      subtitle: "Тактический пошаговый grid-шутер для горячего кресла",
      tagHotSeat: "Hot-seat",
      tagTactical: "Тактика",
      rulesButton: "Правила и инструкции",
      mapTitle: "Выбор карты",
      mapLabel: "Карта",
      seedLabel: "Seed",
      seedRandom: "Случайный",
      wallThicknessLabel: "Толщина внешних стен",
      legendWalls: "Стены",
      legendRiver: "Река",
      legendSpawn: "Спавн",
      squadTitle: "Состав отряда",
      playerCountLabel: "Количество игроков",
      aiNote: "Можно выбрать AI для отдельного игрока",
      crateLabel: "Частота появления ящиков (N ходов)",
      fragLimitLabel: "Фрагов до победы",
      startButton: "Начать миссию",
    },
    game: {
      subtitle: "Тактический пошаговый grid-шутер (hot-seat)",
      newGame: "Новая игра",
      reset: "Сброс",
      save: "Сохранить",
      load: "Загрузить",
      rulesButton: "Правила и инструкции",
      lastAction: "Последние действия",
      turnPanel: "Панель хода",
      controlsTitle: "Управление",
      moveTitle: "Движение",
      endTurn: "Закончить ход",
      useMedkit: "Аптечка",
      playersTitle: "Игроки",
      groundItemsTitle: "ПРЕДМЕТЫ НА ЗЕМЛЕ",
      inventoryTitle: "Инвентарь",
      logTitle: "Журнал",
    },
    status: {
      Alive: "В строю",
      Dead: "Павший",
    },
    maps: {
      Maze: "Лабиринт",
      Riverside: "Речная долина",
      Rooms: "Комнаты",
      Flower: "Цветок",
      Generated: "Сгенерированная",
    },
    players: {
      Red: "Красный",
      Green: "Зеленый",
      Blue: "Синий",
      Yellow: "Желтый",
    },
    weapons: {
      Pistol: "Пистолет",
      Shotgun: "Дробовик",
      Bazooka: "Базука",
      Knife: "Нож",
      Sword: "Меч",
      None: "Нет",
    },
    armorParts: {
      Head: "Голова",
      Body: "Тело",
      "Left Arm": "Левая рука",
      "Right Arm": "Правая рука",
      "Left Leg": "Левая нога",
      "Right Leg": "Правая нога",
    },
    armorItems: {
      Head: "Шлем",
      Body: "Бронежилет",
      "Left Arm": "Броня левой руки",
      "Right Arm": "Броня правой руки",
      "Left Leg": "Броня левой ноги",
      "Right Leg": "Броня правой ноги",
    },
    items: {
      medkit: "Аптечка",
      exoskeleton: "Экзоскелет",
      supplyCrate: "Ящик снабжения",
      ammo: "Патроны {weapon} ({count})",
      armorValue: "{part} (+{value})",
    },
    ui: {
      playerLabel: "Игрок",
      aiLabel: "AI",
      slot: "Слот {slot}",
      attack: "Атака",
      reload: "Перезарядка",
      drop: "Выбросить",
      moves: "Ходы",
      weaponPoints: "Оружие",
      frags: "Фраги",
      deaths: "Смерти",
      round: "Раунд {round}",
      movePrompt: "Ходы",
      noItemsHere: "Здесь нет предметов.",
      inventoryEmpty: "Инвентарь пуст.",
      equip: "Экипировать",
      equipA: "Экип. A",
      equipB: "Экип. B",
      take: "Взять",
      destroy: "Уничтожить",
      dropItem: "Выбросить",
      slotWeapon: "Слот {slot}: {weapon}",
      shotLabel: "Выстрел {shot}",
      shotLabelRange: "Выстрелы {start}-{end}",
      hitSummary: "{attacker} попал в {part} игрока {target} из {weapon}",
      hitSummaryMulti: "{attacker} попал в {parts} игрока {target} из {weapon}",
      hitChance: "Шанс попадания {chance}%",
      beforeHit: "До попадания",
      afterHit: "После попадания",
      importantItems: "Важные предметы",
      statusBadge: "{status}",
      listSeparator: ", ",
      listConjunction: "и",
    },
    rules: {
      title: "Правила и инструкции",
      intro: "Короткая шпаргалка по основным механикам и горячим клавишам.",
      sections: [
        {
          title: "Цель матча",
          items: [
            "Оставайтесь последним живым отрядом на поле.",
            "Ящики дают оружие, броню и расходники.",
          ],
        },
        {
          title: "Ход игрока",
          items: [
            "Тратьте очки хода на перемещение.",
            "Очки оружия тратятся на атаки и перезарядку.",
            "Лечение аптечкой восстанавливает здоровье и конечности.",
          ],
        },
        {
          title: "Части тела и травмы",
          items: [
            "Голова: броня поглощает попадание, при значении ниже 0 — мгновенная смерть.",
            "Тело: сначала тратится броня, затем здоровье; при 0 здоровья игрок погибает.",
            "Руки: повреждение даёт штраф к попаданию, обе повреждённые руки — нельзя атаковать.",
            "Ноги: одна повреждённая нога оставляет 1 ход, обе — 0 ходов.",
            "Аптечка лечит здоровье и восстанавливает повреждённые конечности.",
          ],
        },
        {
          title: "Инвентарь и лут",
          items: [
            "Подбирайте предметы в инвентарь (до 4).",
            "Броню можно экипировать прямо с земли.",
            "Экипированное оружие заменяет слот A/B.",
          ],
        },
        {
          title: "Что бывает в ящиках",
          items: [
            "Аптечка — полностью восстанавливает здоровье и конечности.",
            "Набор патронов — патроны для пистолета, дробовика и базуки.",
            "Дробовик с патронами — оружие с двумя выстрелами за атаку.",
            "Полный комплект брони (+1) — шлем, бронежилет и броня конечностей.",
            "Броня +3 на случайную часть тела — усиливает выбранную часть.",
            "Меч — оружие ближнего боя на 2 удара.",
            "Экзоскелет — +2 к числу ходов в каждом раунде.",
            "Базука с боекомплектом — мощный выстрел с уроном по соседним частям.",
          ],
        },
      ],
      hotkeysTitle: "Горячие клавиши",
      hotkeys: [
        { key: "W/A/S/D или стрелки", action: "Перемещение" },
        { key: "1 / 2", action: "Атака оружием в слоте" },
        { key: "R", action: "Перезарядка доступного оружия" },
        { key: "E / Enter", action: "Закончить ход" },
        { key: "1-9 (в режиме атаки)", action: "Выбор цели по номеру игрока" },
      ],
    },
    victory: {
      title: "Победа!",
      message: "Побеждает {player}!",
      newGame: "Новая игра",
      continue: "Продолжить игру",
    },
    log: {
      newGame: "Новая игра на карте {map}, seed {seed}.",
      turnStart: "Ход {round}, игрок {player}.",
      noActivePlayers: "Нет активных игроков для хода.",
      respawnSkip: "{player} возродился и пропускает ход.",
      respawnFail: "{player} не может возродиться и пропускает ход.",
      cancelTargetMove: "Сначала отмените выбор цели.",
      targetUnavailable: "Цель недоступна.",
      targetSelf: "Нельзя выбрать себя в качестве цели.",
      noMovePoints: "Очки хода закончились.",
      moveOutside: "Нельзя выйти за пределы карты.",
      obstacleBlock: "Препятствие на пути.",
      cellOccupied: "Клетка занята другим игроком.",
      crateOpened: "Ящик открыт.",
      crateMedkit: "В ящике аптечка.",
      crateAmmoPack: "В ящике набор патронов.",
      crateShotgunKit: "В ящике дробовик с патронами.",
      crateFullArmor: "В ящике полный комплект брони (+1).",
      crateArmorPlus: "В ящике броня +3 для {part}.",
      crateSword: "В ящике меч.",
      crateExoskeleton: "В ящике экзоскелет.",
      crateBazooka: "В ящике базука с боекомплектом.",
      supplyCrateSpawned: "Появился ящик снабжения.",
      noWeaponSlot: "В этом слоте нет оружия.",
      noWeaponPoints: "Очки оружия закончились.",
      noArms: "Нельзя стрелять без рук.",
      targetTooFar: "Цель слишком далеко.",
      lineOfSightBlocked: "Линия огня перекрыта стеной.",
      outOfAmmo: "Патроны закончились.",
      noTarget: "В этой клетке нет цели.",
      shotHit: "Выстрел {shot}: попадание (шанс {chance}%), {location}.",
      shotMiss: "Выстрел {shot}: промах (шанс {chance}%). {attacker} стрелял в {target} из {weapon}.",
      locationRoll: "бросок {bodyRoll} → {part}",
      locationRollWithPart: "бросок {bodyRoll}, доп. {partRoll} → {part}",
      killedReport: "💀 {target} погиб (попадание в {part}).",
      attackReport: "{attacker} атакует {target}: {details}",
      dropWeapon: "{weapon} выброшен.",
      dropWeaponSlot: "{weapon} выброшен из слота {slot}.",
      nothingToDrop: "Нечего выбрасывать.",
      weaponEquipped: "{weapon} экипирован в слот {slot}.",
      ammoEquipped: "Патроны экипированы в слот {slot}.",
      ammoMismatch: "Эти патроны не подходят к оружию.",
      noAmmoSpace: "Нет места для патронов.",
      armorEquipped: "{part} экипирована.",
      armorDamaged: "Нельзя надеть на поврежденную часть.",
      inventoryFull: "Инвентарь заполнен.",
      itemAdded: "Предмет добавлен в инвентарь.",
      inventoryItemDropped: "Предмет выброшен из инвентаря.",
      itemDestroyed: "Предмет уничтожен.",
      weaponReloaded: "{weapon} перезаряжен на {count}.",
      weaponReloadedFull: "Оружие уже полное.",
      weaponReloadedNoAmmo: "Нет запасных патронов.",
      reloadUnavailable: "Это оружие нельзя перезарядить.",
      noWeaponToReload: "Нет оружия, доступного для перезарядки.",
      medkitMissing: "В инвентаре нет аптечки.",
      medkitUsed: "Аптечка использована.",
      saveDone: "Игра сохранена в локальное хранилище.",
      noSave: "Сохранение не найдено.",
      loadDone: "Игра загружена.",
      itemCannotEquip: "Предмет нельзя экипировать.",
    },
  },
  en: {
    start: {
      subtitle: "Turn-based tactical grid shooter for hot-seat play",
      tagHotSeat: "Hot-seat",
      tagTactical: "Tactical",
      rulesButton: "Rules & instructions",
      mapTitle: "Map selection",
      mapLabel: "Map",
      seedLabel: "Seed",
      seedRandom: "Randomize",
      wallThicknessLabel: "Outer wall thickness",
      legendWalls: "Walls",
      legendRiver: "River",
      legendSpawn: "Spawn",
      squadTitle: "Squad setup",
      playerCountLabel: "Player count",
      aiNote: "AI can be assigned per player",
      crateLabel: "Crate spawn frequency (N turns)",
      fragLimitLabel: "Frags to win",
      startButton: "Start mission",
    },
    game: {
      subtitle: "Turn-based tactical grid shooter (hot-seat)",
      newGame: "New game",
      reset: "Reset",
      save: "Save",
      load: "Load",
      rulesButton: "Rules & instructions",
      lastAction: "Last action",
      turnPanel: "Turn panel",
      controlsTitle: "Controls",
      moveTitle: "Move",
      endTurn: "End turn",
      useMedkit: "Medkit",
      playersTitle: "Players",
      groundItemsTitle: "GROUND ITEMS",
      inventoryTitle: "Inventory",
      logTitle: "Log",
    },
    status: {
      Alive: "Alive",
      Dead: "Dead",
    },
    maps: {
      Maze: "Maze",
      Riverside: "Riverside",
      Rooms: "Rooms",
      Flower: "Flower",
      Generated: "Generated",
    },
    players: {
      Red: "Red",
      Green: "Green",
      Blue: "Blue",
      Yellow: "Yellow",
    },
    weapons: {
      Pistol: "Pistol",
      Shotgun: "Shotgun",
      Bazooka: "Bazooka",
      Knife: "Knife",
      Sword: "Sword",
      None: "None",
    },
    armorParts: {
      Head: "Head",
      Body: "Body",
      "Left Arm": "Left arm",
      "Right Arm": "Right arm",
      "Left Leg": "Left leg",
      "Right Leg": "Right leg",
    },
    armorItems: {
      Head: "Helmet",
      Body: "Body armor",
      "Left Arm": "Left arm armor",
      "Right Arm": "Right arm armor",
      "Left Leg": "Left leg armor",
      "Right Leg": "Right leg armor",
    },
    items: {
      medkit: "Medkit",
      exoskeleton: "Exoskeleton",
      supplyCrate: "Supply crate",
      ammo: "{weapon} ammo ({count})",
      armorValue: "{part} armor (+{value})",
    },
    ui: {
      playerLabel: "Player",
      aiLabel: "AI",
      slot: "Slot {slot}",
      attack: "Attack",
      reload: "Reload",
      drop: "Drop",
      moves: "Moves",
      weaponPoints: "Weapon",
      frags: "Frags",
      deaths: "Deaths",
      round: "Round {round}",
      movePrompt: "Moves",
      noItemsHere: "No items here.",
      inventoryEmpty: "Inventory is empty.",
      equip: "Equip",
      equipA: "Equip A",
      equipB: "Equip B",
      take: "Take",
      destroy: "Destroy",
      dropItem: "Drop",
      slotWeapon: "Slot {slot}: {weapon}",
      shotLabel: "Shot {shot}",
      shotLabelRange: "Shots {start}-{end}",
      hitSummary: "{attacker} hit {target}'s {part} with {weapon}",
      hitSummaryMulti: "{attacker} hit {target}'s {parts} with {weapon}",
      hitChance: "Hit chance {chance}%",
      beforeHit: "Before hit",
      afterHit: "After hit",
      importantItems: "Important items",
      statusBadge: "{status}",
      listSeparator: ", ",
      listConjunction: "and",
    },
    rules: {
      title: "Rules & instructions",
      intro: "A quick cheat sheet for core mechanics and hotkeys.",
      sections: [
        {
          title: "Match goal",
          items: [
            "Be the last squad standing.",
            "Crates supply weapons, armor, and consumables.",
          ],
        },
        {
          title: "Turn flow",
          items: [
            "Spend move points to move.",
            "Weapon points are spent on attacks and reloads.",
            "Medkits restore health and damaged limbs.",
          ],
        },
        {
          title: "Body parts & injuries",
          items: [
            "Head: helmet absorbs hits; if it drops below 0, the target dies instantly.",
            "Body: armor absorbs first, then health; 0 health means death.",
            "Arms: damaged arms add an accuracy penalty; both damaged arms = no attacks.",
            "Legs: one damaged leg leaves 1 move, both leave 0 moves.",
            "Medkits restore health and repair damaged limbs.",
          ],
        },
        {
          title: "Inventory & loot",
          items: [
            "Pick up items into your inventory (up to 4).",
            "Armor can be equipped directly from the ground.",
            "Equipped weapons replace slot A/B.",
          ],
        },
        {
          title: "What's inside crates",
          items: [
            "Medkit — fully restores health and damaged limbs.",
            "Ammo pack — pistol, shotgun, and bazooka ammo.",
            "Shotgun kit — shotgun with extra ammo (two shots per attack).",
            "Full armor (+1) — helmet, body armor, and limb armor.",
            "+3 armor for a random body part — boosts that part.",
            "Sword — melee weapon with 2 strikes.",
            "Exoskeleton — +2 moves each round.",
            "Bazooka kit — heavy shot with splash damage to adjacent parts.",
          ],
        },
      ],
      hotkeysTitle: "Hotkeys",
      hotkeys: [
        { key: "W/A/S/D or arrows", action: "Move" },
        { key: "1 / 2", action: "Attack with slot weapon" },
        { key: "R", action: "Reload the first available weapon" },
        { key: "E / Enter", action: "End turn" },
        { key: "1-9 (attack mode)", action: "Target player number" },
      ],
    },
    victory: {
      title: "Victory!",
      message: "{player} wins!",
      newGame: "New game",
      continue: "Continue game",
    },
    log: {
      newGame: "New game on {map}, seed {seed}.",
      turnStart: "Turn {round}, player {player}.",
      noActivePlayers: "No active players to take a turn.",
      respawnSkip: "{player} respawned and skips the turn.",
      respawnFail: "{player} cannot respawn and skips the turn.",
      cancelTargetMove: "Cancel target selection before moving.",
      targetUnavailable: "Target is not available.",
      targetSelf: "Cannot target yourself.",
      noMovePoints: "No move points left.",
      moveOutside: "Cannot move outside map.",
      obstacleBlock: "Blocked by obstacle.",
      cellOccupied: "Another player occupies that cell.",
      crateOpened: "Crate opened.",
      crateMedkit: "Crate contains a medkit.",
      crateAmmoPack: "Crate contains ammo pack.",
      crateShotgunKit: "Crate contains a shotgun kit.",
      crateFullArmor: "Crate contains full armor (+1).",
      crateArmorPlus: "Crate contains +3 armor for {part}.",
      crateSword: "Crate contains a sword.",
      crateExoskeleton: "Crate contains an exoskeleton.",
      crateBazooka: "Crate contains a bazooka kit.",
      supplyCrateSpawned: "Supply crate spawned.",
      noWeaponSlot: "No weapon in that slot.",
      noWeaponPoints: "No weapon points left.",
      noArms: "You have no usable arms.",
      targetTooFar: "Target is too far.",
      lineOfSightBlocked: "Line of sight blocked by wall.",
      outOfAmmo: "Out of ammo.",
      noTarget: "No target on that cell.",
      shotHit: "Shot {shot}: hit (chance {chance}%), {location}.",
      shotMiss: "Shot {shot}: missed (chance {chance}%). {attacker} shot {target} with {weapon}.",
      locationRoll: "location roll {bodyRoll} → {part}",
      locationRollWithPart: "location roll {bodyRoll}, part roll {partRoll} → {part}",
      killedReport: "💀 {target} died (hit {part}).",
      attackReport: "{attacker} attacked {target}: {details}",
      dropWeapon: "{weapon} dropped.",
      dropWeaponSlot: "{weapon} dropped from slot {slot}.",
      nothingToDrop: "Nothing to drop.",
      weaponEquipped: "{weapon} equipped in slot {slot}.",
      ammoEquipped: "Ammo equipped to slot {slot}.",
      ammoMismatch: "This ammo doesn't fit your gun.",
      noAmmoSpace: "No space for more ammo.",
      armorEquipped: "{part} armor equipped.",
      armorDamaged: "You can't wear it on damaged body part.",
      inventoryFull: "Inventory is full.",
      itemAdded: "Item added to inventory.",
      inventoryItemDropped: "Inventory item dropped.",
      itemDestroyed: "Item destroyed.",
      weaponReloaded: "Reloaded {weapon} by {count}.",
      weaponReloadedFull: "Weapon already full.",
      weaponReloadedNoAmmo: "No spare ammo.",
      reloadUnavailable: "This weapon cannot be reloaded.",
      noWeaponToReload: "No weapon available to reload.",
      medkitMissing: "No medkit in inventory.",
      medkitUsed: "Medkit was used.",
      saveDone: "Game saved to local storage.",
      noSave: "No save found.",
      loadDone: "Game loaded.",
      itemCannotEquip: "Item cannot be equipped.",
    },
  },
};

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
  crateInterval: 3,
  fragLimit: 10,
  mapSeed: GENERATED_DEFAULT_SEED,
  wallThickness: GENERATED_DEFAULT_WALL_THICKNESS,
  lastActionMessage: null,
  nextItemId: 1,
  language: localStorage.getItem(LANGUAGE_STORAGE_KEY) || "ru",
  playerTypeSelections: [],
  aiTurnId: 0,
  victory: null,
  victoryAchieved: false,
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

const FLOWER_LAYOUT = `
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|S|.|.|.|.|W|W|.|.|.|.|S|W|W|W|W
W|W|W|W|.|.|.|.|.|.|W|.|.|.|.|.|W|W|W|W
W|W|W|W|.|.|.|.|.|.|.|.|.|.|.|.|W|W|W|W
W|W|W|W|.|.|.|R|R|R|.|.|R|.|.|.|W|W|W|W
W|W|W|W|.|.|.|.|.|.|.|.|R|.|.|.|W|W|W|W
W|W|W|W|W|W|.|.|.|.|.|.|R|.|W|W|W|W|W|W
W|W|W|W|W|.|.|R|.|.|.|.|.|.|.|.|W|W|W|W
W|W|W|W|.|.|.|R|.|.|.|.|.|.|.|.|.|W|W|W
W|W|W|W|.|.|.|R|.|.|R|R|R|.|.|.|W|W|W|W
W|W|W|W|.|.|.|.|.|.|.|.|.|.|.|.|W|W|W|W
W|W|W|W|.|.|.|.|.|.|W|.|.|.|.|.|W|W|W|W
W|W|W|W|S|.|.|.|.|W|W|.|.|.|.|S|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
`;

const ROOMS_LAYOUT = `
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
W|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|.|W
W|.|.|.|.|W|.|W|W|.|W|W|W|W|.|.|.|.|.|W
W|.|.|.|.|W|.|.|W|.|.|.|.|W|.|.|.|.|.|W
W|.|.|.|S|W|.|.|W|.|W|.|.|W|S|.|.|.|.|W
W|W|.|W|W|W|W|W|W|.|W|W|W|W|W|W|.|W|W|W
W|.|.|.|.|W|.|.|.|.|.|.|.|W|.|.|.|.|.|W
W|.|.|.|.|W|.|.|.|.|.|.|.|W|.|.|.|.|.|W
W|.|.|.|.|W|.|.|.|.|.|.|.|W|.|.|.|R|R|W
W|W|W|W|.|.|.|.|.|.|.|.|.|.|.|.|R|R|.|W
W|.|.|.|.|W|.|.|.|.|.|.|.|W|.|R|R|.|.|W
W|.|.|.|.|W|.|.|.|.|.|.|.|W|R|R|.|.|.|W
W|.|.|.|.|W|.|.|.|.|.|.|.|W|R|.|.|.|.|W
W|W|.|W|W|W|W|W|W|.|W|W|W|W|W|W|.|W|W|W
W|.|.|.|S|W|.|.|.|.|.|.|.|W|S|.|.|.|.|W
W|.|.|.|.|W|.|.|W|W|W|.|.|W|.|.|.|.|.|W
W|.|.|.|.|.|.|.|.|R|.|.|.|.|.|.|.|.|.|W
W|.|.|.|.|W|.|.|.|R|.|.|.|W|.|.|.|.|.|W
W|.|.|.|.|W|.|.|.|R|.|.|.|W|.|.|.|.|.|W
W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W|W
`;

const mapLibrary = {
  Maze: buildFixedMap("Maze", MAZE_LAYOUT),
  Riverside: buildFixedMap("Riverside", RIVERSIDE_LAYOUT),
  Rooms: buildFixedMap("Rooms", ROOMS_LAYOUT),
  Flower: buildFixedMap("Flower", FLOWER_LAYOUT),
  Generated: createEmptyMap(GENERATED_MAP_NAME),
};

const elements = {
  grid: document.getElementById("grid"),
  startScreen: document.getElementById("startScreen"),
  startGame: document.getElementById("startGame"),
  mapSelect: document.getElementById("mapSelect"),
  playerCount: document.getElementById("playerCount"),
  playerTypeList: document.getElementById("playerTypeList"),
  crateInterval: document.getElementById("crateInterval"),
  fragLimit: document.getElementById("fragLimit"),
  newGame: document.getElementById("newGame"),
  resetGame: document.getElementById("resetGame"),
  saveGame: document.getElementById("saveGame"),
  loadGame: document.getElementById("loadGame"),
  turnInfo: document.getElementById("turnInfo"),
  weaponPanel: document.getElementById("weaponPanel"),
  playerSummary: document.getElementById("playerSummary"),
  groundItems: document.getElementById("groundItems"),
  inventory: document.getElementById("inventory"),
  log: document.getElementById("log"),
  lastActionMessage: document.getElementById("lastActionMessage"),
  endTurn: document.getElementById("endTurn"),
  useMedkit: document.getElementById("useMedkit"),
  boardHeader: document.getElementById("boardHeader"),
  mapPreview: document.getElementById("mapPreview"),
  mapSeed: document.getElementById("mapSeed"),
  mapSeedRandom: document.getElementById("mapSeedRandom"),
  wallThickness: document.getElementById("wallThickness"),
  wallThicknessValue: document.getElementById("wallThicknessValue"),
  generatedMapSettings: document.getElementById("generatedMapSettings"),
  rulesModal: document.getElementById("rulesModal"),
  rulesContent: document.getElementById("rulesContent"),
  rulesTitle: document.getElementById("rulesTitle"),
  victoryModal: document.getElementById("victoryModal"),
  victoryMessage: document.getElementById("victoryMessage"),
  victoryNewGame: document.querySelector("[data-victory-new]"),
  victoryContinue: document.querySelector("[data-victory-continue]"),
};

function getTranslation(key, language = state.language) {
  return key.split(".").reduce((acc, part) => acc?.[part], translations[language]);
}

function t(key, vars = {}) {
  const template = getTranslation(key);
  if (typeof template !== "string") {
    return key;
  }
  return template.replace(/\{(\w+)\}/g, (_, token) => {
    if (vars[token] !== undefined) {
      return vars[token];
    }
    return `{${token}}`;
  });
}

function setLanguage(language) {
  if (!translations[language]) return;
  state.language = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language;
  updateLanguageButtons();
  updateStaticText();
  updateMapOptions();
  renderPlayerTypeList();
  if (state.map) {
    render();
  }
  renderRulesContent();
  if (state.victory) {
    updateVictoryMessage();
  }
}

function updateLanguageButtons() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === state.language);
  });
}

function updateStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
}

function updateMapOptions() {
  Array.from(elements.mapSelect.options).forEach((option) => {
    option.textContent = t(`maps.${option.value}`);
  });
}

function updateGeneratedSettingsVisibility() {
  if (!elements.generatedMapSettings) return;
  const isGenerated = elements.mapSelect.value === GENERATED_MAP_NAME;
  elements.generatedMapSettings.classList.toggle("is-hidden", !isGenerated);
}

function renderRulesContent() {
  const rules = getTranslation("rules");
  if (!rules || !elements.rulesContent) return;
  elements.rulesTitle.textContent = rules.title;
  const sections = rules.sections
    .map((section) => `
      <div class="rules-block">
        <h3>${section.title}</h3>
        <ul>
          ${section.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `)
    .join("");
  const hotkeys = rules.hotkeys
    .map((hotkey) => `<span><strong>${hotkey.key}</strong><span>${hotkey.action}</span></span>`)
    .join("");
  elements.rulesContent.innerHTML = `
    <p class="muted">${rules.intro}</p>
    <div class="rules-grid">${sections}</div>
    <div>
      <h3>${rules.hotkeysTitle}</h3>
      <div class="rules-hotkeys">${hotkeys}</div>
    </div>
  `;
}

function getPlayerLabel(player) {
  if (player.nameKey) {
    return t(`players.${player.nameKey}`);
  }
  if (player.name) {
    return player.name;
  }
  return "";
}

function getPlayerLabelById(playerId) {
  const player = state.players.find((entry) => entry.id === playerId);
  return player ? getPlayerLabel(player) : "";
}

function getStyledPlayerLabelById(playerId) {
  const player = state.players.find((entry) => entry.id === playerId);
  if (!player) return "";
  return `<span class="player-name" style="color: ${player.color}">${getPlayerLabel(player)}</span>`;
}

function getPlayerColorById(playerId) {
  const player = state.players.find((entry) => entry.id === playerId);
  return player?.color || "#1f2937";
}

function getWeaponLabel(weaponName) {
  return t(`weapons.${weaponName}`);
}

function getArmorPartLabel(part) {
  return t(`armorParts.${part}`);
}

function getArmorItemLabel(part) {
  return t(`armorItems.${part}`);
}

function resolveDisplayParams(params = {}) {
  const resolved = { ...params };
  if (params.weapon) {
    resolved.weapon = getWeaponLabel(params.weapon);
  }
  if (params.part) {
    resolved.part = getArmorPartLabel(params.part);
  }
  return resolved;
}

function getItemDisplayName(item) {
  if (item.displayKey) {
    return t(item.displayKey, resolveDisplayParams(item.displayParams));
  }
  return item.displayName || "";
}

function resolveLogVars(vars = {}) {
  const resolved = { ...vars };
  if (vars.playerId) resolved.player = getPlayerLabelById(vars.playerId);
  if (vars.attackerId) resolved.attacker = getPlayerLabelById(vars.attackerId);
  if (vars.targetId) resolved.target = getPlayerLabelById(vars.targetId);
  if (vars.weapon) resolved.weapon = getWeaponLabel(vars.weapon);
  if (vars.part) resolved.part = getArmorPartLabel(vars.part);
  if (vars.armorItem) resolved.part = getArmorItemLabel(vars.armorItem);
  if (vars.map) resolved.map = t(`maps.${vars.map}`);
  if (vars.location && typeof vars.location === "object") {
    const locationVars = {
      bodyRoll: vars.location.bodyRoll,
      partRoll: vars.location.partRoll,
      part: getArmorPartLabel(vars.location.part),
    };
    resolved.location = vars.location.partRoll
      ? t("log.locationRollWithPart", locationVars)
      : t("log.locationRoll", locationVars);
  }
  return resolved;
}

function resolveLogVarsForAction(vars = {}) {
  const resolved = resolveLogVars(vars);
  if (vars.playerId) resolved.player = getStyledPlayerLabelById(vars.playerId);
  if (vars.attackerId) resolved.attacker = getStyledPlayerLabelById(vars.attackerId);
  if (vars.targetId) resolved.target = getStyledPlayerLabelById(vars.targetId);
  return resolved;
}

function getHitChance(distance, penalty) {
  const threshold = distance + penalty;
  const hits = Math.max(0, 7 - threshold);
  return Math.round((hits / 6) * 100);
}

function snapshotAvatarState(player) {
  return {
    headArmor: player.headArmor,
    bodyArmor: player.bodyArmor,
    leftArmArmor: player.leftArmArmor,
    rightArmArmor: player.rightArmArmor,
    leftLegArmor: player.leftLegArmor,
    rightLegArmor: player.rightLegArmor,
    health: player.health,
  };
}

function createEmptyMap(name) {
  return {
    name,
    grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(".")),
  };
}

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

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function parseSeedValue(seed) {
  if (typeof seed === "number") {
    return seed >>> 0;
  }
  const normalized = String(seed).trim();
  if (!normalized) {
    return Number(GENERATED_DEFAULT_SEED);
  }
  if (/^\d+$/.test(normalized)) {
    return Number(normalized) >>> 0;
  }
  return hashSeed(normalized);
}

function getGeneratedSeedInput() {
  const raw = elements.mapSeed?.value?.trim();
  return raw || state.mapSeed || GENERATED_DEFAULT_SEED;
}

function getSelectedWallThickness() {
  const raw = Number(elements.wallThickness?.value ?? state.wallThickness ?? GENERATED_DEFAULT_WALL_THICKNESS);
  return clampNumber(raw || GENERATED_DEFAULT_WALL_THICKNESS, 1, 8);
}

function applyBorderWalls(grid, thickness) {
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (
        x < thickness ||
        y < thickness ||
        x >= GRID_SIZE - thickness ||
        y >= GRID_SIZE - thickness
      ) {
        grid[y][x] = "W";
      }
    }
  }
}

function isPassable(cellType) {
  return cellType !== "W" && cellType !== "R";
}

function isLineOfSightClear(a, b, grid) {
  if (a.x === b.x) {
    const start = Math.min(a.y, b.y) + 1;
    const end = Math.max(a.y, b.y);
    for (let y = start; y < end; y += 1) {
      if (!isPassable(grid[y][a.x])) return false;
    }
    return true;
  }
  if (a.y === b.y) {
    const start = Math.min(a.x, b.x) + 1;
    const end = Math.max(a.x, b.x);
    for (let x = start; x < end; x += 1) {
      if (!isPassable(grid[a.y][x])) return false;
    }
    return true;
  }
  return false;
}

function generateGeneratedMap(seedValue, wallThicknessValue) {
  const seed = parseSeedValue(seedValue);
  const rng = mulberry32(seed);
  const rand = () => rng();
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  const thickness = clampNumber(wallThicknessValue, 1, 8);
  const grid = createEmptyMap(GENERATED_MAP_NAME).grid;
  const minBound = thickness;
  const maxBound = GRID_SIZE - thickness - 1;
  const interiorSize = maxBound - minBound + 1;

  const boundedSize = (min, max, padding = 1) => {
    const limit = Math.max(2, Math.min(max, interiorSize - padding));
    const floor = Math.min(min, limit);
    return randInt(floor, limit);
  };

  const boundedStart = (maxStart) => {
    const startMax = Math.max(minBound, maxStart);
    return randInt(minBound, startMax);
  };

  const inInterior = (x, y) => x >= minBound && x <= maxBound && y >= minBound && y <= maxBound;
  const setCell = (x, y, value) => {
    if (!inInterior(x, y)) return;
    if (value === "R" && grid[y][x] === "W") return;
    grid[y][x] = value;
  };

  applyBorderWalls(grid, thickness);

  const addWallSegment = (x, y, dx, dy, length, segmentThickness) => {
    for (let step = 0; step < length; step += 1) {
      for (let offset = 0; offset < segmentThickness; offset += 1) {
        const drawX = x + dx * step + (dy !== 0 ? offset : 0);
        const drawY = y + dy * step + (dx !== 0 ? offset : 0);
        setCell(drawX, drawY, "W");
      }
    }
    const gapStart = 2;
    const gapEnd = length - 3;
    if (gapEnd >= gapStart) {
      const gapCount = randInt(1, 2);
      for (let gap = 0; gap < gapCount; gap += 1) {
        const gapIndex = randInt(gapStart, gapEnd);
        for (let offset = 0; offset < segmentThickness; offset += 1) {
          const gapX = x + dx * gapIndex + (dy !== 0 ? offset : 0);
          const gapY = y + dy * gapIndex + (dx !== 0 ? offset : 0);
          if (inInterior(gapX, gapY)) {
            grid[gapY][gapX] = ".";
          }
        }
      }
    }
  };

  const addWallBlock = (x, y, width, height) => {
    for (let dy = 0; dy < height; dy += 1) {
      for (let dx = 0; dx < width; dx += 1) {
        setCell(x + dx, y + dy, "W");
      }
    }
  };

  const segments = randInt(4, 6);
  for (let index = 0; index < segments; index += 1) {
    const horizontal = rand() > 0.5;
    const length = boundedSize(4, 13);
    const segmentThickness = rand() > 0.7 ? 2 : 1;
    const startX = boundedStart(maxBound - (horizontal ? length : 0));
    const startY = boundedStart(maxBound - (horizontal ? 0 : length));
    addWallSegment(startX, startY, horizontal ? 1 : 0, horizontal ? 0 : 1, length, segmentThickness);
  }

  const blocks = randInt(3, 5);
  for (let index = 0; index < blocks; index += 1) {
    const width = boundedSize(2, 5, 2);
    const height = boundedSize(2, 5, 2);
    const startX = boundedStart(maxBound - width);
    const startY = boundedStart(maxBound - height);
    addWallBlock(startX, startY, width, height);
  }

  const clearings = randInt(2, 3);
  for (let index = 0; index < clearings; index += 1) {
    const width = boundedSize(3, 6, 2);
    const height = boundedSize(3, 6, 2);
    const startX = boundedStart(maxBound - width);
    const startY = boundedStart(maxBound - height);
    for (let dy = 0; dy < height; dy += 1) {
      for (let dx = 0; dx < width; dx += 1) {
        if (inInterior(startX + dx, startY + dy)) {
          grid[startY + dy][startX + dx] = ".";
        }
      }
    }
  }

  const rivers = randInt(1, 2);
  for (let riverIndex = 0; riverIndex < rivers; riverIndex += 1) {
    let x = boundedStart(maxBound - 1);
    let y = boundedStart(maxBound - 1);
    const length = boundedSize(5, 12, 1);
    let dx = rand() > 0.5 ? 1 : 0;
    let dy = dx === 1 ? 0 : 1;

    for (let step = 0; step < length; step += 1) {
      setCell(x, y, "R");
      if (rand() > 0.7) {
        setCell(x + (dy !== 0 ? 1 : 0), y + (dx !== 0 ? 1 : 0), "R");
      }
      if (rand() > 0.75) {
        const turn = rand() > 0.5 ? 1 : -1;
        const nextDx = dy * turn;
        const nextDy = dx * -turn;
        dx = nextDx;
        dy = nextDy;
      }
      const nextX = x + dx;
      const nextY = y + dy;
      if (!inInterior(nextX, nextY) || grid[nextY][nextX] === "W") {
        dx = dy !== 0 ? (rand() > 0.5 ? 1 : -1) : 0;
        dy = dx !== 0 ? 0 : (rand() > 0.5 ? 1 : -1);
      }
      x = clampNumber(x + dx, minBound, maxBound);
      y = clampNumber(y + dy, minBound, maxBound);
    }
  }

  const getPassableCells = () => {
    const cells = [];
    for (let y = minBound; y <= maxBound; y += 1) {
      for (let x = minBound; x <= maxBound; x += 1) {
        if (isPassable(grid[y][x])) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  };

  const floodFill = (start) => {
    const visited = Array(GRID_SIZE * GRID_SIZE).fill(false);
    const queue = [start];
    visited[start.y * GRID_SIZE + start.x] = true;
    while (queue.length) {
      const current = queue.shift();
      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];
      neighbors.forEach((neighbor) => {
        if (!inInterior(neighbor.x, neighbor.y)) return;
        if (!isPassable(grid[neighbor.y][neighbor.x])) return;
        const index = neighbor.y * GRID_SIZE + neighbor.x;
        if (visited[index]) return;
        visited[index] = true;
        queue.push(neighbor);
      });
    }
    return visited;
  };

  const connectIslands = () => {
    let passableCells = getPassableCells();
    if (!passableCells.length) {
      return;
    }
    let reachable = floodFill(passableCells[0]);
    let unreachable = passableCells.filter((cell) => !reachable[cell.y * GRID_SIZE + cell.x]);
    let attempts = 0;

    while (unreachable.length && attempts < 20) {
      const origin = unreachable[randInt(0, unreachable.length - 1)];
      const destination = passableCells[randInt(0, passableCells.length - 1)];
      const horizontalFirst = rand() > 0.5;
      if (horizontalFirst) {
        const stepX = origin.x < destination.x ? 1 : -1;
        for (let x = origin.x; x !== destination.x + stepX; x += stepX) {
          if (inInterior(x, origin.y)) {
            grid[origin.y][x] = ".";
          }
        }
        const stepY = origin.y < destination.y ? 1 : -1;
        for (let y = origin.y; y !== destination.y + stepY; y += stepY) {
          if (inInterior(destination.x, y)) {
            grid[y][destination.x] = ".";
          }
        }
      } else {
        const stepY = origin.y < destination.y ? 1 : -1;
        for (let y = origin.y; y !== destination.y + stepY; y += stepY) {
          if (inInterior(origin.x, y)) {
            grid[y][origin.x] = ".";
          }
        }
        const stepX = origin.x < destination.x ? 1 : -1;
        for (let x = origin.x; x !== destination.x + stepX; x += stepX) {
          if (inInterior(x, destination.y)) {
            grid[destination.y][x] = ".";
          }
        }
      }
      passableCells = getPassableCells();
      reachable = floodFill(passableCells[0]);
      unreachable = passableCells.filter((cell) => !reachable[cell.y * GRID_SIZE + cell.x]);
      attempts += 1;
    }
  };

  connectIslands();

  const shuffle = (array) => {
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swapIndex = randInt(0, index);
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }
  };

  const placeSpawns = () => {
    const quadrants = [
      (x, y) => x <= (GRID_SIZE - 1) / 2 && y <= (GRID_SIZE - 1) / 2,
      (x, y) => x > (GRID_SIZE - 1) / 2 && y <= (GRID_SIZE - 1) / 2,
      (x, y) => x <= (GRID_SIZE - 1) / 2 && y > (GRID_SIZE - 1) / 2,
      (x, y) => x > (GRID_SIZE - 1) / 2 && y > (GRID_SIZE - 1) / 2,
    ];
    const spawns = [];
    const minDistance = 6;

    const tryPlaceSpawn = (filter) => {
      const candidates = [];
      for (let y = minBound; y <= maxBound; y += 1) {
        for (let x = minBound; x <= maxBound; x += 1) {
          if (!filter(x, y)) continue;
          if (!isPassable(grid[y][x])) continue;
          candidates.push({ x, y });
        }
      }
      shuffle(candidates);
      return candidates.find((candidate) => {
        if (spawns.some((spawn) => Math.abs(spawn.x - candidate.x) + Math.abs(spawn.y - candidate.y) < minDistance)) {
          return false;
        }
        if (spawns.some((spawn) => isLineOfSightClear(spawn, candidate, grid))) {
          return false;
        }
        return true;
      });
    };

    for (let index = 0; index < 4; index += 1) {
      const spawn = tryPlaceSpawn(quadrants[index]) || tryPlaceSpawn(() => true);
      if (spawn) {
        grid[spawn.y][spawn.x] = "S";
        spawns.push(spawn);
      }
    }
  };

  placeSpawns();

  return { name: GENERATED_MAP_NAME, grid };
}

function init() {
  Object.keys(mapLibrary).forEach((mapName) => {
    const option = document.createElement("option");
    option.value = mapName;
    option.textContent = t(`maps.${mapName}`);
    elements.mapSelect.appendChild(option);
  });

  elements.mapSelect.addEventListener("change", () => {
    updateGeneratedSettingsVisibility();
    renderMapPreview();
  });
  if (elements.mapSeed) {
    elements.mapSeed.addEventListener("input", () => {
      state.mapSeed = getGeneratedSeedInput();
      renderMapPreview();
    });
  }
  if (elements.mapSeedRandom) {
    elements.mapSeedRandom.addEventListener("click", () => {
      const newSeed = Math.floor(Math.random() * 1_000_000_000);
      state.mapSeed = String(newSeed);
      if (elements.mapSeed) {
        elements.mapSeed.value = state.mapSeed;
      }
      renderMapPreview();
    });
  }
  if (elements.wallThickness) {
    elements.wallThickness.addEventListener("input", () => {
      state.wallThickness = getSelectedWallThickness();
      if (elements.wallThicknessValue) {
        elements.wallThicknessValue.textContent = String(state.wallThickness);
      }
      renderMapPreview();
    });
  }
  elements.playerCount.addEventListener("change", renderPlayerTypeList);
  elements.startGame.addEventListener("click", () => startNewGame());
  elements.newGame.addEventListener("click", showStartScreen);
  elements.resetGame.addEventListener("click", () => startNewGame(true));
  elements.saveGame.addEventListener("click", saveGame);
  elements.loadGame.addEventListener("click", loadGame);
  elements.endTurn.addEventListener("click", endTurn);
  elements.useMedkit.addEventListener("click", useMedkit);

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  document.querySelectorAll("[data-rules-button]").forEach((button) => {
    button.addEventListener("click", showRulesModal);
  });
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", hideRulesModal);
  });
  document.querySelectorAll("[data-close-victory]").forEach((button) => {
    button.addEventListener("click", () => hideVictoryModal());
  });
  if (elements.victoryNewGame) {
    elements.victoryNewGame.addEventListener("click", () => {
      hideVictoryModal(true);
      showStartScreen();
    });
  }
  if (elements.victoryContinue) {
    elements.victoryContinue.addEventListener("click", () => hideVictoryModal());
  }

  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => handleMove(button.dataset.move));
  });

  document.addEventListener("keydown", handleHotkeys);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideRulesModal();
      if (state.victory) {
        hideVictoryModal();
      }
    }
  });

  buildGrid();
  buildMapPreviewGrid();
  updateGeneratedSettingsVisibility();
  renderMapPreview();
  setLanguage(state.language);
  showStartScreen();
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

function showRulesModal() {
  if (!elements.rulesModal) return;
  elements.rulesModal.classList.add("is-visible");
  elements.rulesModal.setAttribute("aria-hidden", "false");
}

function hideRulesModal() {
  if (!elements.rulesModal) return;
  elements.rulesModal.classList.remove("is-visible");
  elements.rulesModal.setAttribute("aria-hidden", "true");
}

function updateVictoryMessage() {
  if (!state.victory || !elements.victoryMessage) return;
  const winner = state.players.find((player) => player.id === state.victory.winnerId);
  if (!winner) return;
  elements.victoryMessage.textContent = t("victory.message", {
    player: getPlayerLabel(winner),
  });
}

function showVictoryModal(winner) {
  if (!elements.victoryModal) return;
  state.victory = { winnerId: winner.id };
  updateVictoryMessage();
  elements.victoryModal.classList.add("is-visible");
  elements.victoryModal.setAttribute("aria-hidden", "false");
}

function hideVictoryModal(keepState = false) {
  if (!elements.victoryModal) return;
  elements.victoryModal.classList.remove("is-visible");
  elements.victoryModal.setAttribute("aria-hidden", "true");
  if (!keepState) {
    state.victory = null;
    scheduleAiTurn();
  }
}

function startNewGame(keepMapSelection = false) {
  state.items = [];
  state.nextItemId = 1;
  state.log = [];
  state.attackMode = null;
  state.round = 1;
  state.currentPlayerIndex = 0;
  state.lastActionMessage = null;
  state.aiTurnId += 1;
  state.victory = null;
  state.victoryAchieved = false;

  if (!keepMapSelection) {
    elements.mapSelect.value = elements.mapSelect.value || "Maze";
  }
  const mapName = elements.mapSelect.value || "Maze";
  state.mapName = mapName;
  if (mapName === GENERATED_MAP_NAME) {
    state.mapSeed = getGeneratedSeedInput();
    state.wallThickness = getSelectedWallThickness();
    state.map = cloneMap(generateGeneratedMap(state.mapSeed, state.wallThickness));
  } else {
    state.map = cloneMap(mapLibrary[mapName]);
  }

  const count = Number(elements.playerCount.value);
  const playerTypes = getPlayerTypeSelections(count);
  state.players = createPlayers(count, playerTypes);

  state.seed = mapName === GENERATED_MAP_NAME ? parseSeedValue(state.mapSeed) : Date.now();
  state.rng = mulberry32(state.seed);
  state.crateInterval = Math.max(1, Number(elements.crateInterval.value) || 3);
  state.fragLimit = Math.max(1, Number(elements.fragLimit.value) || 10);

  assignSpawnPoints();
  startTurn();
  logEvent("log.newGame", { map: mapName, seed: state.seed });
  render();
  hideStartScreen();
}

function showStartScreen() {
  document.body.classList.add("start-mode");
  if (state.mapName) {
    elements.mapSelect.value = state.mapName;
  }
  if (elements.mapSeed) {
    elements.mapSeed.value = state.mapSeed || GENERATED_DEFAULT_SEED;
  }
  if (elements.wallThickness) {
    elements.wallThickness.value = String(state.wallThickness || GENERATED_DEFAULT_WALL_THICKNESS);
  }
  if (elements.wallThicknessValue) {
    elements.wallThicknessValue.textContent = String(state.wallThickness || GENERATED_DEFAULT_WALL_THICKNESS);
  }
  if (elements.fragLimit) {
    elements.fragLimit.value = String(state.fragLimit || 10);
  }
  updateGeneratedSettingsVisibility();
  renderMapPreview();
  renderPlayerTypeList();
}

function hideStartScreen() {
  document.body.classList.remove("start-mode");
}

function buildMapPreviewGrid() {
  if (!elements.mapPreview) return;
  elements.mapPreview.innerHTML = "";
  for (let y = 1; y <= GRID_SIZE; y += 1) {
    for (let x = 1; x <= GRID_SIZE; x += 1) {
      const cell = document.createElement("div");
      cell.className = "preview-cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      elements.mapPreview.appendChild(cell);
    }
  }
}

function renderMapPreview() {
  if (!elements.mapPreview) return;
  const mapName = elements.mapSelect.value || "Maze";
  const previewCells = elements.mapPreview.querySelectorAll(".preview-cell");
  previewCells.forEach((cell) => {
    cell.className = "preview-cell";
  });
  const map =
    mapName === GENERATED_MAP_NAME
      ? generateGeneratedMap(getGeneratedSeedInput(), getSelectedWallThickness())
      : mapLibrary[mapName];
  if (!map) return;
  map.grid.forEach((row, y) => {
    row.forEach((cellType, x) => {
      const index = y * GRID_SIZE + x;
      const cell = previewCells[index];
      if (!cell) return;
      if (cellType === "W") cell.classList.add("wall");
      if (cellType === "R") cell.classList.add("river");
      if (cellType === "S") cell.classList.add("spawn");
    });
  });
}

function renderPlayerTypeList() {
  const count = Number(elements.playerCount.value);
  elements.playerTypeList.innerHTML = "";
  state.playerTypeSelections = state.playerTypeSelections.slice(0, count);
  for (let index = 0; index < count; index += 1) {
    const preset = PLAYER_PRESETS[index];
    const selection = state.playerTypeSelections[index] || "human";
    const row = document.createElement("div");
    row.className = "player-type-row";
    row.innerHTML = `
      <div class="player-chip">
        <span class="dot" style="--player-color: ${preset.color}"></span>
        ${getPlayerLabel(preset)} #${index + 1}
      </div>
      <select>
        <option value="human">${t("ui.playerLabel")}</option>
        <option value="ai">${t("ui.aiLabel")}</option>
      </select>
    `;
    const select = row.querySelector("select");
    select.value = selection;
    select.addEventListener("change", () => {
      state.playerTypeSelections[index] = select.value;
    });
    elements.playerTypeList.appendChild(row);
  }
}

function getPlayerTypeSelections(count) {
  const selections = [];
  const selects = elements.playerTypeList.querySelectorAll("select");
  for (let index = 0; index < count; index += 1) {
    const value = selects[index]?.value || state.playerTypeSelections[index] || "human";
    selections.push(value);
  }
  state.playerTypeSelections = selections;
  return selections;
}

function cloneMap(map) {
  return {
    name: map.name,
    grid: map.grid.map((row) => [...row]),
  };
}

function createPlayers(count, playerTypes = []) {
  return Array.from({ length: count }, (_, index) => {
    const preset = PLAYER_PRESETS[index];
    return {
      id: index + 1,
      nameKey: preset.nameKey,
      color: preset.color,
      isAI: playerTypes[index] === "ai",
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
        logEvent("log.respawnSkip", { playerId: player.id });
      } else {
        logEvent("log.respawnFail", { playerId: player.id });
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
    logEvent("log.turnStart", { round: state.round, playerId: player.id });
    scheduleAiTurn();
    return;
  }
  logEvent("log.noActivePlayers");
}

function scheduleAiTurn() {
  const player = getCurrentPlayer();
  if (!player?.isAI) return;
  state.aiTurnId += 1;
  runAiTurn(state.aiTurnId);
}

function isAiTurn(turnId) {
  return state.aiTurnId === turnId && getCurrentPlayer()?.isAI;
}

function waitAiDelay(turnId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(isAiTurn(turnId));
    }, AI_ACTION_DELAY);
  });
}

function getClosestTarget(attacker, targets) {
  if (!targets.length) return null;
  return targets.reduce((closest, target) => {
    const closestDistance = Math.abs(closest.x - attacker.x) + Math.abs(closest.y - attacker.y);
    const targetDistance = Math.abs(target.x - attacker.x) + Math.abs(target.y - attacker.y);
    return targetDistance < closestDistance ? target : closest;
  }, targets[0]);
}

function getTargetDurability(target) {
  const clampArmor = (value) => Math.max(0, value);
  const vitalArmor = clampArmor(target.headArmor) + clampArmor(target.bodyArmor);
  const limbArmor = clampArmor(target.leftArmArmor)
    + clampArmor(target.rightArmArmor)
    + clampArmor(target.leftLegArmor)
    + clampArmor(target.rightLegArmor);
  return target.health + vitalArmor * 1.5 + limbArmor * 0.5;
}

function getWeaponShots(weaponName) {
  return ["Shotgun", "Sword"].includes(weaponName) ? 2 : 1;
}

function getWeaponDamageFactor(weaponName) {
  if (weaponName === "Bazooka") return 2.5;
  if (weaponName === "Shotgun") return 1.1;
  return 1;
}

function getWeaponRank(weaponName) {
  const weaponRank = {
    Knife: 0,
    Pistol: 1,
    Sword: 2,
    Shotgun: 3,
    Bazooka: 4,
    None: -1,
  };
  return weaponRank[weaponName] ?? 0;
}

function hasUsableAmmo(weapon) {
  if (!WEAPON_CAPACITY[weapon.weaponName]) return true;
  return weapon.activeAmmo + weapon.passiveAmmo > 0;
}

function getWeaponEffectiveRank(weapon) {
  const baseRank = getWeaponRank(weapon.weaponName);
  if (!hasUsableAmmo(weapon)) {
    return baseRank - 2;
  }
  return baseRank;
}

function getAmmoRatio(weapon) {
  const capacity = WEAPON_CAPACITY[weapon.weaponName];
  if (!capacity) return 1;
  return Math.min(1, weapon.activeAmmo / capacity);
}

function scoreAiAttack(attacker, weapon, target) {
  const distance = Math.abs(target.x - attacker.x) + Math.abs(target.y - attacker.y);
  const range = getWeaponRange(weapon.weaponName);
  if (distance > range) return -Infinity;
  if (range === 1 && distance !== 1) return -Infinity;
  if (range > 1 && !hasLineOfSight(attacker.x, attacker.y, target.x, target.y)) return -Infinity;

  const distancePenalty = attacker.leftArmArmor < 0 || attacker.rightArmArmor < 0 ? 2 : 0;
  const hitChance = Math.max(0, 7 - (distance + distancePenalty)) / 6;
  const shots = getWeaponShots(weapon.weaponName);
  const expectedDamage = shots * hitChance * getWeaponDamageFactor(weapon.weaponName);
  const durability = getTargetDurability(target);
  const vulnerability = 1 / (1 + durability);
  const distanceWeight = range > 1 ? (range + 1 - distance) / range : 1;
  return expectedDamage * vulnerability * distanceWeight * getAmmoRatio(weapon);
}

function getAiAttackOption(player, position = null) {
  if (state.weaponPoints <= 0) return null;
  let bestOption = null;
  let bestScore = -Infinity;
  const attacker = position ? { ...player, x: position.x, y: position.y } : player;
  for (let slot = 0; slot < player.weapons.length; slot += 1) {
    const weapon = player.weapons[slot];
    if (weapon.weaponName === "None") continue;
    if (WEAPON_CAPACITY[weapon.weaponName] && weapon.activeAmmo <= 0) continue;
    const targets = getPotentialTargets(attacker, weapon.weaponName);
    if (!targets.length) continue;
    targets.forEach((target) => {
      const score = scoreAiAttack(attacker, weapon, target);
      if (score > bestScore) {
        bestScore = score;
        bestOption = { slot, target, score };
      }
    });
  }
  return bestOption;
}

function getAiItemValue(item, player) {
  if (item.type === "Crate") return 6;
  if (item.category === "Armor") {
    const partMap = {
      Head: "headArmor",
      Body: "bodyArmor",
      "Left Arm": "leftArmArmor",
      "Right Arm": "rightArmArmor",
      "Left Leg": "leftLegArmor",
      "Right Leg": "rightLegArmor",
    };
    const targetKey = partMap[item.additional];
    const currentValue = targetKey ? player[targetKey] : 0;
    if (["Left Arm", "Right Arm", "Left Leg", "Right Leg"].includes(item.additional)
      && currentValue < 0) {
      return 0;
    }
    return item.quantity > currentValue ? 3 + (item.quantity - currentValue) : 0;
  }
  if (item.category === "Medkit") {
    const hasMedkit = player.inventory.some((entry) => entry.category === "Medkit");
    const limbCritical = ["leftArmArmor", "rightArmArmor", "leftLegArmor", "rightLegArmor"]
      .some((key) => player[key] < 0);
    if (hasMedkit) return 0;
    return player.health < 3 || limbCritical ? 4 : 2;
  }
  if (item.category === "Exoskeleton") {
    const hasExoskeleton = player.inventory.some((entry) => entry.category === "Exoskeleton");
    return hasExoskeleton ? 0 : 3;
  }
  if (item.category === "Weapon") {
    const newRank = getWeaponRank(item.additional);
    const hasAmmo = !WEAPON_CAPACITY[item.additional] || item.quantity > 0;
    const newEffectiveRank = hasAmmo ? newRank : newRank - 2;
    const currentRanks = player.weapons.map((weapon) => getWeaponEffectiveRank(weapon));
    const hasEmptySlot = player.weapons.some((weapon) => weapon.weaponName === "None");
    const bestCurrent = Math.max(...currentRanks);
    const worstCurrent = Math.min(...currentRanks);
    if (hasEmptySlot) return 3 + newEffectiveRank;
    if (newEffectiveRank <= worstCurrent) return 0;
    const baseValue = newEffectiveRank > bestCurrent ? 3 : 2;
    return baseValue + (newEffectiveRank - worstCurrent);
  }
  if (item.category === "Ammo") {
    const weapon = player.weapons.find((entry) => entry.weaponName === item.additional);
    if (!weapon) return 0;
    const limit = PASSIVE_LIMIT[item.additional] || 0;
    return weapon.passiveAmmo < limit ? 1 : 0;
  }
  return 0;
}

function getAiBestItemTarget(player) {
  const playerKey = `${player.x},${player.y}`;
  const allowedPositions = new Set([playerKey]);
  const candidates = state.items
    .map((item) => {
      const value = getAiItemValue(item, player);
      if (value <= 0) return null;
      const distanceMap = buildDistanceMap(item.x, item.y, allowedPositions);
      const distance = distanceMap.get(playerKey);
      if (distance === undefined) return null;
      return { item, value, distance };
    })
    .filter(Boolean);
  if (!candidates.length) return null;
  return candidates.reduce((best, entry) => {
    const bestScore = best.value * 3 - best.distance;
    const entryScore = entry.value * 3 - entry.distance;
    return entryScore > bestScore ? entry : best;
  }, candidates[0]);
}

function getAiWeaponSlot(player, weaponName) {
  const emptySlot = player.weapons.findIndex((weapon) => weapon.weaponName === "None");
  if (emptySlot !== -1) return emptySlot;
  const newRank = getWeaponRank(weaponName);
  const slotWithWorst = player.weapons.reduce(
    (best, weapon, index) => {
      const rank = getWeaponEffectiveRank(weapon);
      if (rank < best.rank) return { index, rank };
      return best;
    },
    { index: 0, rank: getWeaponEffectiveRank(player.weapons[0]) }
  );
  return newRank > slotWithWorst.rank ? slotWithWorst.index : null;
}

function tryAiGroundItemAction(player) {
  const itemsHere = state.items
    .filter((item) => item.x === player.x && item.y === player.y && item.type === "GroundItem")
    .map((item) => ({ item, value: getAiItemValue(item, player) }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
  if (!itemsHere.length) return false;
  const { item } = itemsHere[0];
  if (item.category === "Armor") {
    handleGroundItemAction(item.id, "equip", 0, true);
    return true;
  }
  if (item.category === "Weapon") {
    const slot = getAiWeaponSlot(player, item.additional);
    if (slot === null) return false;
    handleGroundItemAction(item.id, "equip", slot, true);
    return true;
  }
  if (item.category === "Ammo") {
    const slot = player.weapons.findIndex(
      (weapon) => weapon.weaponName === item.additional
    );
    if (slot === -1) return false;
    const limit = PASSIVE_LIMIT[item.additional] || 0;
    if (player.weapons[slot].passiveAmmo >= limit) return false;
    handleGroundItemAction(item.id, "equip", slot, true);
    return true;
  }
  if (item.category === "Medkit" || item.category === "Exoskeleton") {
    handleGroundItemAction(item.id, "take", 0, true);
    return true;
  }
  return false;
}

function isTraversableCell(x, y) {
  if (!isWithinBounds(x, y)) return false;
  const cellType = getCellType(x, y);
  if (cellType === "W" || cellType === "R") return false;
  return !getPlayerAt(x, y);
}

function buildDistanceMap(targetX, targetY, allowedPositions = new Set()) {
  const distances = new Map();
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  const allowed = new Set(allowedPositions);
  const startKey = `${targetX},${targetY}`;
  allowed.add(startKey);
  distances.set(startKey, 0);
  const queue = [{ x: targetX, y: targetY }];

  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    const currentKey = `${current.x},${current.y}`;
    const currentDistance = distances.get(currentKey) ?? 0;
    directions.forEach((direction) => {
      const nextX = current.x + direction.dx;
      const nextY = current.y + direction.dy;
      if (!isWithinBounds(nextX, nextY)) return;
      const cellType = getCellType(nextX, nextY);
      if (cellType === "W" || cellType === "R") return;
      const key = `${nextX},${nextY}`;
      if (distances.has(key)) return;
      if (getPlayerAt(nextX, nextY) && !allowed.has(key)) return;
      distances.set(key, currentDistance + 1);
      queue.push({ x: nextX, y: nextY });
    });
  }

  return distances;
}

function getAiMove(player) {
  const enemies = state.players.filter(
    (target) => target.status === "Alive" && target.id !== player.id
  );
  const target = getClosestTarget(player, enemies);
  const itemTarget = getAiBestItemTarget(player);
  const allowedPositions = new Set([`${player.x},${player.y}`]);
  const enemyDistances = target
    ? buildDistanceMap(target.x, target.y, allowedPositions)
    : null;
  const itemDistances = itemTarget
    ? buildDistanceMap(itemTarget.item.x, itemTarget.item.y, allowedPositions)
    : null;
  const itemDistanceFromPlayer = itemTarget
    ? itemDistances?.get(`${player.x},${player.y}`) ?? null
    : null;
  const prioritizeNearbyLoot = itemTarget
    && itemDistanceFromPlayer !== null
    && itemDistanceFromPlayer <= 4;
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  const maxSteps = Math.max(0, state.moves);
  if (maxSteps <= 0) return null;

  const getThreatScore = (x, y) => {
    if (!enemies.length) return 0;
    const threats = enemies.reduce((count, enemy) => {
      const canThreaten = enemy.weapons.some((weapon) => {
        if (weapon.weaponName === "None") return false;
        if (["Pistol", "Shotgun", "Bazooka"].includes(weapon.weaponName)
          && weapon.activeAmmo <= 0) {
          return false;
        }
        return canTargetCell(enemy, weapon.weaponName, x, y);
      });
      return count + (canThreaten ? 1 : 0);
    }, 0);
    return threats / enemies.length;
  };

  const getLootScore = (x, y) => {
    const itemsHere = state.items.filter((item) => item.x === x && item.y === y);
    if (!itemsHere.length) return 0;
    return itemsHere.reduce((score, item) => {
      if (item.type === "Crate") return score + 2;
      if (item.type === "GroundItem") {
        return score + getAiItemValue(item, player);
      }
      return score;
    }, 0);
  };

  const getCellScore = (x, y) => {
    const key = `${x},${y}`;
    const enemyDistance = enemyDistances?.get(key) ?? null;
    const itemDistance = itemDistances?.get(key) ?? null;
    const threatPenalty = getThreatScore(x, y);
    const lootScore = getLootScore(x, y);
    let score = 0;
    if (enemyDistance !== null) {
      score += (prioritizeNearbyLoot ? 2 : 6) - enemyDistance;
    }
    if (itemTarget && itemDistance !== null) {
      score += itemTarget.value * (prioritizeNearbyLoot ? 4 : 2) - itemDistance;
    }
    score += lootScore * 2;
    score -= threatPenalty * 5;
    return score;
  };

  const startKey = `${player.x},${player.y}`;
  const visited = new Map([[startKey, { steps: 0, firstMove: null }]]);
  const queue = [{ x: player.x, y: player.y, steps: 0, firstMove: null }];
  let bestScore = -Infinity;
  let bestMoves = [];

  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    if (current.steps > 0) {
      const score = getCellScore(current.x, current.y);
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [current.firstMove];
      } else if (score === bestScore && current.firstMove) {
        bestMoves.push(current.firstMove);
      }
    }
    if (current.steps >= maxSteps) continue;
    directions.forEach((direction) => {
      const nextX = current.x + direction.dx;
      const nextY = current.y + direction.dy;
      if (!isTraversableCell(nextX, nextY)) return;
      const key = `${nextX},${nextY}`;
      if (visited.has(key)) return;
      const firstMove = current.firstMove ?? direction;
      visited.set(key, { steps: current.steps + 1, firstMove });
      queue.push({
        x: nextX,
        y: nextY,
        steps: current.steps + 1,
        firstMove,
      });
    });
  }

  if (!bestMoves.length) return null;
  return bestMoves[roll(0, bestMoves.length - 1)];
}

function getAiMoveForAttack(player, currentScore) {
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  let bestMove = null;
  let bestScore = currentScore;
  directions.forEach((direction) => {
    const nextX = player.x + direction.dx;
    const nextY = player.y + direction.dy;
    if (!isTraversableCell(nextX, nextY)) return;
    const attackOption = getAiAttackOption(player, { x: nextX, y: nextY });
    if (!attackOption) return;
    if (attackOption.score > bestScore + 0.15) {
      bestScore = attackOption.score;
      bestMove = direction;
    }
  });
  return bestMove;
}

async function runAiTurn(turnId) {
  const started = await waitAiDelay(turnId);
  if (!started) return;
  if (isVictoryActive()) return;
  let acted = false;
  while (isAiTurn(turnId)) {
    if (isVictoryActive()) return;
    const player = getCurrentPlayer();
    const criticalLimb = ["leftArmArmor", "rightArmArmor", "leftLegArmor", "rightLegArmor"]
      .some((key) => player[key] < 0);
    if ((player.health <= 1 || criticalLimb)
      && player.inventory.some((item) => item.category === "Medkit")) {
      useMedkit(true);
      acted = true;
      if (!(await waitAiDelay(turnId))) return;
      continue;
    }
    if (tryAiGroundItemAction(player)) {
      acted = true;
      if (!(await waitAiDelay(turnId))) return;
      continue;
    }
    const attack = getAiAttackOption(player);
    if (attack && state.moves > 0) {
      const moveForAttack = getAiMoveForAttack(player, attack.score);
      if (moveForAttack) {
        attemptMove(moveForAttack.dx, moveForAttack.dy);
        acted = true;
        if (!(await waitAiDelay(turnId))) return;
        continue;
      }
    }
    if (attack) {
      executeAttack(attack.slot, attack.target.x, attack.target.y);
      acted = true;
      if (!(await waitAiDelay(turnId))) return;
      continue;
    }
    if (state.weaponPoints > 0) {
      const reloaded = reloadFirstAvailableWeapon(true);
      if (reloaded) {
        acted = true;
        if (!(await waitAiDelay(turnId))) return;
        continue;
      }
    }
    if (state.moves > 0) {
      const move = getAiMove(player);
      if (move) {
        attemptMove(move.dx, move.dy);
        acted = true;
        if (!(await waitAiDelay(turnId))) return;
        continue;
      }
    }
    break;
  }
  if (!isAiTurn(turnId)) return;
  if (acted) {
    if (!(await waitAiDelay(turnId))) return;
  }
  endTurn(true);
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
  if (isCurrentPlayerAI()) return;
  if (isVictoryActive()) return;
  if (state.attackMode) {
    logEvent("log.cancelTargetMove");
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
  if (isCurrentPlayerAI()) return;
  if (isVictoryActive()) return;
  if (elements.rulesModal?.classList.contains("is-visible")) return;
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
  if (key === "r") {
    event.preventDefault();
    reloadFirstAvailableWeapon();
    return;
  }
  if (key === "e" || key === "enter") {
    event.preventDefault();
    endTurn();
  }
}

function handleTargetHotkey(targetId) {
  if (isCurrentPlayerAI()) return;
  if (!state.attackMode) return;
  const attacker = getCurrentPlayer();
  const target = state.players.find(
    (player) => player.id === targetId && player.status === "Alive"
  );
  if (!target) {
    logEvent("log.targetUnavailable");
    return;
  }
  if (target.id === attacker.id) {
    logEvent("log.targetSelf");
    return;
  }
  const slot = state.attackMode.slot;
  state.attackMode = null;
  executeAttack(slot, target.x, target.y);
}

function attemptMove(dx, dy) {
  const player = getCurrentPlayer();
  if (state.moves <= 0) {
    logEvent("log.noMovePoints");
    return;
  }
  const nextX = player.x + dx;
  const nextY = player.y + dy;
  if (!isWithinBounds(nextX, nextY)) {
    logEvent("log.moveOutside");
    return;
  }
  const cellType = getCellType(nextX, nextY);
  if (cellType === "W" || cellType === "R") {
    logEvent("log.obstacleBlock");
    return;
  }
  if (getPlayerAt(nextX, nextY)) {
    logEvent("log.cellOccupied");
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
  const prizeRoll = roll(1, 8);
  logEvent("log.crateOpened");
  createCratePrize(prizeRoll, x, y);
  render();
}

function createCratePrize(rollValue, x, y) {
  switch (rollValue) {
    case 1:
      addGroundItem({
        displayKey: "items.medkit",
        category: "Medkit",
        quantity: 1,
      }, x, y);
      logEvent("log.crateMedkit");
      break;
    case 2:
      addGroundItem({
        displayKey: "items.ammo",
        displayParams: { weapon: "Shotgun", count: 4 },
        category: "Ammo",
        quantity: 4,
        additional: "Shotgun",
      }, x, y);
      addGroundItem({
        displayKey: "items.ammo",
        displayParams: { weapon: "Pistol", count: 6 },
        category: "Ammo",
        quantity: 6,
        additional: "Pistol",
      }, x, y);
      addGroundItem({
        displayKey: "items.ammo",
        displayParams: { weapon: "Bazooka", count: 2 },
        category: "Ammo",
        quantity: 2,
        additional: "Bazooka",
      }, x, y);
      logEvent("log.crateAmmoPack");
      break;
    case 3:
      addGroundItem({
        displayKey: "weapons.Shotgun",
        category: "Weapon",
        quantity: 2,
        additional: "Shotgun",
      }, x, y);
      addGroundItem({
        displayKey: "items.ammo",
        displayParams: { weapon: "Shotgun", count: 4 },
        category: "Ammo",
        quantity: 4,
        additional: "Shotgun",
      }, x, y);
      logEvent("log.crateShotgunKit");
      break;
    case 4:
      [
        { part: "Head" },
        { part: "Body" },
        { part: "Left Arm" },
        { part: "Right Arm" },
        { part: "Left Leg" },
        { part: "Right Leg" },
      ].forEach((armor) => {
        addGroundItem({
          displayKey: `armorItems.${armor.part}`,
          category: "Armor",
          quantity: 1,
          additional: armor.part,
        }, x, y);
      });
      logEvent("log.crateFullArmor");
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
        displayKey: "items.armorValue",
        displayParams: { part, value: 3 },
        category: "Armor",
        quantity: 3,
        additional: part,
      }, x, y);
      logEvent("log.crateArmorPlus", { part });
      break;
    }
    case 6:
      addGroundItem({
        displayKey: "weapons.Sword",
        category: "Weapon",
        quantity: 0,
        additional: "Sword",
      }, x, y);
      logEvent("log.crateSword");
      break;
    case 7:
      addGroundItem({
        displayKey: "items.exoskeleton",
        category: "Exoskeleton",
        quantity: 1,
      }, x, y);
      logEvent("log.crateExoskeleton");
      break;
    case 8:
      addGroundItem({
        displayKey: "weapons.Bazooka",
        category: "Weapon",
        quantity: 1,
        additional: "Bazooka",
      }, x, y);
      addGroundItem({
        displayKey: "items.ammo",
        displayParams: { weapon: "Bazooka", count: 1 },
        category: "Ammo",
        quantity: 1,
        additional: "Bazooka",
      }, x, y);
      logEvent("log.crateBazooka");
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
    displayKey: "items.supplyCrate",
  });
  logEvent("log.supplyCrateSpawned");
}

function enterAttackMode(slot) {
  if (isCurrentPlayerAI()) return;
  if (isVictoryActive()) return;
  const player = getCurrentPlayer();
  if (player.weapons[slot].weaponName === "None") {
    logEvent("log.noWeaponSlot");
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
  if (isCurrentPlayerAI()) return;
  if (isVictoryActive()) return;
  if (!state.attackMode) return;
  const slot = state.attackMode.slot;
  state.attackMode = null;
  executeAttack(slot, x, y);
}

function executeAttack(slot, targetX, targetY) {
  const attacker = getCurrentPlayer();
  const weapon = attacker.weapons[slot];

  if (state.weaponPoints <= 0) {
    logEvent("log.noWeaponPoints");
    return;
  }
  if (attacker.leftArmArmor < 0 && attacker.rightArmArmor < 0) {
    logEvent("log.noArms");
    return;
  }
  const distance = Math.abs(targetX - attacker.x) + Math.abs(targetY - attacker.y);
  const range = getWeaponRange(weapon.weaponName);
  if (distance > range) {
    logEvent("log.targetTooFar");
    return;
  }
  if (!canTargetCell(attacker, weapon.weaponName, targetX, targetY)) {
    logEvent("log.lineOfSightBlocked");
    return;
  }
  if (["Pistol", "Shotgun", "Bazooka"].includes(weapon.weaponName) && weapon.activeAmmo <= 0) {
    logEvent("log.outOfAmmo");
    return;
  }
  const target = getPlayerAt(targetX, targetY);
  if (!target) {
    logEvent("log.noTarget");
    return;
  }

  const shots = ["Shotgun", "Sword"].includes(weapon.weaponName) ? 2 : 1;
  const distancePenalty = attacker.leftArmArmor < 0 || attacker.rightArmArmor < 0 ? 2 : 0;
  const hitChance = getHitChance(distance, distancePenalty);
  for (let shot = 0; shot < shots; shot += 1) {
    const distanceCheck = roll(1, 6);
    if (distanceCheck - distancePenalty >= distance) {
      const targetBefore = snapshotAvatarState(target);
      const hitInfo = applyHit(attacker, target, weapon.weaponName);
      const targetAfter = snapshotAvatarState(target);
      logEvent("log.shotHit", {
        shot: shot + 1,
        chance: hitChance,
        location: {
          bodyRoll: hitInfo.bodyRoll,
          partRoll: hitInfo.partRoll,
          part: hitInfo.part,
        },
        attackerId: attacker.id,
        targetId: target.id,
        weapon: weapon.weaponName,
        part: hitInfo.part,
        targetBefore,
        targetAfter,
      });
      if (hitInfo.killed) {
        logEvent("log.killedReport", { targetId: target.id, part: hitInfo.killPart });
        break;
      }
    } else {
      logEvent("log.shotMiss", {
        shot: shot + 1,
        chance: hitChance,
        attackerId: attacker.id,
        targetId: target.id,
        weapon: weapon.weaponName,
      });
    }
  }

  state.weaponPoints = Math.max(0, state.weaponPoints - 1);
  if (["Pistol", "Shotgun", "Bazooka"].includes(weapon.weaponName)) {
    weapon.activeAmmo = Math.max(0, weapon.activeAmmo - 1);
  } else {
    state.moves = 0;
  }

  render();
}

function applyHit(attacker, target, weaponName) {
  const bodyCheck = roll(1, 6);
  let part = "Body";
  let partCheck = null;
  if (bodyCheck >= 4) {
    partCheck = roll(1, 6);
    const parts = ["Body", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Head"];
    part = parts[partCheck - 1];
  }

  const wasAlive = target.status === "Alive";
  const hitResult =
    weaponName === "Bazooka"
      ? applyBazookaDamage(target, part, attacker)
      : applyDamage(target, part, attacker);
  const killed = wasAlive && target.status === "Dead";
  return {
    part,
    bodyRoll: bodyCheck,
    partRoll: partCheck,
    killed,
    killPart: hitResult?.part || part,
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
        return { killed: true, part };
      }
      break;
    case "Head":
      target.headArmor -= 1;
      if (target.headArmor < 0) {
        handleDeath(attacker, target, part);
        return { killed: true, part };
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
  return { killed: false, part: null };
}

function applyBazookaDamage(target, part, attacker) {
  const primaryResult = applyDamageSteps(target, part, attacker, 3);
  if (primaryResult.killed) return primaryResult;
  const adjacentParts = getAdjacentParts(part);
  for (const adjacent of adjacentParts) {
    const result = applyDamageSteps(target, adjacent, attacker, 1);
    if (result.killed) return result;
  }
  return { killed: false, part: null };
}

function applyDamageSteps(target, part, attacker, count) {
  for (let i = 0; i < count; i += 1) {
    if (target.status === "Dead") return { killed: true, part: null };
    const result = applyDamage(target, part, attacker);
    if (result.killed) {
      return result;
    }
  }
  return { killed: false, part: null };
}

function getAdjacentParts(part) {
  const adjacencyMap = {
    Head: ["Body"],
    Body: ["Head", "Left Arm", "Right Arm", "Left Leg", "Right Leg"],
    "Left Arm": ["Body"],
    "Right Arm": ["Body"],
    "Left Leg": ["Body"],
    "Right Leg": ["Body"],
  };
  return adjacencyMap[part] || [];
}

function handleDeath(attacker, target, part) {
  target.status = "Dead";
  target.deaths += 1;
  if (attacker) {
    attacker.frags += 1;
    if (!state.victoryAchieved && attacker.frags >= state.fragLimit) {
      state.victoryAchieved = true;
      showVictoryModal(attacker);
    }
  }
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
        displayKey: `weapons.${weapon.weaponName}`,
        category: "Weapon",
        quantity: weapon.activeAmmo,
        additional: weapon.weaponName,
      }, x, y);
    }
    if (weapon.weaponName === "Pistol") {
      const ammoTotal = weapon.activeAmmo + weapon.passiveAmmo;
      if (ammoTotal > 0) {
        addGroundItem({
          displayKey: "items.ammo",
          displayParams: { weapon: "Pistol", count: ammoTotal },
          category: "Ammo",
          quantity: ammoTotal,
          additional: "Pistol",
        }, x, y);
      }
    } else if (weapon.passiveAmmo > 0) {
      addGroundItem({
        displayKey: "items.ammo",
        displayParams: { weapon: weapon.weaponName, count: weapon.passiveAmmo },
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
    { part: "Head", value: player.headArmor },
    { part: "Body", value: player.bodyArmor },
    { part: "Left Arm", value: player.leftArmArmor },
    { part: "Right Arm", value: player.rightArmArmor },
    { part: "Left Leg", value: player.leftLegArmor },
    { part: "Right Leg", value: player.rightLegArmor },
  ];
  armorDrops.forEach((armor) => {
    if (armor.value > 0) {
      addGroundItem({
        displayKey: "items.armorValue",
        displayParams: { part: armor.part, value: armor.value },
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

function reloadWeapon(slot, allowAi = false) {
  if (isCurrentPlayerAI() && !allowAi) return false;
  const player = getCurrentPlayer();
  const weapon = player.weapons[slot];
  if (!WEAPON_CAPACITY[weapon.weaponName]) {
    logEvent("log.reloadUnavailable");
    return false;
  }
  if (state.weaponPoints <= 0) {
    logEvent("log.noWeaponPoints");
    return false;
  }
  const maxAmmo = WEAPON_CAPACITY[weapon.weaponName];
  if (weapon.activeAmmo >= maxAmmo) {
    logEvent("log.weaponReloadedFull");
    return false;
  }
  if (weapon.passiveAmmo <= 0) {
    logEvent("log.weaponReloadedNoAmmo");
    return false;
  }
  const needed = maxAmmo - weapon.activeAmmo;
  const toLoad = Math.min(needed, weapon.passiveAmmo);
  weapon.activeAmmo += toLoad;
  weapon.passiveAmmo -= toLoad;
  state.weaponPoints = Math.max(0, state.weaponPoints - 1);
  logEvent("log.weaponReloaded", { weapon: weapon.weaponName, count: toLoad });
  render();
  return true;
}

function reloadFirstAvailableWeapon(allowAi = false) {
  if (isCurrentPlayerAI() && !allowAi) return false;
  const player = getCurrentPlayer();
  const slot = player.weapons.findIndex((weapon) => {
    const maxAmmo = WEAPON_CAPACITY[weapon.weaponName];
    if (!maxAmmo) return false;
    if (weapon.activeAmmo >= maxAmmo) return false;
    return weapon.passiveAmmo > 0;
  });
  if (slot === -1) {
    if (!allowAi) {
      logEvent("log.noWeaponToReload");
    }
    return false;
  }
  return reloadWeapon(slot, allowAi);
}

function dropWeapon(slot) {
  if (isCurrentPlayerAI()) return;
  const player = getCurrentPlayer();
  const dropped = dropWeaponFromSlot(player, slot, player.x, player.y);
  if (!dropped) {
    logEvent("log.nothingToDrop");
    return;
  }
  logEvent("log.dropWeapon", { weapon: dropped });
  render();
}

function dropWeaponFromSlot(player, slot, x, y) {
  const weapon = player.weapons[slot];
  if (weapon.weaponName === "None") {
    return null;
  }
  addGroundItem({
    displayKey: `weapons.${weapon.weaponName}`,
    category: "Weapon",
    quantity: weapon.activeAmmo,
    additional: weapon.weaponName,
  }, x, y);
  if (weapon.passiveAmmo > 0) {
    addGroundItem({
      displayKey: "items.ammo",
      displayParams: { weapon: weapon.weaponName, count: weapon.passiveAmmo },
      category: "Ammo",
      quantity: weapon.passiveAmmo,
      additional: weapon.weaponName,
    }, x, y);
  }
  const name = weapon.weaponName;
  player.weapons[slot] = { weaponName: "None", activeAmmo: 0, passiveAmmo: 0 };
  return name;
}

function useMedkit(allowAi = false) {
  if (isCurrentPlayerAI() && !allowAi) return;
  const player = getCurrentPlayer();
  const medkitIndex = player.inventory.findIndex((item) => item.category === "Medkit");
  if (medkitIndex === -1) {
    logEvent("log.medkitMissing");
    return;
  }
  player.health = 3;
  if (player.leftLegArmor < 0) player.leftLegArmor = 0;
  if (player.rightLegArmor < 0) player.rightLegArmor = 0;
  if (player.leftArmArmor < 0) player.leftArmArmor = 0;
  if (player.rightArmArmor < 0) player.rightArmArmor = 0;
  player.inventory.splice(medkitIndex, 1);
  logEvent("log.medkitUsed");
  render();
}

function endTurn(force = false) {
  if (isCurrentPlayerAI() && !force) return;
  if (isVictoryActive() && !force) return;
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

function handleGroundItemAction(itemId, action, slot, allowAi = false) {
  if (isCurrentPlayerAI() && !allowAi) return;
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
        logEvent("log.itemCannotEquip");
      }
      break;
    case "take":
      takeItem(item, itemIndex, player);
      break;
    case "destroy":
      state.items.splice(itemIndex, 1);
      logEvent("log.itemDestroyed");
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
      logEvent("log.dropWeaponSlot", { weapon: dropped, slot: slot + 1 });
    }
  }
  player.weapons[slot] = {
    weaponName: item.additional,
    activeAmmo: item.quantity,
    passiveAmmo: 0,
  };
  state.items.splice(itemIndex, 1);
  logEvent("log.weaponEquipped", { weapon: item.additional, slot: slot + 1 });
}

function equipAmmo(item, slot, itemIndex) {
  const player = getCurrentPlayer();
  const weapon = player.weapons[slot];
  if (weapon.weaponName !== item.additional) {
    logEvent("log.ammoMismatch");
    return;
  }
  const limit = PASSIVE_LIMIT[item.additional] || 0;
  const space = limit - weapon.passiveAmmo;
  if (space <= 0) {
    logEvent("log.noAmmoSpace");
    return;
  }
  const toAdd = Math.min(space, item.quantity);
  weapon.passiveAmmo += toAdd;
  const leftover = item.quantity - toAdd;
  state.items.splice(itemIndex, 1);
  if (leftover > 0) {
    addGroundItem({
      displayKey: "items.ammo",
      displayParams: { weapon: item.additional, count: leftover },
      category: "Ammo",
      quantity: leftover,
      additional: item.additional,
    }, player.x, player.y);
  }
  logEvent("log.ammoEquipped", { slot: slot + 1 });
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
    logEvent("log.armorDamaged");
    return;
  }
  const currentValue = player[targetKey];
  if (currentValue > 0) {
    addGroundItem({
      displayKey: "items.armorValue",
      displayParams: { part, value: currentValue },
      category: "Armor",
      quantity: currentValue,
      additional: part,
    }, player.x, player.y);
  }
  player[targetKey] = item.quantity;
  state.items.splice(itemIndex, 1);
  logEvent("log.armorEquipped", { armorItem: part });
}

function takeItem(item, itemIndex, player) {
  if (player.inventory.length >= INVENTORY_SIZE) {
    logEvent("log.inventoryFull");
    return;
  }
  const hadExoskeleton = player.inventory.some((entry) => entry.category === "Exoskeleton");
  player.inventory.push(stripItem(item));
  state.items.splice(itemIndex, 1);
  if (item.category === "Exoskeleton" && !hadExoskeleton) {
    state.moves += 2;
  }
  logEvent("log.itemAdded");
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
  logEvent("log.inventoryItemDropped");
  render();
}

function addGroundItem(item, x, y) {
  state.items.push({
    id: getNextItemId(),
    type: "GroundItem",
    x,
    y,
    displayName: item.displayName,
    displayKey: item.displayKey,
    displayParams: item.displayParams,
    category: item.category,
    quantity: item.quantity,
    additional: item.additional,
  });
}

function getCurrentPlayer() {
  return state.players[state.currentPlayerIndex];
}

function isCurrentPlayerAI() {
  return Boolean(getCurrentPlayer()?.isAI);
}

function isVictoryActive() {
  return Boolean(state.victory);
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
  renderBoardHeader();
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
      groundItemsByCell.get(key).push(getItemDisplayName(item));
    });
  const itemCells = new Set(
    state.items
      .filter((item) => item.type === "Crate" || item.type === "GroundItem")
      .map((item) => `${item.x},${item.y}`)
  );
  itemCells.forEach((key) => {
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
  const isAi = player.isAI;
  const moveDisplayMax = player.inventory.some((item) => item.category === "Exoskeleton") ? 5 : 3;
  const weaponInfo = player.weapons
    .map((weapon, index) => {
      const canReload = Boolean(WEAPON_CAPACITY[weapon.weaponName]);
      const disabled = weapon.weaponName === "None" || isAi ? "disabled" : "";
      const weaponLabel = getWeaponLabel(weapon.weaponName);
      return `
      <div class="weapon-card">
        <div class="weapon-title">${t("ui.slot", { slot: index + 1 })}</div>
        <div class="weapon-name">${weaponLabel}</div>
        <div class="weapon-ammo">${
    weapon.weaponName === "None"
      ? "—"
      : `${weapon.activeAmmo}/${weapon.passiveAmmo}`
  }</div>
        <div class="weapon-actions">
          <button data-weapon="${index}" ${disabled}>${t("ui.attack")}</button>
          ${canReload ? `<button data-reload="${index}" ${disabled}>${t("ui.reload")}</button>` : ""}
          <button data-drop-weapon="${index}" ${disabled}>${t("ui.drop")}</button>
        </div>
      </div>
    `;
    })
    .join("");

  elements.turnInfo.innerHTML = `
    <div class="turn-header">
      <div class="badge status-${player.status.toLowerCase()}">${t("status." + player.status)}</div>
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
          <span class="action-label">${t("ui.moves")}</span>
          <div class="point-boxes">${renderPointBoxes(state.moves, moveDisplayMax)}</div>
        </div>
        <div class="action-group">
          <span class="action-label">${t("ui.weaponPoints")}</span>
          <div class="point-boxes">${renderPointBoxes(state.weaponPoints, 1)}</div>
        </div>
        <div class="stat-pills">
          <div class="stat-pill">${t("ui.frags")} ${player.frags}</div>
          <div class="stat-pill">${t("ui.deaths")} ${player.deaths}</div>
        </div>
      </div>
    </div>
  `;

  if (elements.weaponPanel) {
    elements.weaponPanel.innerHTML = weaponInfo;
  }

  const weaponRoot = elements.weaponPanel || elements.turnInfo;
  weaponRoot.querySelectorAll("[data-weapon]").forEach((button) => {
    button.addEventListener("click", () => enterAttackMode(Number(button.dataset.weapon)));
  });
  weaponRoot.querySelectorAll("[data-reload]").forEach((button) => {
    button.addEventListener("click", () => reloadWeapon(Number(button.dataset.reload)));
  });
  weaponRoot.querySelectorAll("[data-drop-weapon]").forEach((button) => {
    button.addEventListener("click", () => dropWeapon(Number(button.dataset.dropWeapon)));
  });
}

function renderBoardHeader() {
  const player = getCurrentPlayer();
  if (!elements.boardHeader) return;
  elements.boardHeader.innerHTML = `
    <div class="badge">${t("ui.round", { round: state.round })}</div>
    <div class="badge player-badge" style="--player-color: ${player.color}">
      ${getPlayerLabel(player)}
    </div>
    ${player.isAI ? `<div class="badge ai-badge">${t("ui.aiLabel")}</div>` : ""}
  `;
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
        .map((weapon, index) => {
          const label = getWeaponLabel(weapon.weaponName);
          const hasAmmo = Boolean(WEAPON_CAPACITY[weapon.weaponName]);
          const ammoInfo = hasAmmo ? ` ${weapon.activeAmmo}/${weapon.passiveAmmo}` : "";
          return `
            <div class="player-weapon-row">
              <span class="player-weapon-slot">${t("ui.slot", { slot: index + 1 })}</span>
              <span class="player-weapon-name">${label}${ammoInfo}</span>
            </div>
          `;
        })
        .join("");
      const medkitCount = player.inventory.filter((item) => item.category === "Medkit").length;
      const exoskeletonCount = player.inventory.filter((item) => item.category === "Exoskeleton").length;
      const importantItems = [];
      if (medkitCount > 0) {
        importantItems.push(`${t("items.medkit")} x${medkitCount}`);
      }
      if (exoskeletonCount > 0) {
        importantItems.push(`${t("items.exoskeleton")} x${exoskeletonCount}`);
      }
      const importantItemsMarkup = importantItems.length
        ? importantItems.map((item) => `<div>${item}</div>`).join("")
        : `<div class="muted">—</div>`;
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
              <span>${getPlayerLabel(player)}</span>
              ${player.isAI ? `<span class="badge ai-badge">${t("ui.aiLabel")}</span>` : ""}
              <span class="muted">${t("status." + player.status)}</span>
            </div>
            <div class="hp-row">${renderHearts(player.health)}</div>
            <div class="player-summary-stats">
              <span>${t("ui.frags")} ${player.frags}</span>
              <span>${t("ui.deaths")} ${player.deaths}</span>
            </div>
          </div>
          <div class="player-summary-side">
            <div class="player-summary-weapons">
              ${weaponSummary}
            </div>
            <div class="player-summary-items">
              <div class="player-summary-items-title">${t("ui.importantItems")}</div>
              <div class="player-summary-items-list">${importantItemsMarkup}</div>
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
  const isAi = player.isAI;
  elements.useMedkit.disabled = isAi;
  elements.endTurn.disabled = isAi;
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
    elements.groundItems.innerHTML = `<div class="muted">${t("ui.noItemsHere")}</div>`;
    return;
  }
  items.slice(0, 8).forEach((item) => {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <span>${getItemDisplayName(item)}</span>
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
    buttons.push({ label: t("ui.equip"), action: "equip" });
    buttons.push({ label: t("ui.take"), action: "take" });
  } else if (item.category === "Exoskeleton") {
    buttons.push({ label: t("ui.take"), action: "take" });
    buttons.push({ label: t("ui.destroy"), action: "destroy" });
  } else if (item.category === "Medkit") {
    buttons.push({ label: t("ui.take"), action: "take" });
    buttons.push({ label: t("ui.destroy"), action: "destroy" });
  } else if (item.category === "Weapon") {
    buttons.push({ label: t("ui.equipA"), action: "equip", slot: 0 });
    buttons.push({ label: t("ui.equipB"), action: "equip", slot: 1 });
    buttons.push({ label: t("ui.take"), action: "take" });
    buttons.push({ label: t("ui.destroy"), action: "destroy" });
  } else if (item.category === "Ammo") {
    buttons.push({ label: t("ui.equipA"), action: "equip", slot: 0 });
    buttons.push({ label: t("ui.equipB"), action: "equip", slot: 1 });
    buttons.push({ label: t("ui.take"), action: "take" });
    buttons.push({ label: t("ui.destroy"), action: "destroy" });
  } else {
    buttons.push({ label: t("ui.take"), action: "take" });
    buttons.push({ label: t("ui.destroy"), action: "destroy" });
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
    elements.inventory.innerHTML = `<div class="muted">${t("ui.inventoryEmpty")}</div>`;
    return;
  }
  player.inventory.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "inventory-row";
    row.innerHTML = `
      <span>${getItemDisplayName(item)}</span>
      <button>${t("ui.dropItem")}</button>
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
    row.textContent = formatLogEntry(entry);
    elements.log.appendChild(row);
  });
}

function formatLogEntry(entry) {
  if (typeof entry === "string") return entry;
  return t(entry.key, resolveLogVars(entry.vars));
}

function formatList(items) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) {
    return `${items[0]} ${t("ui.listConjunction")} ${items[1]}`;
  }
  const separator = t("ui.listSeparator");
  const head = items.slice(0, -1).join(separator);
  return `${head}${separator}${t("ui.listConjunction")} ${items[items.length - 1]}`;
}

function formatHitParts(parts) {
  const counts = parts.reduce((acc, part) => {
    acc[part] = (acc[part] ?? 0) + 1;
    return acc;
  }, {});
  const labeled = Object.entries(counts).map(([part, count]) => {
    const label = getArmorPartLabel(part);
    return count > 1 ? `${label} ×${count}` : label;
  });
  return formatList(labeled);
}

function isMultiHitEntry(entry) {
  return entry?.key === "log.shotHit"
    && entry.vars?.weapon
    && ["Shotgun", "Sword"].includes(entry.vars.weapon);
}

function shouldCombineHitEntries(current, previous) {
  return isMultiHitEntry(current)
    && isMultiHitEntry(previous)
    && current.vars.attackerId === previous.vars.attackerId
    && current.vars.targetId === previous.vars.targetId
    && current.vars.weapon === previous.vars.weapon
    && current.vars.targetBefore
    && current.vars.targetAfter
    && previous.vars.targetBefore
    && previous.vars.targetAfter;
}

function getLastActionEntries() {
  const entries = [];
  for (let index = state.log.length - 1; index >= 0 && entries.length < 5; index -= 1) {
    const entry = state.log[index];
    const previous = state.log[index - 1];
    if (shouldCombineHitEntries(entry, previous)) {
      entries.push({
        key: "log.shotHitCombined",
        vars: {
          hits: [previous, entry],
        },
      });
      index -= 1;
      continue;
    }
    entries.push(entry);
  }
  return entries;
}

function renderLastAction() {
  if (elements.lastActionMessage) {
    const entries = getLastActionEntries();
    if (entries.length === 0) {
      elements.lastActionMessage.textContent = "—";
      return;
    }
    elements.lastActionMessage.innerHTML = entries
      .map((entry) => renderLastActionEntry(entry))
      .join("");
  }
}

function renderLastActionEntry(entry) {
  if (typeof entry === "string") {
    return `<div class="action-entry">${entry}</div>`;
  }
  if (entry.key === "log.turnStart") {
    const playerColor = getPlayerColorById(entry.vars.playerId);
    return `
      <div class="action-entry action-entry--turn" style="--player-color: ${playerColor}">
        ${t(entry.key, resolveLogVarsForAction(entry.vars))}
      </div>
    `;
  }
  if (entry.key === "log.shotHit" && entry.vars?.targetBefore && entry.vars?.targetAfter) {
    const attackerLabel = getStyledPlayerLabelById(entry.vars.attackerId);
    const targetLabel = getStyledPlayerLabelById(entry.vars.targetId);
    const partLabel = getArmorPartLabel(entry.vars.part);
    const weaponLabel = getWeaponLabel(entry.vars.weapon);
    const summary = t("ui.hitSummary", {
      attacker: attackerLabel,
      target: targetLabel,
      part: partLabel,
      weapon: weaponLabel,
    });
    const shotLabel = t("ui.shotLabel", { shot: entry.vars.shot });
    const chanceLabel = t("ui.hitChance", { chance: entry.vars.chance });
    return `
      <div class="action-entry action-entry--hit">
        <div class="action-hit-header">
          <div class="action-hit-title">${summary}</div>
          <div class="action-hit-meta">${shotLabel} · ${chanceLabel}</div>
        </div>
        <div class="action-hit-avatars">
          <div class="action-hit-avatar">
            <div class="action-hit-avatar-label">${t("ui.beforeHit")}</div>
            <div class="avatar">${renderAvatarParts(entry.vars.targetBefore)}</div>
            <div class="hp-row">${renderHearts(entry.vars.targetBefore.health ?? 0)}</div>
          </div>
          <div class="action-hit-avatar">
            <div class="action-hit-avatar-label">${t("ui.afterHit")}</div>
            <div class="avatar">${renderAvatarParts(entry.vars.targetAfter)}</div>
            <div class="hp-row">${renderHearts(entry.vars.targetAfter.health ?? 0)}</div>
          </div>
        </div>
      </div>
    `;
  }
  if (entry.key === "log.shotHitCombined" && Array.isArray(entry.vars?.hits)) {
    const [firstHit, lastHit] = entry.vars.hits;
    const attackerLabel = getStyledPlayerLabelById(firstHit.vars.attackerId);
    const targetLabel = getStyledPlayerLabelById(firstHit.vars.targetId);
    const weaponLabel = getWeaponLabel(firstHit.vars.weapon);
    const parts = formatHitParts(entry.vars.hits.map((hit) => hit.vars.part));
    const summary = t("ui.hitSummaryMulti", {
      attacker: attackerLabel,
      target: targetLabel,
      parts,
      weapon: weaponLabel,
    });
    const shotLabel = t("ui.shotLabelRange", {
      start: firstHit.vars.shot,
      end: lastHit.vars.shot,
    });
    const chanceLabel = t("ui.hitChance", { chance: lastHit.vars.chance });
    return `
      <div class="action-entry action-entry--hit">
        <div class="action-hit-header">
          <div class="action-hit-title">${summary}</div>
          <div class="action-hit-meta">${shotLabel} · ${chanceLabel}</div>
        </div>
        <div class="action-hit-avatars">
          <div class="action-hit-avatar">
            <div class="action-hit-avatar-label">${t("ui.beforeHit")}</div>
            <div class="avatar">${renderAvatarParts(firstHit.vars.targetBefore)}</div>
            <div class="hp-row">${renderHearts(firstHit.vars.targetBefore.health ?? 0)}</div>
          </div>
          <div class="action-hit-avatar">
            <div class="action-hit-avatar-label">${t("ui.afterHit")}</div>
            <div class="avatar">${renderAvatarParts(lastHit.vars.targetAfter)}</div>
            <div class="hp-row">${renderHearts(lastHit.vars.targetAfter.health ?? 0)}</div>
          </div>
        </div>
      </div>
    `;
  }
  return `<div class="action-entry">${t(entry.key, resolveLogVarsForAction(entry.vars))}</div>`;
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

function logEvent(key, vars = {}) {
  const entry = { key, vars };
  state.log.push(entry);
  setLastActionMessage(entry);
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
  logEvent("log.saveDone");
  renderLog();
}

function loadGame() {
  const payload = localStorage.getItem("cellshot-save");
  if (!payload) {
    logEvent("log.noSave");
    renderLog();
    return;
  }
  const data = JSON.parse(payload);
  Object.assign(state, data);
  if (!state.mapSeed) {
    state.mapSeed = GENERATED_DEFAULT_SEED;
  }
  if (!state.wallThickness) {
    state.wallThickness = GENERATED_DEFAULT_WALL_THICKNESS;
  }
  state.rng = mulberry32(state.seed);
  state.aiTurnId += 1;
  state.victory = null;
  state.victoryAchieved = Boolean(state.victoryAchieved);
  state.players.forEach((player, index) => {
    if (!player.nameKey) {
      player.nameKey = player.name || PLAYER_PRESETS[index]?.nameKey || "Red";
    }
  });
  state.playerTypeSelections = state.players.map((player) => (player.isAI ? "ai" : "human"));
  logEvent("log.loadDone");
  elements.mapSelect.value = state.mapName;
  elements.crateInterval.value = state.crateInterval || 3;
  elements.fragLimit.value = state.fragLimit || 10;
  elements.playerCount.value = String(state.players.length);
  setLanguage(state.language);
  hideStartScreen();
}

function stripItem(item) {
  return {
    displayName: item.displayName,
    displayKey: item.displayKey,
    displayParams: item.displayParams,
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
