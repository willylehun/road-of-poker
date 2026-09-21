const AVATAR_COUNT = 20;
const STORAGE_KEY = "pokerByWProfile";
const PROFILE_VERSION = 2;
const PRIZES = [100, 250, 150, 400, 200, 125, 300, 175];
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

// Progression du circuit : des tables d'initiation vers les villes les plus
// prestigieuses du poker international, avec Las Vegas comme destination finale.
const TABLES = [
  { city: "Dakar", code: "DKR", slug: "dakar", color: "#b84d2f", accent: "#f1a552", buyIn: 100, small: 5, big: 10, tier: "Club découverte", prestige: 1, players: 109 },
  { city: "New Delhi", code: "DEL", slug: "new-delhi", color: "#d47b22", accent: "#6e65c9", buyIn: 150, small: 5, big: 10, tier: "Circuit régional", prestige: 2, players: 164 },
  { city: "Auckland", code: "AKL", slug: "auckland", color: "#087b78", accent: "#86cbb7", buyIn: 200, small: 10, big: 20, tier: "Circuit régional", prestige: 3, players: 96 },
  { city: "Beijing", code: "BJS", slug: "beijing", color: "#a91f2f", accent: "#51a37d", buyIn: 300, small: 10, big: 20, tier: "Open international", prestige: 4, players: 225 },
  { city: "São Paulo", code: "SAO", slug: "sao-paulo", color: "#1a5da8", accent: "#a7d33f", buyIn: 400, small: 15, big: 30, tier: "Open international", prestige: 5, players: 208 },
  { city: "Rome", code: "ROM", slug: "rome", color: "#7c2532", accent: "#d7b169", buyIn: 500, small: 20, big: 40, tier: "Masters européen", prestige: 6, players: 176 },
  { city: "Doha", code: "DOH", slug: "doha", color: "#087d91", accent: "#c9955b", buyIn: 650, small: 25, big: 50, tier: "High Roller", prestige: 7, players: 122 },
  { city: "Sydney", code: "SYD", slug: "sydney", color: "#1766ad", accent: "#ed786d", buyIn: 800, small: 30, big: 60, tier: "Masters Pacifique", prestige: 8, players: 187 },
  { city: "Paris", code: "PAR", slug: "paris", color: "#263766", accent: "#d8ad57", buyIn: 1000, small: 40, big: 80, tier: "European Tour", prestige: 9, players: 238 },
  { city: "Tokyo", code: "TYO", slug: "tokyo", color: "#b11b72", accent: "#21c9d5", buyIn: 1400, small: 50, big: 100, tier: "Masters Asie", prestige: 10, players: 312 },
  { city: "Miami", code: "MIA", slug: "miami", color: "#0a9b9d", accent: "#ff6ba6", buyIn: 2000, small: 75, big: 150, tier: "Championship", prestige: 11, players: 265 },
  { city: "Londres", code: "LON", slug: "london", color: "#234b85", accent: "#b77b4c", buyIn: 3000, small: 100, big: 200, tier: "European Elite", prestige: 12, players: 194 },
  { city: "New York", code: "NYC", slug: "new-york", color: "#29313d", accent: "#ffae3d", buyIn: 4500, small: 150, big: 300, tier: "World Masters", prestige: 13, players: 351 },
  { city: "Dubaï", code: "DXB", slug: "dubai", color: "#151515", accent: "#e0b34f", buyIn: 6500, small: 250, big: 500, tier: "Super High Roller", prestige: 14, players: 297 },
  { city: "Las Vegas", code: "LAS", slug: "las-vegas", color: "#591c75", accent: "#f04455", buyIn: 10000, small: 500, big: 1000, tier: "Table légendaire", prestige: 15, players: 486 }
];

const RANKING_NAMES = [
  "Amélie Laurent", "Mateo Salazar", "Hana Nakamura", "Idrissa Ndiaye", "Sofia Marin", "Noah Bennett", "Priya Kapoor", "Luca Moretti", "Mei Lin", "Omar Haddad", "Camila Ribeiro",
  "Arthur Delmas", "Valentina Costa", "Ethan Brooks", "Aïcha Diop", "Kenji Sato", "Nora Al-Mansouri", "Thiago Alves", "Elena Petrova", "Samuel Okoro", "Mia Thompson", "Rafael Ortega",
  "Chloé Bernard", "Youssef Benali", "Haruto Tanaka", "Leila Rahmani", "Gabriel Martins", "Isla Campbell", "Rohan Mehta", "Zoe Mitchell", "Marco Bianchi", "Fatou Ba", "Min-Jun Park",
  "Lucía Navarro", "Daniel Wilson", "Aya Kobayashi", "Nabil Karam", "Beatriz Souza", "Hugo Lefèvre", "Ananya Shah", "Moussa Diallo", "Freya Collins", "Enzo Romano", "Jin Wei",
  "Sarah Cohen", "Diego Mendoza", "Lina Abdallah", "Thomas Walker", "Yuna Kim", "João Pereira", "Inès Chevalier", "Arjun Malhotra", "Malik Johnson", "Giulia Conti", "Chen Yu",
  "Mariam El-Sayed", "Nicolás Herrera", "Emma Fischer", "Daichi Ito", "Salma Azzam", "Antoine Girard", "Larissa Rocha", "Kofi Mensah", "Olivia Reed", "Vikram Rao", "Alessia Ricci",
  "Zhang Lei", "Clara Dupont", "Adama Sow", "Ivan Volkov", "Amina Noor", "Bruno Carvalho", "Grace Morgan", "Takumi Mori", "Neha Verma", "Louis Fontaine", "Mariana Lopes",
  "Kwame Boateng", "Sakura Watanabe", "Amir Hosseini", "Eva Schneider", "Javier Morales", "Nadia Farouk", "Felix Hartmann", "Céline Marchand", "Pablo Rojas", "Rina Suzuki", "Bilal Qureshi",
  "Natasha Evans", "André Gomes", "Seyi Adeyemi", "Mila Novak", "Tariq Mahmoud", "Élodie Mercier", "Felipe Castro", "Ji-Won Lee", "Layla Hassan", "Oscar Lindberg", "Ana Torres"
];
const BOT_NAMES = RANKING_NAMES.slice(0, 18);
const STREET_LABELS = { preflop: "Pré-flop", flop: "Flop", turn: "Turn", river: "River" };

