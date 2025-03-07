const cow = document.getElementById("cow");
const clickDisplay = document.getElementById("clicks");
const timerDisplay = document.getElementById("timer");
const leaderboard = document.getElementById("leaderboard");
const startButton = document.getElementById("startButton");
const clearLeaderboardButton = document.getElementById("clearLeaderboard");
const playerNameInput = document.getElementById("playerName");

let clicks = 0;
let timeLeft = 15;
let gameActive = false;
let interval;

function startGame() {
  let playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name before playing.");
    return;
  }

  gameActive = true;
  clicks = 0;
  timeLeft = 15;
  clickDisplay.innerText = clicks;
  timerDisplay.innerText = `Time Left: ${timeLeft}s`;

  cow.style.pointerEvents = "auto";
  cow.style.opacity = "1";
  startButton.disabled = true;

  interval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      gameActive = false;
      cow.style.pointerEvents = "none";
      cow.style.opacity = "0.5";
      startButton.innerText = "Reset";
      startButton.disabled = false;
      saveScore(playerName, clicks);
    }
  }, 1000);
}

cow.addEventListener("click", () => {
  if (!gameActive) return;

  let moo = new Audio("cow.mp3");
  moo.play();
  clicks++;
  clickDisplay.innerText = clicks;
});

startButton.addEventListener("click", () => {
  if (!gameActive) startGame();
});

clearLeaderboardButton.addEventListener("click", () => {
  localStorage.removeItem("scores");
  updateLeaderboard([]);
});

function saveScore(playerName, score) {
  let speed = 15.0;
  let rate = score / speed;
  let date = new Date().toLocaleString();

  let scoreData = {
    name: playerName,
    score: score,
    speed: speed.toFixed(2),
    rate: rate.toFixed(2),
    date: date,
  };

  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push(scoreData);
  scores.sort((a, b) => b.rate - a.rate || b.score - a.score);
  scores = scores.slice(0, 10);
  localStorage.setItem("scores", JSON.stringify(scores));
  updateLeaderboard(scores);
}

function updateLeaderboard(scores) {
  leaderboard.innerHTML = `<tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Score</th>
        <th>Speed</th>
        <th>Rate</th>
        <th>Date</th>
    </tr>`;

  for (let i = 0; i < 10; i++) {
    let row = leaderboard.insertRow();
    if (scores[i]) {
      row.innerHTML = `<td>${i + 1}</td>
                             <td>${scores[i].name}</td>
                             <td>${scores[i].score}</td>
                             <td>${scores[i].speed}</td>
                             <td>${scores[i].rate}</td>
                             <td>${scores[i].date}</td>`;
    } else {
      row.innerHTML = `<td>${i + 1}</td>
                             <td>-</td>
                             <td>-</td>
                             <td>-</td>
                             <td>-</td>
                             <td>-</td>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let savedScores = JSON.parse(localStorage.getItem("scores")) || [];
  updateLeaderboard(savedScores);
});
