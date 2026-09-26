const AVATAR_COUNT = 20;
const RANKING_AVATAR_COUNT = 100;
const STORAGE_KEY = "pokerByWProfile";
const GAME_STORAGE_KEY = "roadOfPokerSavedGame";
const PROFILE_VERSION = 3;
const GAME_VERSION = 1;
const PRIZES = [100, 250, 150, 400, 200, 125, 300, 175];
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallButtons();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateInstallButtons(true);
  if (document.getElementById("toast-region")) showToast("Road of Poker est installé.");
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
const PLAYER_NATIONS = [
  "🇫🇷|France", "🇪🇸|Espagne", "🇯🇵|Japon", "🇸🇳|Sénégal", "🇪🇸|Espagne", "🇺🇸|États-Unis", "🇮🇳|Inde", "🇮🇹|Italie", "🇨🇳|Chine", "🇦🇪|Émirats arabes unis", "🇧🇷|Brésil",
  "🇫🇷|France", "🇧🇷|Brésil", "🇺🇸|États-Unis", "🇸🇳|Sénégal", "🇯🇵|Japon", "🇦🇪|Émirats arabes unis", "🇧🇷|Brésil", "🇷🇺|Russie", "🇳🇬|Nigeria", "🇬🇧|Royaume-Uni", "🇲🇽|Mexique",
  "🇫🇷|France", "🇲🇦|Maroc", "🇯🇵|Japon", "🇮🇷|Iran", "🇧🇷|Brésil", "🇬🇧|Royaume-Uni", "🇮🇳|Inde", "🇺🇸|États-Unis", "🇮🇹|Italie", "🇸🇳|Sénégal", "🇰🇷|Corée du Sud",
  "🇪🇸|Espagne", "🇺🇸|États-Unis", "🇯🇵|Japon", "🇱🇧|Liban", "🇧🇷|Brésil", "🇫🇷|France", "🇮🇳|Inde", "🇸🇳|Sénégal", "🇬🇧|Royaume-Uni", "🇮🇹|Italie", "🇨🇳|Chine",
  "🇮🇱|Israël", "🇲🇽|Mexique", "🇱🇧|Liban", "🇬🇧|Royaume-Uni", "🇰🇷|Corée du Sud", "🇵🇹|Portugal", "🇫🇷|France", "🇮🇳|Inde", "🇺🇸|États-Unis", "🇮🇹|Italie", "🇨🇳|Chine",
  "🇪🇬|Égypte", "🇨🇴|Colombie", "🇩🇪|Allemagne", "🇯🇵|Japon", "🇪🇬|Égypte", "🇫🇷|France", "🇧🇷|Brésil", "🇬🇭|Ghana", "🇬🇧|Royaume-Uni", "🇮🇳|Inde", "🇮🇹|Italie",
  "🇨🇳|Chine", "🇫🇷|France", "🇸🇳|Sénégal", "🇷🇺|Russie", "🇦🇪|Émirats arabes unis", "🇧🇷|Brésil", "🇬🇧|Royaume-Uni", "🇯🇵|Japon", "🇮🇳|Inde", "🇫🇷|France", "🇧🇷|Brésil",
  "🇬🇭|Ghana", "🇯🇵|Japon", "🇮🇷|Iran", "🇩🇪|Allemagne", "🇪🇸|Espagne", "🇪🇬|Égypte", "🇩🇪|Allemagne", "🇫🇷|France", "🇨🇱|Chili", "🇯🇵|Japon", "🇵🇰|Pakistan",
  "🇬🇧|Royaume-Uni", "🇵🇹|Portugal", "🇳🇬|Nigeria", "🇷🇸|Serbie", "🇵🇰|Pakistan", "🇫🇷|France", "🇧🇷|Brésil", "🇰🇷|Corée du Sud", "🇱🇧|Liban", "🇸🇪|Suède", "🇪🇸|Espagne"
];
const FEMALE_FIRST_NAMES = new Set([
  "Amélie", "Hana", "Sofia", "Priya", "Mei", "Camila", "Valentina", "Aïcha", "Nora", "Elena", "Mia", "Chloé", "Leila", "Isla", "Zoe", "Fatou", "Lucía", "Aya", "Beatriz", "Ananya", "Freya", "Sarah", "Lina", "Yuna", "Inès", "Giulia", "Mariam", "Emma", "Salma", "Larissa", "Olivia", "Alessia", "Clara", "Amina", "Grace", "Neha", "Mariana", "Sakura", "Eva", "Nadia", "Céline", "Rina", "Natasha", "Mila", "Élodie", "Layla", "Ana"
]);
const FEMALE_AVATARS = [1,3,6,9,11,12,14,17,19,21,23,25,28,31,32,35,36,39,40,42,44,45,46,49,52,54,55,58,60,61,63,64,67,68,71,72,73,79,81,84,85,87,89,92,95,96,99];
const MALE_AVATARS = [0,2,4,5,7,8,10,13,15,16,18,20,22,24,26,27,29,30,33,34,37,38,41,43,47,48,50,51,53,56,57,59,62,65,66,69,70,74,75,76,77,78,80,82,83,86,88,90,91,93,94,97,98];
const PLAYER_STYLES = [
  { name: "Serré", fold: 0.17, aggression: -0.04, bluff: 0.02 },
  { name: "Prudent", fold: 0.10, aggression: -0.08, bluff: 0.03 },
  { name: "Équilibré", fold: 0, aggression: 0, bluff: 0.06 },
  { name: "Agressif", fold: -0.09, aggression: 0.15, bluff: 0.10 },
  { name: "Bluffeur", fold: -0.04, aggression: 0.08, bluff: 0.18 }
];
const STREET_LABELS = { preflop: "Pré-flop", flop: "Flop", turn: "Turn", river: "River" };

