let deckId = null;
let score1 = 0;
let score2 = 0;

// Hämta element
const card1 = document.querySelector('#card1');
const card2 = document.querySelector('#card2');
const scoreEl1 = document.querySelector('#score1');
const scoreEl2 = document.querySelector('#score2');
const winnerEl = document.querySelector('#winner');

const player1Btn = document.querySelector('#player1');
const player2Btn = document.querySelector('#player2');
const newGameBtn = document.querySelector('#newGame');

// Starta en ny kortlek
async function initDeck() {
  const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
  const data = await res.json();
  deckId = data.deck_id;

  // Nollställ poäng
  score1 = 0;
  score2 = 0;
  scoreEl1.textContent = score1;
  scoreEl2.textContent = score2;
  winnerEl.textContent = '';
  card1.src = '';
  card2.src = '';
}

initDeck();

// Dra ett kort för en spelare
async function drawCard(player) {
  const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
  const data = await res.json();

  if (data.cards.length === 0) {
    winnerEl.textContent = 'Kortleken är slut!';
    return;
  }

  const card = data.cards[0];
  const img = player === 1 ? card1 : card2;
  img.src = card.image;
  img.alt = card.code;
  img.dataset.value = card.value;

  checkRoundWinner();
}

// Omvandla kortvärde till nummer
function getValue(v) {
  const map = { JACK: 11, QUEEN: 12, KING: 13, ACE: 14 };
  return map[v] || Number(v);
}

// Kolla vem som vann rundan
function checkRoundWinner() {
  if (!card1.dataset.value || !card2.dataset.value) return;

  const v1 = getValue(card1.dataset.value);
  const v2 = getValue(card2.dataset.value);

  if (v1 > v2) {
    score1++;
    winnerEl.textContent = `Spelare 1 vann rundan!`;
  } else if (v2 > v1) {
    score2++;
    winnerEl.textContent = `Spelare 2 vann rundan!`;
  } else {
    winnerEl.textContent = `Oavgjort!`;
  }

  scoreEl1.textContent = score1;
  scoreEl2.textContent = score2;
}

// EventListeners
player1Btn.addEventListener('click', () => drawCard(1));
player2Btn.addEventListener('click', () => drawCard(2));
newGameBtn.addEventListener('click', initDeck);
