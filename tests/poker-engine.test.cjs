const assert = require("node:assert/strict");
const poker = require("../dist/poker-engine.js");

const deck = poker.createDeck();
assert.equal(deck.length, 52);
assert.equal(new Set(deck.map(card => card.id)).size, 52);

const card = id => {
  const found = deck.find(item => item.id === id);
  assert.ok(found, `Carte inconnue : ${id}`);
  return found;
};
const hand = (...ids) => ids.map(card);

assert.deepEqual(poker.scoreFive(hand("A_hearts", "K_hearts", "Q_hearts", "J_hearts", "10_hearts")), [8, 14]);
assert.deepEqual(poker.scoreFive(hand("9_hearts", "9_diamonds", "9_clubs", "9_spades", "A_hearts")), [7, 9, 14]);
assert.deepEqual(poker.scoreFive(hand("K_hearts", "K_diamonds", "K_clubs", "2_spades", "2_hearts")), [6, 13, 2]);
assert.deepEqual(poker.scoreFive(hand("A_clubs", "5_hearts", "4_diamonds", "3_spades", "2_hearts")), [4, 5]);

const best = poker.evaluateBest(hand("A_hearts", "K_hearts", "Q_hearts", "J_hearts", "10_hearts", "2_clubs", "3_diamonds"));
assert.equal(poker.handName(best), "Quinte flush");
assert.equal(poker.compareScores([2, 14, 10, 9], [2, 13, 12, 11]), 1);

const shuffled = poker.shuffle(deck, () => 0.25);
assert.equal(shuffled.length, 52);
assert.deepEqual([...shuffled.map(item => item.id)].sort(), [...deck.map(item => item.id)].sort());

const seededRandom = seed => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const acesEquity = poker.estimateEquity(hand("A_hearts", "A_spades"), [], 1, 1600, seededRandom(11));
const sevenTwoEquity = poker.estimateEquity(hand("7_clubs", "2_diamonds"), [], 1, 1600, seededRandom(29));
assert.ok(acesEquity > 0.78 && acesEquity < 0.92, `Équité AA inattendue : ${acesEquity}`);
assert.ok(sevenTwoEquity > 0.25 && sevenTwoEquity < 0.45, `Équité 7-2 inattendue : ${sevenTwoEquity}`);
assert.ok(acesEquity - sevenTwoEquity > 0.38, "Le moteur doit nettement distinguer une main premium d'une main faible");

const unbeatableEquity = poker.estimateEquity(
  hand("A_hearts", "K_hearts"),
  hand("Q_hearts", "J_hearts", "10_hearts", "2_clubs", "3_diamonds"),
  5,
  80,
  seededRandom(41)
);
assert.equal(unbeatableEquity, 1, "Une quinte flush royale doit conserver 100 % d'équité");
assert.equal(poker.estimateEquity(hand("A_hearts", "A_hearts"), [], 1, 80, seededRandom(7)), 0, "Les cartes dupliquées doivent être refusées");

console.log("Tests du moteur de poker réussis.");