function buildRoster() {
  const used = new Set();
  return RANKING_NAMES.map((name, index) => {
    const female = FEMALE_FIRST_NAMES.has(name.split(" ")[0]);
    const preferred = female ? FEMALE_AVATARS : MALE_AVATARS;
    const start = (index * 7) % preferred.length;
    let avatar = Array.from({ length: preferred.length }, (_, offset) => preferred[(start + offset) % preferred.length]).find(candidate => !used.has(candidate));
    if (avatar === undefined) avatar = Array.from({ length: RANKING_AVATAR_COUNT }, (_, candidate) => candidate).find(candidate => !used.has(candidate));
    used.add(avatar);
    const [flag, country] = (PLAYER_NATIONS[index] || "🌍|International").split("|");
    return {
      name,
      avatar,
      flag,
      country,
      gender: female ? "F" : "M",
      style: PLAYER_STYLES[index % PLAYER_STYLES.length],
      gains: Math.max(750, Math.round(420000 * Math.pow((99 - index) / 99, 2.15))),
      wins: Math.max(0, Math.round(22 * Math.pow((99 - index) / 99, 1.45)))
    };
  });
}

const PLAYER_ROSTER = buildRoster();

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
    tournamentGains: 0,
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
    return {
      ...defaultProfile(),
      ...stored,
      version: PROFILE_VERSION,
      name: typeof stored.name === "string" ? stored.name : "",
      avatar: Number.isInteger(stored.avatar) ? stored.avatar : 0,
      tournamentGains: Number.isFinite(stored.tournamentGains) ? stored.tournamentGains : 0
    };
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

function isInstalledApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function installPlatform() {
  const agent = navigator.userAgent.toLowerCase();
  const ios = /iphone|ipad|ipod/.test(agent);
  const android = /android/.test(agent);
  const inApp = /fban|fbav|instagram|tiktok|line\//.test(agent);
  return { ios, android, inApp };
}

