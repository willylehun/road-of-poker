(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PokerEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const SUITS = [
    { id: "hearts", symbol: "♥", color: "red" },
    { id: "diamonds", symbol: "♦", color: "red" },
    { id: "clubs", symbol: "♣", color: "black" },
    { id: "spades", symbol: "♠", color: "black" }
  ];
  const RANKS = [
    { rank: "2", value: 2 }, { rank: "3", value: 3 },
    { rank: "4", value: 4 }, { rank: "5", value: 5 },
    { rank: "6", value: 6 }, { rank: "7", value: 7 },
    { rank: "8", value: 8 }, { rank: "9", value: 9 },
    { rank: "10", value: 10 }, { rank: "J", value: 11 },
    { rank: "Q", value: 12 }, { rank: "K", value: 13 },
    { rank: "A", value: 14 }
  ];
  const HAND_NAMES = [
    "Carte haute", "Paire", "Deux paires", "Brelan", "Quinte",
    "Couleur", "Full", "Carré", "Quinte flush"
  ];

  function secureRandom() {
    if (globalThis.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      globalThis.crypto.getRandomValues(value);
      return value[0] / 4294967296;
    }
    return Math.random();
  }

  function createDeck() {
    return SUITS.flatMap(suit => RANKS.map(rank => ({
      id: `${rank.rank}_${suit.id}`,
      rank: rank.rank,
      value: rank.value,
      suit: suit.id,
      symbol: suit.symbol,
      color: suit.color
    })));
  }

  function shuffle(cards, random = secureRandom) {
    const result = [...cards];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function compareScores(a, b) {
    const size = Math.max(a.length, b.length);
    for (let i = 0; i < size; i += 1) {
      const av = a[i] || 0;
      const bv = b[i] || 0;
      if (av > bv) return 1;
      if (av < bv) return -1;
    }
    return 0;
  }

  function combinations(cards, size) {
    const result = [];
    function visit(start, chosen) {
      if (chosen.length === size) {
        result.push(chosen);
        return;
      }
      for (let i = start; i <= cards.length - (size - chosen.length); i += 1) {
        visit(i + 1, [...chosen, cards[i]]);
      }
    }
    visit(0, []);
    return result;
  }

  function straightHigh(values) {
    const unique = [...new Set(values)].sort((a, b) => b - a);
    if (unique.includes(14)) unique.push(1);
    for (let i = 0; i <= unique.length - 5; i += 1) {
      if (
        unique[i] === unique[i + 1] + 1 &&
        unique[i + 1] === unique[i + 2] + 1 &&
        unique[i + 2] === unique[i + 3] + 1 &&
        unique[i + 3] === unique[i + 4] + 1
      ) return unique[i];
    }
    return 0;
  }

  function scoreFive(cards) {
    const values = cards.map(card => card.value).sort((a, b) => b - a);
    const counts = values.reduce((map, value) => {
      map.set(value, (map.get(value) || 0) + 1);
      return map;
    }, new Map());
    const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
    const flush = cards.every(card => card.suit === cards[0].suit);
    const straight = straightHigh(values);

    if (flush && straight) return [8, straight];
    if (groups[0][1] === 4) {
      const four = groups[0][0];
      return [7, four, values.find(value => value !== four)];
    }
    if (groups[0][1] === 3 && groups[1]?.[1] === 2) {
      return [6, groups[0][0], groups[1][0]];
    }
    if (flush) return [5, ...values];
    if (straight) return [4, straight];
    if (groups[0][1] === 3) {
      const trip = groups[0][0];
      return [3, trip, ...values.filter(value => value !== trip)];
    }
    const pairs = groups.filter(group => group[1] === 2).map(group => group[0]).sort((a, b) => b - a);
    if (pairs.length >= 2) {
      const kick = values.find(value => !pairs.slice(0, 2).includes(value));
      return [2, pairs[0], pairs[1], kick];
    }
    if (pairs.length === 1) {
      return [1, pairs[0], ...values.filter(value => value !== pairs[0])];
    }
    return [0, ...values];
  }

  function evaluateBest(cards) {
    if (cards.length < 5) return [0, ...cards.map(card => card.value).sort((a, b) => b - a)];
    return combinations(cards, 5).reduce((best, five) => {
      const score = scoreFive(five);
      return !best || compareScores(score, best) > 0 ? score : best;
    }, null);
  }

  function handName(score) {
    return HAND_NAMES[score?.[0] || 0] || "Main inconnue";
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function simulationRandom() {
    let state = Math.floor(secureRandom() * 4294967295) || 0x9e3779b9;
    return function random() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 4294967296;
    };
  }

  // Approximation Monte-Carlo de l'equite de la main face a des mains
  // adverses inconnues. Les egalites sont partagees entre les gagnants.
  function estimateEquity(holeCards, communityCards, opponentCount = 1, iterations = 100, random) {
    if (!Array.isArray(holeCards) || holeCards.length !== 2 || !Array.isArray(communityCards) || communityCards.length > 5) return 0;
    const knownCards = [...holeCards, ...communityCards];
    const knownIds = new Set(knownCards.map(card => card?.id));
    if (knownIds.has(undefined) || knownIds.size !== knownCards.length) return 0;

    const opponents = clamp(Math.floor(Number(opponentCount) || 1), 1, 8);
    const samples = clamp(Math.floor(Number(iterations) || 100), 20, 1000);
    const boardMissing = 5 - communityCards.length;
    const drawCount = boardMissing + opponents * 2;
    const available = createDeck().filter(card => !knownIds.has(card.id));
    if (drawCount > available.length) return 0;

    const nextRandom = typeof random === "function" ? random : simulationRandom();
    let equity = 0;
    for (let sample = 0; sample < samples; sample += 1) {
      const pool = [...available];
      for (let index = 0; index < drawCount; index += 1) {
        const swapIndex = index + Math.floor(nextRandom() * (pool.length - index));
        [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
      }

      const board = [...communityCards, ...pool.slice(0, boardMissing)];
      const heroScore = evaluateBest([...holeCards, ...board]);
      let tiedOpponents = 0;
      let beaten = false;
      for (let opponent = 0; opponent < opponents; opponent += 1) {
        const start = boardMissing + opponent * 2;
        const opponentScore = evaluateBest([...pool.slice(start, start + 2), ...board]);
        const comparison = compareScores(heroScore, opponentScore);
        if (comparison < 0) {
          beaten = true;
          break;
        }
        if (comparison === 0) tiedOpponents += 1;
      }
      if (!beaten) equity += 1 / (tiedOpponents + 1);
    }
    return equity / samples;
  }

  function estimateStrength(holeCards, communityCards) {
    const all = [...holeCards, ...communityCards];
    if (all.length >= 5) {
      const score = evaluateBest(all);
      return Math.min(10, score[0] + Math.max(0, (score[1] || 2) - 2) / 14);
    }
    if (holeCards.length < 2) return 0;
    const [a, b] = holeCards;
    let strength = 0;
    if (a.value === b.value) strength = 4.8 + a.value / 5;
    else {
      strength = (a.value + b.value) / 7;
      if (a.suit === b.suit) strength += 0.8;
      if (Math.abs(a.value - b.value) <= 2) strength += 0.6;
      if (Math.max(a.value, b.value) >= 13) strength += 0.8;
    }
    return Math.min(8, strength);
  }

  return {
    SUITS,
    RANKS,
    HAND_NAMES,
    createDeck,
    shuffle,
    compareScores,
    scoreFive,
    evaluateBest,
    handName,
    estimateStrength,
    estimateEquity
  };
});
