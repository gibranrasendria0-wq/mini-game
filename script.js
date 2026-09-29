const choices = ["rock", "paper", "scissors"];

const emoji = {
  rock: "✊",
  paper: "🖐️",
  scissors: "✌️"
};

const levelNames = {
  easy: "EASY",
  normal: "NORMAL",
  hard: "HARD"
};

let difficulty = "easy";
let playerScore = 0;
let computerScore = 0;
let round = 1;
const maxRounds = 5;
let gameFinished = false;

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const roundTextEl = document.getElementById("roundText");
const playerChoiceEl = document.getElementById("playerChoice");
const computerChoiceEl = document.getElementById("computerChoice");
const resultEl = document.getElementById("result");
const levelLabelEl = document.getElementById("levelLabel");

const choiceButtons = document.querySelectorAll(".choice-btn");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const resetBtn = document.getElementById("resetBtn");

const modal = document.getElementById("gameOverModal");
const finalTitle = document.getElementById("finalTitle");
const finalScore = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");

function randomChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getCounterChoice(playerChoice) {
  const counters = {
    rock: "paper",
    paper: "scissors",
    scissors: "rock"
  };

  return counters[playerChoice];
}

function getComputerChoice(playerChoice) {
  if (difficulty === "easy") {
    return randomChoice();
  }

  if (difficulty === "normal") {
    return Math.random() < 0.4
      ? getCounterChoice(playerChoice)
      : randomChoice();
  }

  return Math.random() < 0.7
    ? getCounterChoice(playerChoice)
    : randomChoice();
}

function getWinner(player, computer) {
  if (player === computer) return "draw";

  const playerWins =
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper");

  return playerWins ? "player" : "computer";
}

function playRound(playerChoice) {
  if (gameFinished) return;

  const computerChoice = getComputerChoice(playerChoice);
  const winner = getWinner(playerChoice, computerChoice);

  playerChoiceEl.textContent = emoji[playerChoice];
  computerChoiceEl.textContent = emoji[computerChoice];

  if (winner === "player") {
    playerScore++;
    resultEl.textContent = "◆ YOU WIN THIS ROUND ◆";
  } else if (winner === "computer") {
    computerScore++;
    resultEl.textContent = "◆ CPU WINS THIS ROUND ◆";
  } else {
    resultEl.textContent = "◆ ROUND DRAW ◆";
  }

  updateScore();

  if (round >= maxRounds) {
    finishGame();
    return;
  }

  round++;
  roundTextEl.textContent = `${round} / ${maxRounds}`;
}

function updateScore() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function finishGame() {
  gameFinished = true;

  if (playerScore > computerScore) {
    finalTitle.textContent = "YOU WIN";
  } else if (playerScore < computerScore) {
    finalTitle.textContent = "YOU LOSE";
  } else {
    finalTitle.textContent = "DRAW";
  }

  finalScore.textContent = `${playerScore} - ${computerScore}`;
  modal.classList.remove("hidden");

  choiceButtons.forEach((button) => {
    button.disabled = true;
  });
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  round = 1;
  gameFinished = false;

  playerChoiceEl.textContent = "?";
  computerChoiceEl.textContent = "?";
  resultEl.textContent = "CHOOSE YOUR WEAPON";
  roundTextEl.textContent = `${round} / ${maxRounds}`;

  updateScore();

  choiceButtons.forEach((button) => {
    button.disabled = false;
  });

  modal.classList.add("hidden");
}

function setDifficulty(level) {
  difficulty = level;

  difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.level === level);
  });

  levelLabelEl.textContent = `MODE: ${levelNames[level]} // BEST OF 5`;

  resetGame();
}

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.choice);
  });
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.level);
  });
});

resetBtn.addEventListener("click", resetGame);

playAgainBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  const keyMap = {
    r: "rock",
    p: "paper",
    s: "scissors"
  };

  const choice = keyMap[event.key.toLowerCase()];

  if (choice && !gameFinished) {
    playRound(choice);
  }
});

updateScore();