function updateInstallButtons(forceInstalled = false) {
  const installed = forceInstalled || isInstalledApp();
  document.querySelectorAll("[data-install-app]").forEach(button => {
    button.disabled = installed;
    button.classList.toggle("ready", Boolean(deferredInstallPrompt) && !installed);
    button.textContent = installed ? "Appli installée" : deferredInstallPrompt ? "Installer maintenant" : "Installer l’application";
  });
}

function openInstallGuide() {
  const { ios, android, inApp } = installPlatform();
  const intro = document.getElementById("install-intro");
  const steps = document.getElementById("install-steps");
  const note = document.getElementById("install-note");
  let instructions;

  if (ios) {
    instructions = [
      "Ouvrez cette page dans Safari.",
      "Touchez le bouton Partager en bas de l’écran.",
      "Choisissez « Sur l’écran d’accueil », puis « Ajouter »."
    ];
    intro.textContent = "Sur iPhone et iPad, l’installation se fait depuis le menu Partager.";
    note.textContent = inApp ? "Vous êtes dans un navigateur intégré : ouvrez d’abord la page dans Safari." : "L’icône Road of Poker apparaîtra ensuite parmi vos applications.";
  } else if (android) {
    instructions = [
      "Ouvrez cette page dans Chrome.",
      "Touchez le menu ⋮ en haut à droite.",
      "Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil »."
    ];
    intro.textContent = "Sur Android, Road of Poker peut s’installer depuis Chrome.";
    note.textContent = inApp ? "Vous êtes dans un navigateur intégré : ouvrez d’abord la page dans Chrome." : "Après confirmation, le jeu s’ouvrira en plein écran depuis votre accueil.";
  } else {
    instructions = [
      "Ouvrez la page dans Chrome ou Microsoft Edge.",
      "Cliquez sur l’icône d’installation dans la barre d’adresse.",
      "Confirmez avec « Installer »."
    ];
    intro.textContent = "Road of Poker s’installe aussi comme application sur ordinateur.";
    note.textContent = "Si l’icône n’apparaît pas, ouvrez le menu du navigateur puis choisissez « Installer Road of Poker ».";
  }

  steps.innerHTML = instructions.map(instruction => `<li>${instruction}</li>`).join("");
  document.getElementById("install-modal").classList.remove("hidden");
  document.getElementById("install-close").focus();
}

function closeInstallGuide() {
  document.getElementById("install-modal").classList.add("hidden");
}

async function requestAppInstall() {
  if (isInstalledApp()) {
    showToast("Road of Poker est déjà installé sur cet appareil.");
    return;
  }
  if (!deferredInstallPrompt) {
    openInstallGuide();
    return;
  }
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  updateInstallButtons(choice.outcome === "accepted");
  if (choice.outcome !== "accepted") openInstallGuide();
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
  const betterPlayers = PLAYER_ROSTER.filter(player => player.gains > profile.tournamentGains).length;
  return Math.min(100, betterPlayers + 1);
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
    "stat-gains": money.format(profile.tournamentGains),
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
    <div class="table-action">${unlocked ? "" : '<span class="unlock-requirement">Top 3 requis</span>'}<button class="join-btn ${unlocked && affordable ? "" : "locked"}" type="button" data-play-table="${index}" ${!unlocked || !affordable ? "disabled" : ""}>${buttonLabel}</button></div>
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
  const opponents = PLAYER_ROSTER.map(player => ({ ...player }));
  const players = [...opponents, {
    name: profile.name || "Vous",
    avatar: profile.avatar,
    wins: profile.wins,
    gains: profile.tournamentGains,
    flag: "♠",
    country: "Votre profil",
    current: true
  }].sort((a, b) => b.gains - a.gains || b.wins - a.wins || a.name.localeCompare(b.name, "fr"));
  const ranked = players.slice(0, 100).map((player, index) => ({ ...player, rank: index + 1 }));
  if (!ranked.some(player => player.current)) {
    ranked[99] = { ...players.find(player => player.current), rank: 100 };
  }
  profile.rank = ranked.find(player => player.current)?.rank || 100;
  return ranked;
}

