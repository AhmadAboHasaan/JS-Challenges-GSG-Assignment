const messageEl = document.getElementById("message-tag");
const cardsEl = document.getElementById("cards-tag");
const sumEl = document.getElementById("sum-tag");
const winsEl = document.getElementById("wins-tag");
const lossesEl = document.getElementById("losses-tag");

const startBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("newcard-btn");
const restartBtn = document.getElementById("restart-btn");

// ----------  متغيرات حالة اللعبة ----------
let cards = [];
let sum = 0;
let isAlive = false;
let hasBlackJack = false;

// ----------  عدادات الفوز/الخسارة (محفوظة بلوكل) ----------
let wins = Number(localStorage.getItem("bjWins")) || 0;
let losses = Number(localStorage.getItem("bjLosses")) || 0;
updateStatsUI();

// ----------  دوال اللعبة ----------
function getRandomCard() {
  const rand = Math.floor(Math.random() * 13) + 1; // 1 – 13
  if (rand === 1) return 11; // Ace
  if (rand > 10) return 10; // J, Q, K
  return rand; // 2 – 10
}

function saveStats() {
  localStorage.setItem("Wins", wins);
  localStorage.setItem("Losses", losses);
}

function updateStatsUI() {
  winsEl.textContent = `Wins: ${wins}`;
  lossesEl.textContent = `Losses: ${losses}`;
}

function renderGame() {
  cardsEl.textContent = `Cards: ${cards.join(" ") || "–"}`;
  sumEl.textContent = `Sum: ${sum}`;

  if (sum < 21) {
    messageEl.textContent = "Do you want to draw a new card?";
  } else if (sum === 21) {
    messageEl.textContent = "You've got Blackjack! 🎉";
    hasBlackJack = true;
    endRound(true);
  } else {
    messageEl.textContent = "You're out of the game 😢";
    isAlive = false;
    endRound(false);
  }
}

function endRound(playerWon) {
  // تحديث إحصائيات اللاعب
  if (playerWon) {
    wins++;
  } else {
    losses++;
  }

  saveStats();
  updateStatsUI();

  newCardBtn.disabled = true;
}

// ----------  التحكم بالأزرار ----------

function startGame() {
  // تهيئة متغيّرات الجولة

  isAlive = true;
  hasBlackJack = false;
  cards = [getRandomCard(), getRandomCard()];
  sum = cards[0] + cards[1];

  // تفعيل/تعطيل الأزرار

  startBtn.disabled = true;
  newCardBtn.disabled = false;
  restartBtn.disabled = false;

  renderGame();
}

function newCard() {
  if (!isAlive || hasBlackJack) return;

  const card = getRandomCard();
  cards.push(card);
  sum += card;
  renderGame();
}

function restartGame() {
  // إعادة ضبط حالة اللعبة دون مسح الإحصائيات
  cards = [];
  sum = 0;
  isAlive = false;
  hasBlackJack = false;

  // إعادة تفعيل زر البدء + تعطيل الآخرين
  startBtn.disabled = false;
  newCardBtn.disabled = true;
  restartBtn.disabled = true;

  // تحديث الواجهة
  cardsEl.textContent = "Cards: –";
  sumEl.textContent = "Sum: 0";
  messageEl.textContent = "Click START GAME to begin.";
}

// ----------  ربط الأحداث ----------
startBtn.addEventListener("click", startGame);
newCardBtn.addEventListener("click", newCard);
restartBtn.addEventListener("click", restartGame);
