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

console.log("Tests du moteur de poker réussis.");