function renderRanking() {
  const players = makeRanking();
  const podiumOrder = [players[1], players[0], players[2]];
  const classes = ["second", "first", "third"];
  document.getElementById("podium").innerHTML = podiumOrder.map((player, i) => `<article class="podium-card ${classes[i]}"><div class="podium-rank">${player.rank}</div><img src="${avatarPath(player.avatar)}" alt=""><strong>${player.name}</strong><small>${money.format(player.gains)}</small></article>`).join("");
  document.getElementById("ranking-list").innerHTML = players.map(player => `<div class="rank-row ${player.rank <= 6 ? "qualifier" : ""} ${player.current ? "current" : ""}"><span class="rank-number">${player.rank <= 6 ? "★ " : ""}${player.rank}</span><div class="rank-player"><img src="${avatarPath(player.avatar)}" alt=""><span>${player.flag || "🌍"} ${player.name}${player.current ? " (vous)" : ""}<small>${player.country || "International"}</small></span></div><span>${player.wins}</span><span>${money.format(player.gains)}</span></div>`).join("");
  document.getElementById("qualifiers").innerHTML = players.slice(0, 6).map((player, i) => `<div class="qualifier-seat seat-${i + 1}"><img src="${avatarPath(player.avatar)}" alt=""><strong>${player.name}</strong><small>#${player.rank}</small></div>`).join("");
  document.getElementById("qualification-note").innerHTML = profile.rank <= 6
    ? "<strong>Vous êtes qualifié.</strong> Votre siège est réservé pour la finale."
    : `Vous êtes actuellement <strong>#${profile.rank}</strong>. Atteignez le top 6 avant la fin de la saison pour rejoindre cette table.`;
  const challengers = players.slice(0, 6).filter(player => !player.current);
  const challenge = document.getElementById("worldcup-challenge");
  challenge.innerHTML = challengers.map(player => `<option value="${player.name}">${player.flag || "🌍"} #${player.rank} · ${player.name}</option>`).join("");
  const canPlayWorldCup = profile.rank <= 6 && profile.balance >= 10000;
  document.getElementById("start-worldcup").disabled = !canPlayWorldCup;
  document.getElementById("worldcup-action-note").textContent = profile.rank > 6
    ? "Atteignez le top 6 pour participer."
    : profile.balance < 10000
      ? "Qualification acquise, mais il faut 10 000 $ pour entrer."
      : "Votre siège est prêt. Toutes les places sont payées.";
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

function setGameOrientation(landscape) {
  document.body.classList.toggle("game-mode", landscape);
  try {
    if (window.AndroidApp && typeof window.AndroidApp.setLandscape === "function") {
      window.AndroidApp.setLandscape(landscape);
    }
    if (!screen.orientation) return;
    if (landscape && typeof screen.orientation.lock === "function") {
      void screen.orientation.lock("landscape").catch(() => {});
    } else if (!landscape && typeof screen.orientation.unlock === "function") {
      screen.orientation.unlock();
    }
  } catch (_error) {
    // L’interface reste utilisable si le navigateur refuse le verrouillage.
  }
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
  player.handContribution = (player.handContribution || 0) + paid;
  game.currentBet = Math.max(game.currentBet, player.currentBet);
  return paid;
}

function collectStreetBets() {
  if (!game) return 0;
  const collected = game.players.reduce((total, player) => total + player.currentBet, 0);
  if (collected <= 0) return 0;
  game.pot += collected;
  game.currentBet = 0;
  game.respondingToRaise = false;
  game.players.forEach(player => { player.currentBet = 0; });
  const pokerTable = document.querySelector(".poker-table");
  pokerTable.classList.remove("collecting-bets");
  void pokerTable.offsetWidth;
  pokerTable.classList.add("collecting-bets");
  window.setTimeout(() => pokerTable.classList.remove("collecting-bets"), 440);
  return collected;
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

function applyTableTheme(table) {
  document.getElementById("game-title").textContent = table.isWorldCup ? "Table Coupe du monde" : `Table de ${table.city}`;
  document.getElementById("game-tier").textContent = table.isWorldCup ? "Finale mondiale · 6 qualifiés" : `Niveau ${table.prestige} · ${table.tier}`;
  const pokerTable = document.querySelector(".poker-table");
  pokerTable.style.setProperty("--table-color", table.color);
  pokerTable.style.setProperty("--table-accent", table.accent);
  pokerTable.style.setProperty("--table-image", `url('assets/tables/${table.slug}.webp')`);
}

function rosterPlayer(entry, startingStack, rank) {
  return {
    name: entry.name,
    avatar: entry.avatar,
    flag: entry.flag,
    country: entry.country,
    style: entry.style,
    worldRank: rank,
    human: false,
    stack: startingStack,
    cards: [],
    folded: false,
    eliminated: false,
    currentBet: 0,
    handContribution: 0,
    finishPlace: null
  };
}

function createGame(table, tableIndex, opponents, options = {}) {
  const startingStack = table.big * 50;
  return {
    version: GAME_VERSION,
    table,
    tableIndex,
    isWorldCup: Boolean(options.isWorldCup),
    challengeName: options.challengeName || null,
    featuredName: options.featuredName || null,
    players: [{
      name: profile.name || "Vous",
      avatar: profile.avatar,
      flag: "♠",
      country: "Votre profil",
      style: PLAYER_STYLES[2],
      worldRank: profile.rank,
      human: true,
      stack: startingStack,
      cards: [],
      folded: false,
      eliminated: false,
      currentBet: 0,
      handContribution: 0,
      finishPlace: null
    }, ...opponents.map(({ entry, rank }) => rosterPlayer(entry, startingStack, rank))],
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
    nextFinishPlace: 6,
    log: [],
    finished: false
  };
}

function saveGameState() {
  if (!game || game.finished) return;
  localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(game));
  updateResumeButton();
}

function clearSavedGame() {
  localStorage.removeItem(GAME_STORAGE_KEY);
  updateResumeButton();
}

function getSavedGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAME_STORAGE_KEY));
    return saved?.version === GAME_VERSION && !saved.finished && Array.isArray(saved.players) ? saved : null;
  } catch {
    return null;
  }
}