function defaultProfile() {
  return {
    version: PROFILE_VERSION,
    name: "",
    avatar: 0,
    balance: 1000,
    rank: 100,
    wins: 0,
    champion: 0,
    gains: 0,
    played: 0,
    podiums: 0,
    unlockedTable: 0,
    lastSpin: null,
    createdAt: new Date().toISOString()
  };
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return defaultProfile();
    if (stored.version !== PROFILE_VERSION) {
      return {
        ...defaultProfile(),
        name: typeof stored.name === "string" ? stored.name : "",
        avatar: Number.isInteger(stored.avatar) ? stored.avatar : 0,
        createdAt: stored.createdAt || new Date().toISOString(),
        lastSpin: stored.lastSpin || null
      };
    }
    return { ...defaultProfile(), ...stored };
  } catch {
    return defaultProfile();
  }
}

let profile = loadProfile();
let selectedAvatar = profile.avatar || 0;
let activeFilter = "all";
let wheelRotation = 0;
let game = null;

function saveProfile() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  updateProfileUI();
}

function avatarPath(index) {
  return `assets/avatars/avatar-${String(index).padStart(2, "0")}.webp`;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.getElementById("toast-region").append(toast);
  window.setTimeout(() => toast.remove(), 3500);
}

function buildAvatars() {
  const grid = document.getElementById("avatar-grid");
  grid.innerHTML = Array.from({ length: AVATAR_COUNT }, (_, index) => `
    <button class="avatar-option ${index === selectedAvatar ? "selected" : ""}" type="button" data-avatar="${index}" aria-label="Choisir l’avatar ${index + 1}" aria-pressed="${index === selectedAvatar}">
      <img src="${avatarPath(index)}" alt="Avatar ${index + 1}">
    </button>`).join("");
  grid.querySelectorAll("[data-avatar]").forEach(button => {
    button.addEventListener("click", () => {
      selectedAvatar = Number(button.dataset.avatar);
      grid.querySelectorAll("[data-avatar]").forEach(option => {
        const selected = option === button;
        option.classList.toggle("selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
    });
  });
}

function openProfileModal(force = false) {
  const modal = document.getElementById("profile-modal");
  document.getElementById("player-name-input").value = profile.name;
  document.getElementById("profile-close").hidden = force || !profile.name;
  selectedAvatar = profile.avatar || 0;
  buildAvatars();
  modal.classList.remove("hidden");
  window.setTimeout(() => document.getElementById("player-name-input").focus(), 50);
}

function closeProfileModal() {
  if (!profile.name) return;
  document.getElementById("profile-modal").classList.add("hidden");
}

function submitProfile() {
  const input = document.getElementById("player-name-input");
  const error = document.getElementById("profile-error");
  const name = input.value.trim().replace(/\s+/g, " ");
  if (name.length < 2) {
    error.textContent = "Choisissez un nom d’au moins 2 caractères.";
    input.focus();
    return;
  }
  profile.name = name;
  profile.avatar = selectedAvatar;
  error.textContent = "";
  saveProfile();
  closeProfileModal();
  renderAll();
  showToast(`Bienvenue au club, ${profile.name}.`);
}

function calculateRank() {
  const progress = profile.unlockedTable * 5 + profile.podiums * 3 + profile.wins * 6;
  return Math.max(1, 100 - progress);
}

function updateProfileUI() {
  profile.rank = calculateRank();
  const name = profile.name || "Invité";
  const balance = money.format(profile.balance);
  const avatar = avatarPath(profile.avatar);
  const bestTable = TABLES[Math.min(profile.unlockedTable, TABLES.length - 1)];
  const unlockedCount = Math.min(TABLES.length, profile.unlockedTable + 1);
  const pairs = {
    "header-name": name,
    "header-balance": balance,
    "welcome-name": name,
    "lobby-balance": balance,
    "lobby-rank": `#${profile.rank}`,
    "lobby-wins": profile.wins,
    "tables-balance": balance,
    "stats-name": name,
    "stats-rank": `#${profile.rank}`,
    "stat-champion": profile.champion,
    "stat-wins": profile.wins,
    "stat-gains": money.format(profile.gains),
    "stat-played": profile.played,
    "stat-podiums": `Top 3 : ${profile.podiums}`,
    "stat-best-table": `${bestTable.city} · table ${bestTable.prestige}`,
    "table-progress-copy": `${unlockedCount} table${unlockedCount > 1 ? "s" : ""} sur 15 déverrouillée${unlockedCount > 1 ? "s" : ""}`
  };
  Object.entries(pairs).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  document.getElementById("table-progress-bar").style.width = `${Math.round(unlockedCount / TABLES.length * 100)}%`;
  document.getElementById("header-avatar").src = avatar;
  document.getElementById("stats-avatar").src = avatar;
  const created = new Date(profile.createdAt);
  document.getElementById("stats-since").textContent = `Membre depuis ${created.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
  updateWheelState();
}

function buildWheelLabels() {
  const labels = document.getElementById("wheel-labels");
  labels.innerHTML = PRIZES.map((prize, index) => {
    const angle = index * 45 + 22.5;
    return `<span class="wheel-label" style="--angle:${angle}deg;--counter-angle:-${angle}deg">${prize} $</span>`;
  }).join("");
}

function tableCard(table, index) {
  const unlocked = index <= profile.unlockedTable;
  const affordable = profile.balance >= table.buyIn;
  const isNext = index === profile.unlockedTable;
  const buttonLabel = !unlocked ? "🔒 Verrouillée" : affordable ? "Jouer maintenant" : "Solde insuffisant";
  return `<article class="table-card ${unlocked ? "playable" : "locked"} ${isNext ? "next-destination" : ""}" data-code="${table.code}" data-table-index="${index}" tabindex="${unlocked && affordable ? "0" : "-1"}" style="--table-color:${table.color};--table-accent:${table.accent};--table-image:url('assets/tables/${table.slug}.webp')">
    <div class="city-row"><div><span class="eyebrow">Niveau ${table.prestige} · ${table.tier}</span><h3>${table.city}</h3><p>Tournoi Texas Hold’em · 6 joueurs</p></div><span class="city-marker">${table.code.slice(0, 2)}</span></div>
    <div class="table-meta"><span>Entrée<strong>${money.format(table.buyIn)}</strong></span><span>Blindes<strong>${table.small} / ${table.big}</strong></span></div>
    <div class="table-action"><span class="players-online">${unlocked ? `● ${table.players} joueurs` : "Top 3 requis"}</span><button class="join-btn ${unlocked && affordable ? "" : "locked"}" type="button" data-play-table="${index}" ${!unlocked || !affordable ? "disabled" : ""}>${buttonLabel}</button></div>
  </article>`;
}

function renderTables() {
  const nextIndex = Math.min(profile.unlockedTable, TABLES.length - 1);
  const featuredIndices = [...new Set([0, nextIndex, TABLES.length - 1])];
  document.getElementById("featured-tables").innerHTML = featuredIndices.map(index => tableCard(TABLES[index], index)).join("");

  let entries = TABLES.map((table, index) => ({ table, index }));
  if (activeFilter === "accessible") entries = entries.filter(entry => entry.index <= profile.unlockedTable);
  if (activeFilter === "locked") entries = entries.filter(entry => entry.index > profile.unlockedTable);
  document.getElementById("tables-grid").innerHTML = entries.length
    ? entries.map(entry => tableCard(entry.table, entry.index)).join("")
    : '<div class="empty-state">Toutes les tables sont déjà déverrouillées.</div>';

  const current = TABLES[nextIndex];
  const following = TABLES[nextIndex + 1];
  document.getElementById("progression-line").innerHTML = following
    ? `Table actuelle : <strong>${current.city}</strong>. Terminez dans le top 3 pour déverrouiller <strong>${following.city}</strong>.`
    : `Toutes les destinations sont ouvertes. <strong>Las Vegas</strong> vous attend.`;

  document.querySelectorAll("[data-play-table]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      startTournament(Number(button.dataset.playTable));
    });
  });
  document.querySelectorAll(".table-card.playable").forEach(card => {
    const index = Number(card.dataset.tableIndex);
    card.addEventListener("click", () => {
      if (profile.balance >= TABLES[index].buyIn) startTournament(index);
      else showToast("Votre solde est insuffisant pour cette table.");
    });
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function spinWheel() {
  if (profile.lastSpin === todayKey()) return;
  const button = document.getElementById("spin-button");
  const wheel = document.getElementById("daily-wheel");
  button.disabled = true;
  const index = Math.floor(Math.random() * PRIZES.length);
  const prize = PRIZES[index];
  const target = 360 - (index * 45 + 22.5);
  wheelRotation = Math.ceil(wheelRotation / 360) * 360 + 1800 + target;
  wheel.style.transform = `rotate(${wheelRotation}deg)`;
  document.getElementById("wheel-message").textContent = "La roue tourne…";
  window.setTimeout(() => {
    profile.balance += prize;
    profile.gains += prize;
    profile.lastSpin = todayKey();
    saveProfile();
    renderTables();
    document.getElementById("wheel-message").textContent = `Vous gagnez ${money.format(prize)} !`;
    button.textContent = "À demain";
    showToast(`Bonus quotidien : +${money.format(prize)}`);
  }, 4200);
}

function updateWheelState() {
  const done = profile.lastSpin === todayKey();
  const button = document.getElementById("spin-button");
  button.disabled = done;
  button.textContent = done ? "À demain" : "Tourner la roue";
  if (done) document.getElementById("wheel-message").textContent = "Bonus récupéré. Revenez demain.";
}

function makeRanking() {
  const players = RANKING_NAMES.map((name, i) => ({
    rank: i + 1,
    name,
    avatar: (i * 7 + 3) % AVATAR_COUNT,
    wins: Math.max(0, 18 - Math.floor(i / 6)),
    gains: Math.max(900, 418000 - i * 4050)
  }));
  const rankIndex = Math.min(99, Math.max(0, profile.rank - 1));
  players.splice(rankIndex, 0, {
    rank: profile.rank,
    name: profile.name || "Vous",
    avatar: profile.avatar,
    wins: profile.wins,
    gains: profile.gains,
    current: true
  });
  return players.map((player, index) => ({ ...player, rank: index + 1 }));
}

function renderRanking() {
  const players = makeRanking();
  const podiumOrder = [players[1], players[0], players[2]];
  const classes = ["second", "first", "third"];
  document.getElementById("podium").innerHTML = podiumOrder.map((player, i) => `<article class="podium-card ${classes[i]}"><div class="podium-rank">${player.rank}</div><img src="${avatarPath(player.avatar)}" alt=""><strong>${player.name}</strong><small>${money.format(player.gains)}</small></article>`).join("");
  document.getElementById("ranking-list").innerHTML = players.map(player => `<div class="rank-row ${player.rank <= 6 ? "qualifier" : ""} ${player.current ? "current" : ""}"><span class="rank-number">${player.rank <= 6 ? "★ " : ""}${player.rank}</span><div class="rank-player"><img src="${avatarPath(player.avatar)}" alt=""><span>${player.name}${player.current ? " (vous)" : ""}</span></div><span>${player.wins}</span><span>${money.format(player.gains)}</span></div>`).join("");
  document.getElementById("qualifiers").innerHTML = players.slice(0, 6).map((player, i) => `<div class="qualifier-seat seat-${i + 1}"><img src="${avatarPath(player.avatar)}" alt=""><strong>${player.name}</strong><small>#${player.rank}</small></div>`).join("");
  document.getElementById("qualification-note").innerHTML = profile.rank <= 6
    ? "<strong>Vous êtes qualifié.</strong> Votre siège est réservé pour la finale."
    : `Vous êtes actuellement <strong>#${profile.rank}</strong>. Atteignez le top 6 avant la fin de la saison pour rejoindre cette table.`;
}

function switchView(viewName) {
  if (game && !game.finished && viewName !== "game") {
    showToast("Terminez la partie ou utilisez « Quitter la table ».");
    return;
  }
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `view-${viewName}`));
  document.querySelectorAll("[data-view-target]").forEach(button => button.classList.toggle("active", button.dataset.viewTarget === viewName));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextActiveIndex(startIndex) {
  if (!game) return -1;
  for (let step = 1; step <= game.players.length; step += 1) {
    const candidate = (startIndex + step) % game.players.length;
    if (!game.players[candidate].eliminated && game.players[candidate].stack > 0) return candidate;
  }
  return -1;
}

function takeBet(player, requested) {
  const paid = Math.max(0, Math.min(player.stack, Math.floor(requested)));
  player.stack -= paid;
  player.currentBet += paid;
  game.pot += paid;
  game.currentBet = Math.max(game.currentBet, player.currentBet);
  return paid;
}

function amountToCall(player) {
  return Math.max(0, game.currentBet - player.currentBet);
}

function activeInHand() {
  return game.players.filter(player => !player.eliminated && !player.folded);
}

function remainingTournamentPlayers() {
  return game.players.filter(player => !player.eliminated && player.stack > 0);
}

function currentBlinds() {
  const level = Math.floor((Math.max(1, game.handNumber) - 1) / 4);
  const multiplier = 1 + level * 0.5;
  return {
    small: Math.max(1, Math.round(game.table.small * multiplier)),
    big: Math.max(2, Math.round(game.table.big * multiplier))
  };
}

function startTournament(tableIndex) {
  if (game && !game.finished) {
    switchView("game");
    showToast("Un tournoi est déjà en cours.");
    return;
  }
  const table = TABLES[tableIndex];
  if (!table || tableIndex > profile.unlockedTable) {
    showToast("Cette table n’est pas encore déverrouillée.");
    return;
  }
  if (profile.balance < table.buyIn) {
    showToast("Votre solde est insuffisant pour cette table.");
    return;
  }
  profile.balance -= table.buyIn;
  profile.played += 1;
  saveProfile();
  const startingStack = table.big * 50;
  game = {
    table,
    tableIndex,
    players: Array.from({ length: 6 }, (_, index) => ({
      name: index === 0 ? (profile.name || "Vous") : BOT_NAMES[(tableIndex * 3 + index - 1) % BOT_NAMES.length],
      avatar: index === 0 ? profile.avatar : (tableIndex * 5 + index * 3) % AVATAR_COUNT,
      human: index === 0,
      stack: startingStack,
      cards: [],
      folded: false,
      eliminated: false,
      currentBet: 0
    })),
    deck: [],
    community: [],
    pot: 0,
    currentBet: 0,
    street: "preflop",
    dealer: -1,
    smallBlindIndex: -1,
    bigBlindIndex: -1,
    handNumber: 0,
    handOver: false,
    awaitingPlayer: false,
    respondingToRaise: false,
    revealBots: false,
    log: [],
    finished: false
  };
  document.getElementById("game-title").textContent = `Table de ${table.city}`;
  document.getElementById("game-tier").textContent = `Niveau ${table.prestige} · ${table.tier}`;
  const pokerTable = document.querySelector(".poker-table");
  pokerTable.style.setProperty("--table-color", table.color);
  pokerTable.style.setProperty("--table-accent", table.accent);
  pokerTable.style.setProperty("--table-image", `url('assets/tables/${table.slug}.webp')`);
  switchView("game");
  newHand();
}

function newHand() {
  if (!game || game.finished) return;
  game.players.forEach(player => {
    if (player.stack <= 0) player.eliminated = true;
  });
  if (checkTournamentEnd()) return;

  game.handNumber += 1;
  game.handOver = false;
  game.awaitingPlayer = false;
  game.respondingToRaise = false;
  game.revealBots = false;
  game.community = [];
  game.pot = 0;
  game.currentBet = 0;
  game.street = "preflop";
  game.log = [];
  game.deck = PokerEngine.shuffle(PokerEngine.createDeck());
  game.players.forEach(player => {
    player.cards = [];
    player.folded = player.eliminated;
    player.currentBet = 0;
  });

  game.dealer = nextActiveIndex(game.dealer);
  const active = remainingTournamentPlayers();
  if (active.length === 2) {
    game.smallBlindIndex = game.dealer;
    game.bigBlindIndex = nextActiveIndex(game.smallBlindIndex);
  } else {
    game.smallBlindIndex = nextActiveIndex(game.dealer);
    game.bigBlindIndex = nextActiveIndex(game.smallBlindIndex);
  }

  for (let round = 0; round < 2; round += 1) {
    game.players.forEach(player => {
      if (!player.eliminated) player.cards.push(game.deck.pop());
    });
  }

  const blinds = currentBlinds();
  takeBet(game.players[game.smallBlindIndex], blinds.small);
  takeBet(game.players[game.bigBlindIndex], blinds.big);
  addGameLog(`Main ${game.handNumber}. ${game.players[game.smallBlindIndex].name} pose la petite blinde ${blinds.small}, ${game.players[game.bigBlindIndex].name} la grosse blinde ${blinds.big}.`);
  game.awaitingPlayer = !game.players[0].eliminated && game.players[0].stack > 0;
  document.getElementById("next-hand").classList.add("hidden");
  renderGame();
  if (!game.awaitingPlayer) runOutToShowdown();
}

function addGameLog(message) {
  if (!game) return;
  game.log.push(message);
  const log = document.getElementById("game-log");
  log.innerHTML = game.log.map(line => `<p>${line}</p>`).join("");
  log.scrollTop = log.scrollHeight;
}

function cardHTML(card, hidden = false, empty = false) {
  if (empty) return '<div class="playing-card empty"></div>';
  if (hidden) return '<div class="playing-card back">W</div>';
  return `<div class="playing-card ${card.color === "red" ? "red" : ""}"><span>${card.rank}</span><span class="card-suit">${card.symbol}</span></div>`;
}

function renderGame() {
  if (!game) return;
  const blinds = currentBlinds();
  document.getElementById("game-balance").textContent = money.format(profile.balance);
  document.getElementById("game-pot").textContent = game.pot.toLocaleString("fr-FR");
  document.getElementById("felt-pot").textContent = game.pot.toLocaleString("fr-FR");
  document.getElementById("game-blinds").textContent = `${blinds.small} / ${blinds.big}`;
  document.getElementById("game-hand-number").textContent = game.handNumber;
  document.getElementById("game-street").textContent = STREET_LABELS[game.street];
  document.getElementById("community-cards").innerHTML = Array.from({ length: 5 }, (_, index) =>
    index < game.community.length ? cardHTML(game.community[index]) : cardHTML(null, false, true)
  ).join("");

  document.getElementById("game-seats").innerHTML = game.players.map((player, index) => {
    const tags = [];
    if (index === game.dealer) tags.push('<span class="dealer-button">D</span>');
    if (index === game.smallBlindIndex) tags.push('<span class="seat-status">SB</span>');
    if (index === game.bigBlindIndex) tags.push('<span class="seat-status">BB</span>');
    if (player.folded && !player.eliminated) tags.push('<span class="seat-status">Fold</span>');
    if (player.eliminated) tags.push('<span class="seat-status">Éliminé</span>');
    const reveal = player.human || game.revealBots;
    const cards = player.cards.map(card => cardHTML(card, !reveal || player.folded)).join("");
    return `<div class="game-seat seat-${index} ${player.eliminated ? "eliminated" : ""} ${player.folded ? "folded" : ""} ${player.human && game.awaitingPlayer ? "current-turn" : ""}">
      <div class="seat-cards">${cards}</div>
      <img class="seat-avatar" src="${avatarPath(player.avatar)}" alt="">
      <span class="seat-name">${player.human ? "Vous" : player.name}${tags.join("")}</span>
      <span class="seat-stack">${player.stack.toLocaleString("fr-FR")} jetons</span>
    </div>`;
  }).join("");

  const human = game.players[0];
  const toCall = amountToCall(human);
  const callButton = document.getElementById("action-call");
  callButton.textContent = toCall > 0 ? `Suivre ${Math.min(toCall, human.stack)}` : "Parole";
  const canAct = game.awaitingPlayer && !game.handOver && !human.folded && human.stack > 0;
  ["action-fold", "action-call", "action-raise", "action-allin"].forEach(id => {
    document.getElementById(id).disabled = !canAct;
  });

  const raiseInput = document.getElementById("raise-amount");
  const maxRaise = Math.max(0, human.stack - toCall);
  const minRaise = Math.min(maxRaise || blinds.big, blinds.big);
  raiseInput.min = Math.max(1, minRaise);
  raiseInput.max = Math.max(1, maxRaise);
  raiseInput.step = Math.max(1, Math.round(blinds.big / 2));
  if (Number(raiseInput.value) > maxRaise || Number(raiseInput.value) < minRaise) {
    raiseInput.value = Math.max(1, Math.min(maxRaise, blinds.big * 2));
  }
  raiseInput.disabled = !canAct || maxRaise <= 0;
  document.getElementById("raise-output").value = Number(raiseInput.value).toLocaleString("fr-FR");
  document.getElementById("action-raise").disabled = !canAct || maxRaise <= 0;

  const allCards = [...human.cards, ...game.community];
  document.getElementById("player-hand-name").textContent = allCards.length >= 5
    ? PokerEngine.handName(PokerEngine.evaluateBest(allCards))
    : "Vos cartes";
  document.getElementById("turn-message").textContent = game.handOver
    ? "Main terminée."
    : game.awaitingPlayer
      ? (toCall > 0 ? `À vous : ${toCall} jetons à suivre.` : "À vous : parole ou relance.")
      : "Les adversaires jouent…";
}

async function playerAction(action) {
  if (!game?.awaitingPlayer || game.handOver) return;
  const human = game.players[0];
  const toCall = amountToCall(human);
  const wasResponse = game.respondingToRaise;
  game.awaitingPlayer = false;
  renderGame();

  if (action === "fold") {
    human.folded = true;
    addGameLog("Vous vous couchez.");
    await pause(260);
    await runOutToShowdown();
    return;
  }

  if (action === "call") {
    if (toCall > 0) {
      const paid = takeBet(human, toCall);
      addGameLog(paid < toCall ? `Vous suivez à tapis pour ${paid} jetons.` : `Vous suivez ${paid} jetons.`);
    } else {
      addGameLog("Vous dites parole.");
    }
    if (wasResponse) {
      game.respondingToRaise = false;
      await advanceStreetOrShowdown();
      return;
    }
  }

  if (action === "raise" || action === "allin") {
    const extra = action === "allin" ? Math.max(0, human.stack - toCall) : Number(document.getElementById("raise-amount").value);
    const paid = takeBet(human, toCall + extra);
    addGameLog(action === "allin" ? `Vous faites tapis pour ${paid} jetons !` : `Vous engagez ${paid} jetons et relancez.`);
  }

  if (human.stack <= 0) {
    addGameLog("Vous êtes à tapis. Les cartes restantes vont être révélées.");
  }
  await runBots(action === "raise" || action === "allin", !wasResponse);

  if (activeInHand().length <= 1) {
    awardUncontestedPot();
    return;
  }
  const newCall = amountToCall(human);
  if (newCall > 0 && human.stack > 0 && !human.folded && !wasResponse) {
    game.awaitingPlayer = true;
    game.respondingToRaise = true;
    addGameLog(`Une relance vous oblige à ajouter ${newCall} jetons.`);
    renderGame();
    return;
  }
  if (human.stack <= 0) await runOutToShowdown();
  else await advanceStreetOrShowdown();
}

async function runBots(humanRaised, allowReraise = true) {
  let reraiseUsed = false;
  for (let index = 1; index < game.players.length; index += 1) {
    const bot = game.players[index];
    if (bot.eliminated || bot.folded || bot.stack <= 0) continue;
    await pause(180);
    const toCall = amountToCall(bot);
    const strength = PokerEngine.estimateStrength(bot.cards, game.community);
    const pressure = toCall / Math.max(1, bot.stack + toCall);
    const roll = Math.random();

    if (toCall > 0) {
      const foldThreshold = Math.max(0.05, 0.62 - strength * 0.075 + pressure * 0.65);
      if (roll < foldThreshold && bot.stack > toCall) {
        bot.folded = true;
        addGameLog(`${bot.name} se couche.`);
      } else {
        const paid = takeBet(bot, toCall);
        addGameLog(paid < toCall ? `${bot.name} suit à tapis pour ${paid}.` : `${bot.name} suit ${paid}.`);
        const canReraise = allowReraise && !reraiseUsed && bot.stack > 0 && strength >= 5.8 && Math.random() < 0.3;
        if (canReraise) {
          const extra = Math.min(bot.stack, currentBlinds().big * (2 + Math.floor(strength / 3)));
          const raised = takeBet(bot, extra);
          if (raised > 0) {
            reraiseUsed = true;
            addGameLog(`${bot.name} sur-relance de ${raised}.`);
          }
        }
      }
    } else {
      const betChance = Math.min(0.55, 0.04 + strength * 0.055);
      const bluff = strength < 2.3 && Math.random() < 0.08;
      if ((betChance > Math.random() || bluff) && bot.stack > 0 && allowReraise) {
        const size = Math.min(bot.stack, currentBlinds().big * (bluff ? 2 : 1 + Math.floor(strength / 2)));
        const paid = takeBet(bot, size);
        addGameLog(bluff ? `${bot.name} tente un bluff à ${paid}.` : `${bot.name} mise ${paid}.`);
        if (paid > 0) reraiseUsed = true;
      } else {
        addGameLog(`${bot.name} dit parole.`);
      }
    }
    renderGame();
    if (activeInHand().length <= 1) break;
  }
}

function resetStreetBets() {
  game.currentBet = 0;
  game.respondingToRaise = false;
  game.players.forEach(player => { player.currentBet = 0; });
}

function revealNextStreet() {
  if (game.street === "preflop") {
    game.street = "flop";
    game.community.push(game.deck.pop(), game.deck.pop(), game.deck.pop());
    addGameLog("Le flop est révélé.");
  } else if (game.street === "flop") {
    game.street = "turn";
    game.community.push(game.deck.pop());
    addGameLog("La turn est révélée.");
  } else if (game.street === "turn") {
    game.street = "river";
    game.community.push(game.deck.pop());
    addGameLog("La river est révélée.");
  }
}

async function advanceStreetOrShowdown() {
  await pause(260);
  if (activeInHand().length <= 1) {
    awardUncontestedPot();
    return;
  }
  if (game.street === "river") {
    showdown();
    return;
  }
  revealNextStreet();
  resetStreetBets();
  const human = game.players[0];
  if (human.folded || human.stack <= 0) {
    await runOutToShowdown();
    return;
  }
  game.awaitingPlayer = true;
  renderGame();
}

async function runOutToShowdown() {
  game.awaitingPlayer = false;
  renderGame();
  await runBots(false, false);
  if (activeInHand().length <= 1) {
    awardUncontestedPot();
    return;
  }
  while (game.community.length < 5) {
    await pause(260);
    revealNextStreet();
    resetStreetBets();
    renderGame();
  }
  showdown();
}

function showdown() {
  const contenders = activeInHand();
  if (!contenders.length) return;
  game.revealBots = true;
  let best = null;
  let winners = [];
  contenders.forEach(player => {
    const score = PokerEngine.evaluateBest([...player.cards, ...game.community]);
    addGameLog(`${player.human ? "Vous" : player.name} : ${PokerEngine.handName(score)}.`);
    const comparison = best ? PokerEngine.compareScores(score, best) : 1;
    if (comparison > 0) {
      best = score;
      winners = [player];
    } else if (comparison === 0) {
      winners.push(player);
    }
  });
  const share = Math.floor(game.pot / winners.length);
  winners.forEach(winner => { winner.stack += share; });
  addGameLog(`${winners.map(player => player.human ? "Vous" : player.name).join(" et ")} gagne${winners.length > 1 ? "nt" : ""} ${share} jetons avec ${PokerEngine.handName(best)}.`);
  game.pot = 0;
  finishHand();
}

function awardUncontestedPot() {
  const winner = activeInHand()[0];
  if (winner) {
    winner.stack += game.pot;
    addGameLog(`${winner.human ? "Vous remportez" : `${winner.name} remporte`} le pot de ${game.pot} jetons sans showdown.`);
  }
  game.pot = 0;
  finishHand();
}

function finishHand() {
  game.handOver = true;
  game.awaitingPlayer = false;
  game.players.forEach(player => {
    if (player.stack <= 0) player.eliminated = true;
  });
  renderGame();
  if (checkTournamentEnd()) return;
  document.getElementById("next-hand").classList.remove("hidden");
}

function checkTournamentEnd() {
  if (!game || game.finished) return true;
  const human = game.players[0];
  const alive = remainingTournamentPlayers();
  if (human.stack <= 0 || human.eliminated) {
    const place = alive.filter(player => !player.human).length + 1;
    finishTournament(place);
    return true;
  }
  if (alive.length === 1 && alive[0].human) {
    finishTournament(1);
    return true;
  }
  return false;
}

function finishTournament(place) {
  if (!game || game.finished) return;
  game.finished = true;
  const multipliers = { 1: 3.2, 2: 1.8, 3: 1.2 };
  const payout = Math.floor(game.table.buyIn * (multipliers[place] || 0));
  if (payout > 0) {
    profile.balance += payout;
    profile.gains += payout;
  }
  if (place === 1) profile.wins += 1;
  if (place <= 3) {
    profile.podiums += 1;
    if (game.tableIndex === profile.unlockedTable && profile.unlockedTable < TABLES.length - 1) {
      profile.unlockedTable += 1;
    }
    if (game.tableIndex === TABLES.length - 1 && place === 1) profile.champion += 1;
  }
  profile.rank = calculateRank();
  saveProfile();

  const unlocked = place <= 3 && game.tableIndex < TABLES.length - 1
    ? `<p>La table de <strong>${TABLES[game.tableIndex + 1].city}</strong> est maintenant déverrouillée.</p>`
    : "";
  const overlay = document.createElement("div");
  overlay.className = "result-overlay";
  overlay.innerHTML = `<div class="result-card">
    <span class="eyebrow">Tournoi de ${game.table.city}</span>
    <div class="result-place">${place}<sup>${place === 1 ? "er" : "e"}</sup></div>
    <h2>${place <= 3 ? "Vous montez sur le podium !" : "Tournoi terminé"}</h2>
    <p>${payout > 0 ? `Gain : <strong>${money.format(payout)}</strong>` : "Aucun gain cette fois."}</p>
    ${unlocked}
    <button class="primary-btn" id="result-continue" type="button">Retour aux tables</button>
  </div>`;
  document.body.append(overlay);
  document.getElementById("result-continue").addEventListener("click", () => {
    overlay.remove();
    game = null;
    renderAll();
    switchView("tables");
  });
}

function leaveTable() {
  if (!game) {
    switchView("tables");
    return;
  }
  const confirmed = window.confirm("Quitter le tournoi ? Le prix d’entrée sera perdu.");
  if (!confirmed) return;
  game.finished = true;
  game = null;
  renderAll();
  switchView("tables");
  showToast("Vous avez quitté le tournoi.");
}

function pause(milliseconds) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

function renderAll() {
  updateProfileUI();
  renderTables();
  renderRanking();
}

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const tools = [
    {
      name: "read_poker_profile",
      title: "Lire le profil Road of Poker",
      description: "Retourne le nom, le solde, le rang et la progression du profil actif.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ name: profile.name, balance: profile.balance, rank: profile.rank, unlockedTable: TABLES[profile.unlockedTable].city })
    },
    {
      name: "start_poker_tournament",
      title: "Commencer un tournoi",
      description: "Ouvre immédiatement une table de poker déverrouillée si le solde permet de payer l’entrée.",
      inputSchema: {
        type: "object",
        properties: { code: { type: "string", enum: TABLES.map(table => table.code) } },
        required: ["code"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: input => {
        const index = TABLES.findIndex(table => table.code === input?.code);
        if (index < 0) throw new Error("Table inconnue.");
        if (index > profile.unlockedTable) throw new Error("Table verrouillée.");
        if (profile.balance < TABLES[index].buyIn) throw new Error("Solde insuffisant.");
        startTournament(index);
        return { status: "started", table: TABLES[index].city, balance: profile.balance };
      }
    }
  ];
  tools.forEach(tool => {
    try { void Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch {}
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildWheelLabels();
  document.querySelectorAll("[data-view-target]").forEach(button => button.addEventListener("click", () => switchView(button.dataset.viewTarget)));
  document.getElementById("profile-chip").addEventListener("click", () => openProfileModal(false));
  document.getElementById("profile-close").addEventListener("click", closeProfileModal);
  document.getElementById("save-profile").addEventListener("click", submitProfile);
  document.getElementById("player-name-input").addEventListener("keydown", event => {
    if (event.key === "Enter") submitProfile();
  });
  document.getElementById("spin-button").addEventListener("click", spinWheel);
  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("active", item === button));
    renderTables();
  }));
  document.getElementById("action-fold").addEventListener("click", () => playerAction("fold"));
  document.getElementById("action-call").addEventListener("click", () => playerAction("call"));
  document.getElementById("action-raise").addEventListener("click", () => playerAction("raise"));
  document.getElementById("action-allin").addEventListener("click", () => playerAction("allin"));
  document.getElementById("next-hand").addEventListener("click", newHand);
  document.getElementById("leave-table").addEventListener("click", leaveTable);
  document.getElementById("raise-amount").addEventListener("input", event => {
    document.getElementById("raise-output").value = Number(event.target.value).toLocaleString("fr-FR");
  });
  let installPrompt = null;
  const installButton = document.getElementById("install-app");
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    installButton.classList.add("ready");
  });
  installButton.addEventListener("click", async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.classList.remove("ready");
      return;
    }
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    showToast(isIos ? "Dans Safari : Partager, puis Sur l’écran d’accueil." : "Ouvrez le menu du navigateur puis choisissez Installer l’application.");
  });
  window.addEventListener("appinstalled", () => showToast("Road of Poker est installé."));
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
  renderAll();
  registerWebMCP();
  if (!profile.name) openProfileModal(true);
  else document.getElementById("profile-modal").classList.add("hidden");
});
