// ------------------- Car Brands -------------------
const carBrands = ['bmw','audi','mercedes','ferrari','porsche','toyota','ford','tesla'];
let cards = [...carBrands, ...carBrands]; // duplicate for pairs
let firstCard, secondCard;
let lockBoard = false;
let moves = 0; // 🔹 Count player moves
let matches = 0; // 🔹 Count matches

// ------------------- DOM Elements -------------------
const board = document.querySelector('.game-board');
const resetBtn = document.getElementById('resetBtn');
const infoDiv = document.getElementById('infoDiv'); // your info container already in HTML

// ------------------- Shuffle & Create Board -------------------
function shuffle() {
  cards.sort(() => 0.5 - Math.random());
}

function createBoard() {
  shuffle();
  board.innerHTML = '';
  firstCard = secondCard = null;
  lockBoard = false;
  moves = 0;
  matches = 0;
  updateCounters();
  clearWinMessage();

  cards.forEach(brand => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="front"></div>
      <div class="back"><img src="images/${brand}.png" alt="${brand}"/></div>
    `;
    card.dataset.brand = brand;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

// ------------------- Card Flip -------------------
function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
  this.classList.add('flip');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++; // 🔹 Increment move counter
  updateCounters();
  checkMatch();
}

// ------------------- Check Match -------------------
function checkMatch() {
  if (firstCard.dataset.brand === secondCard.dataset.brand) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    disableCards();
    matches++; // 🔹 Increment match counter
    updateCounters();

    if (matches === carBrands.length) {
      saveLeaderboard();
      showWinMessage();
    }
  } else {
    unflipCards();
  }
}

// ------------------- Disable Matched Cards -------------------
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

// ------------------- Unflip Non-Matched Cards -------------------
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

// ------------------- Reset Board -------------------
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ------------------- Update Counters -------------------
function updateCounters() {
  document.getElementById('moveCounter').textContent = `Moves: ${moves}`;
  document.getElementById('matchCounter').textContent = `Matches: ${matches}`;
}

// ------------------- Save Leaderboard -------------------
function saveLeaderboard() {
  const username = localStorage.getItem("loggedInUser") || "Guest";
  const steps = moves;

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const existing = leaderboard.find(p => p.username === username);

  if (existing) {
    existing.steps = Math.min(existing.steps, steps); // keep best score
  } else {
    leaderboard.push({ username, steps });
  }

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// ------------------- Show Win Message -------------------
function showWinMessage() {
  const p = document.createElement('p');
  p.textContent = `🎉 You won in ${moves} moves!`;
  p.style.color = '#00ffea';
  p.style.fontWeight = 'bold';
  infoDiv.appendChild(p);
}

function clearWinMessage() {
  const messages = infoDiv.querySelectorAll('p');
  messages.forEach(m => m.remove());
}

// ------------------- Reset Button -------------------
resetBtn.addEventListener('click', createBoard);

// ------------------- Initialize Game -------------------
createBoard();