function updateResumeButton() {
  const button = document.getElementById("resume-game");
  if (button) button.classList.toggle("hidden", !getSavedGame());
}

function resumeTournament() {
  const saved = getSavedGame();
  if (!saved) {
    showToast("Aucune partie à reprendre.");
    updateResumeButton();
    return;
  }
  game = saved;
  applyTableTheme(game.table);
  document.getElementById("game-log").innerHTML = "";
  switchView("game");
  setGameOrientation(true);
  if (game.handNumber === 0) {
    newHand();
    showToast("Partie reprise.");
    return;
  }
  renderGame();
  const log = document.getElementById("game-log");
  log.innerHTML = game.log.map(line => `<p>${line}</p>`).join("");
  document.getElementById("next-hand").classList.toggle("hidden", !game.handOver);
  showToast("Partie reprise.");
}

function startTournament(tableIndex) {
  if (game && !game.finished) {
    switchView("game");
    setGameOrientation(true);
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
  const featured = Math.random() < 0.2 ? PLAYER_ROSTER[Math.floor(Math.random() * 15)] : null;
  const pool = PLAYER_ROSTER.filter(entry => entry !== featured);
  const opponents = Array.from({ length: 5 }, (_, offset) => {
    const entry = offset === 0 && featured ? featured : pool[(tableIndex * 11 + offset * 13) % pool.length];
    return { entry, rank: PLAYER_ROSTER.indexOf(entry) + 1 };
  });
  game = createGame(table, tableIndex, opponents, { featuredName: featured?.name });
  applyTableTheme(table);
  switchView("game");
  setGameOrientation(true);
  saveGameState();
  if (featured) {
    document.getElementById("featured-player-avatar").src = avatarPath(featured.avatar);
    document.getElementById("featured-player-copy").innerHTML = `${featured.flag} <strong>#${PLAYER_ROSTER.indexOf(featured) + 1} ${featured.name}</strong>, style ${featured.style.name}, rejoint la table. Finissez devant ce joueur pour gagner un bonus de <strong>${money.format(table.buyIn * 2)}</strong>.`;
    document.getElementById("featured-player-modal").classList.remove("hidden");
  } else {
    newHand();
  }
}

function startWorldCup() {
  if (profile.rank > 6 || profile.balance < 10000 || game) return;
  const challengeName = document.getElementById("worldcup-challenge").value;
  const worldTable = { city: "Coupe du monde", code: "WPC", slug: "las-vegas", color: "#3c1765", accent: "#f3d58e", buyIn: 10000, small: 500, big: 1000, tier: "Finale mondiale", prestige: 16, isWorldCup: true };
  const qualifiers = makeRanking().filter(player => !player.current).slice(0, 5).map(player => ({
    entry: PLAYER_ROSTER.find(entry => entry.name === player.name),
    rank: player.rank
  })).filter(player => player.entry);
  if (qualifiers.length < 5) return;
  profile.balance -= worldTable.buyIn;
  profile.played += 1;
  saveProfile();
  game = createGame(worldTable, -1, qualifiers, { isWorldCup: true, challengeName });
  applyTableTheme(worldTable);
  switchView("game");
  setGameOrientation(true);
  saveGameState();
  newHand();
}

function newHand() {
  if (!game || game.finished) return;
  recordEliminations();
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
    player.handContribution = 0;
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
    if (!player.human && player.style) tags.push(`<span class="seat-status">${player.style.name}</span>`);
    const reveal = player.human || game.revealBots;
    const cards = player.cards.map(card => cardHTML(card, !reveal || player.folded)).join("");
    const wager = player.currentBet > 0
      ? `<div class="seat-wager" aria-label="${player.currentBet.toLocaleString("fr-FR")} jetons misés"><span class="chip-stack" aria-hidden="true"><i></i><i></i><i></i></span><strong>${player.currentBet.toLocaleString("fr-FR")}</strong></div>`
      : "";
    return `<div class="game-seat seat-${index} ${player.eliminated ? "eliminated" : ""} ${player.folded ? "folded" : ""} ${player.human && game.awaitingPlayer ? "current-turn" : ""}">
      ${wager}
      <div class="seat-cards">${cards}</div>
      <img class="seat-avatar" src="${avatarPath(player.avatar)}" alt="">
      <span class="seat-name">${player.human ? "Vous" : `${player.flag || "🌍"} ${player.name}`}${tags.join("")}</span>
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
  document.getElementById("action-allin").disabled = !canAct || human.stack <= toCall;

  const allCards = [...human.cards, ...game.community];
  document.getElementById("player-hand-name").textContent = allCards.length >= 5
    ? PokerEngine.handName(PokerEngine.evaluateBest(allCards))
    : "Vos cartes";
  document.getElementById("turn-message").textContent = game.handOver
    ? "Main terminée."
    : game.awaitingPlayer
      ? (toCall > 0 ? `À vous : ${toCall} jetons à suivre.` : "À vous : parole ou relance.")
      : "Les adversaires jouent…";
  if (game.awaitingPlayer || game.handOver) saveGameState();
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
    const style = bot.style || PLAYER_STYLES[2];
    const skill = 1 - Math.min(100, bot.worldRank || 100) / 100;

    if (toCall > 0) {
      const weakHandPenalty = strength < 3.2 ? 0.13 + skill * 0.12 : -skill * 0.08;
      const foldThreshold = Math.min(0.92, Math.max(0.04, 0.52 - strength * 0.07 + pressure * 0.72 + style.fold + weakHandPenalty));
      if (roll < foldThreshold) {
        bot.folded = true;
        addGameLog(`${bot.name} se couche.`);
      } else {
        const paid = takeBet(bot, toCall);
        addGameLog(paid < toCall ? `${bot.name} suit à tapis pour ${paid}.` : `${bot.name} suit ${paid}.`);
        const raiseChance = Math.max(0.04, 0.16 + style.aggression + skill * 0.16);
        const canReraise = allowReraise && !reraiseUsed && bot.stack > 0 && strength >= (5.9 - skill * 0.7) && Math.random() < raiseChance;
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
      const betChance = Math.min(0.72, 0.04 + strength * 0.055 + style.aggression + skill * 0.08);
      const bluff = strength < 2.3 && Math.random() < style.bluff;
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
  collectStreetBets();
  renderGame();
  await pause(320);
  if (game.street === "river") {
    showdown();
    return;
  }
  revealNextStreet();
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
  collectStreetBets();
  renderGame();
  while (game.community.length < 5) {
    await pause(260);
    revealNextStreet();
    renderGame();
  }
  showdown();
}

function showdown() {
  const contenders = activeInHand();
  if (!contenders.length) return;
  collectStreetBets();
  game.revealBots = true;
  const scores = new Map();
  contenders.forEach(player => {
    const score = PokerEngine.evaluateBest([...player.cards, ...game.community]);
    scores.set(player, score);
    addGameLog(`${player.human ? "Vous" : player.name} : ${PokerEngine.handName(score)}.`);
  });
  const levels = [...new Set(game.players.map(player => player.handContribution || 0).filter(Boolean))].sort((a, b) => a - b);
  let previousLevel = 0;
  levels.forEach((level, potIndex) => {
    const contributors = game.players.filter(player => (player.handContribution || 0) >= level);
    const potAmount = (level - previousLevel) * contributors.length;
    const eligible = contributors.filter(player => scores.has(player));
    const candidates = eligible.length ? eligible : contenders;
    let best = null;
    let winners = [];
    candidates.forEach(player => {
      const score = scores.get(player);
      const comparison = best ? PokerEngine.compareScores(score, best) : 1;
      if (comparison > 0) {
        best = score;
        winners = [player];
      } else if (comparison === 0) {
        winners.push(player);
      }
    });
    const share = Math.floor(potAmount / winners.length);
    let remainder = potAmount - share * winners.length;
    winners.forEach(winner => {
      winner.stack += share + (remainder > 0 ? 1 : 0);
      remainder = Math.max(0, remainder - 1);
    });
    const potName = potIndex === 0 ? "pot principal" : `pot secondaire ${potIndex}`;
    addGameLog(`${winners.map(player => player.human ? "Vous" : player.name).join(" et ")} gagne${winners.length > 1 ? "nt" : ""} le ${potName} de ${potAmount} jetons avec ${PokerEngine.handName(best)}.`);
    previousLevel = level;
  });
  game.pot = 0;
  finishHand();
}

function awardUncontestedPot() {
  collectStreetBets();
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
  recordEliminations();
  renderGame();
  if (checkTournamentEnd()) return;
  document.getElementById("next-hand").classList.remove("hidden");
}

function recordEliminations() {
  if (!game) return;
  game.players.filter(player => player.stack <= 0 && !player.eliminated).forEach(player => {
    player.eliminated = true;
    player.finishPlace = game.nextFinishPlace;
    game.nextFinishPlace = Math.max(2, game.nextFinishPlace - 1);
  });
}

function checkTournamentEnd() {
  if (!game || game.finished) return true;
  const human = game.players[0];
  const alive = remainingTournamentPlayers();
  if (human.stack <= 0 || human.eliminated) {
    const place = human.finishPlace || alive.filter(player => !player.human).length + 1;
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
  const multipliers = game.isWorldCup
    ? { 1: 40, 2: 24, 3: 15, 4: 10, 5: 7, 6: 4 }
    : { 1: 3.2, 2: 1.8, 3: 1.2 };
  const payout = Math.floor(game.table.buyIn * (multipliers[place] || 0));
  const targetName = game.isWorldCup ? game.challengeName : game.featuredName;
  const target = game.players.find(player => player.name === targetName);
  const challengeWon = Boolean(target?.finishPlace && place < target.finishPlace);
  const challengeBonus = challengeWon ? game.table.buyIn * 2 : 0;
  if (payout > 0) {
    profile.balance += payout;
    profile.gains += payout;
    profile.tournamentGains += payout;
  }
  if (challengeBonus > 0) {
    profile.balance += challengeBonus;
    profile.gains += challengeBonus;
    profile.tournamentGains += challengeBonus;
  }
  if (place === 1) profile.wins += 1;
  if (place <= 3) profile.podiums += 1;
  if (!game.isWorldCup && place <= 3) {
    if (game.tableIndex === profile.unlockedTable && profile.unlockedTable < TABLES.length - 1) {
      profile.unlockedTable += 1;
    }
  }
  if (game.isWorldCup && place === 1) profile.champion += 1;
  profile.rank = calculateRank();
  saveProfile();
  clearSavedGame();

  const unlocked = !game.isWorldCup && place <= 3 && game.tableIndex < TABLES.length - 1
    ? `<p>La table de <strong>${TABLES[game.tableIndex + 1].city}</strong> est maintenant déverrouillée.</p>`
    : "";
  const overlay = document.createElement("div");
  overlay.className = "result-overlay";
  overlay.innerHTML = `<div class="result-card">
    <span class="eyebrow">${game.isWorldCup ? "Coupe du monde" : `Tournoi de ${game.table.city}`}</span>
    <div class="result-place">${place}<sup>${place === 1 ? "er" : "e"}</sup></div>
    <h2>${place <= 3 ? "Vous montez sur le podium !" : "Tournoi terminé"}</h2>
    <p>${payout > 0 ? `Gain : <strong>${money.format(payout)}</strong>` : "Aucun gain cette fois."}</p>
    ${challengeBonus ? `<p>Défi remporté contre <strong>${targetName}</strong> : bonus de <strong>${money.format(challengeBonus)}</strong>.</p>` : ""}
    ${unlocked}
    <button class="primary-btn" id="result-continue" type="button">Retour aux tables</button>
  </div>`;
  document.body.append(overlay);
  document.getElementById("result-continue").addEventListener("click", () => {
    overlay.remove();
    game = null;
    renderAll();
    setGameOrientation(false);
    switchView("tables");
  });
}

function leaveTable() {
  if (!game) {
    setGameOrientation(false);
    switchView("tables");
    return;
  }
  game.finished = true;
  game = null;
  clearSavedGame();
  renderAll();
  setGameOrientation(false);
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
  document.getElementById("resume-game").addEventListener("click", resumeTournament);
  document.getElementById("start-worldcup").addEventListener("click", startWorldCup);
  document.getElementById("featured-player-start").addEventListener("click", () => {
    document.getElementById("featured-player-modal").classList.add("hidden");
    if (game && game.handNumber === 0) newHand();
  });
  document.getElementById("raise-amount").addEventListener("input", event => {
    document.getElementById("raise-output").value = Number(event.target.value).toLocaleString("fr-FR");
  });
  document.querySelectorAll("[data-install-app]").forEach(button => button.addEventListener("click", requestAppInstall));
  document.getElementById("install-close").addEventListener("click", closeInstallGuide);
  document.getElementById("install-done").addEventListener("click", closeInstallGuide);
  document.getElementById("install-modal").addEventListener("click", event => {
    if (event.target.id === "install-modal") closeInstallGuide();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeInstallGuide();
  });
  updateInstallButtons();
  updateResumeButton();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
  renderAll();
  registerWebMCP();
  window.setTimeout(() => {
    if (!profile.name) openProfileModal(true);
    else document.getElementById("profile-modal").classList.add("hidden");
    document.body.classList.add("app-ready");
    document.body.classList.remove("is-loading");
  }, 650);
});
