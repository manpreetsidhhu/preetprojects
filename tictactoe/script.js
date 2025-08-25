const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const resetButton = document.getElementById("reset");
let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
var a = Math.random();
var b;
if (a > 0.5) {
  b = "O";
} else {
  b = "X";
}
let currentPlayer = b;
document.getElementById("cursor-follower").innerText = currentPlayer;
let gameActive = true;
function createBoard() {
  boardElement.innerHTML = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", cellClick);
      boardElement.appendChild(cell);
    }
  }
}
function cellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;
  if (board[row][col] || !gameActive) return;
  board[row][col] = currentPlayer;
  event.target.innerText = currentPlayer;
  checkWin();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("cursor-follower").innerText = currentPlayer;
  updateMessage();
}
function checkWin() {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      highlightWinningCells([
        [i, 0],
        [i, 1],
        [i, 2],
      ]);
      declareWinner(board[i][0]);
      return;
    }
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      highlightWinningCells([
        [0, i],
        [1, i],
        [2, i],
      ]);
      declareWinner(board[0][i]);
      return;
    }
  }
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    highlightWinningCells([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
    declareWinner(board[0][0]);
    return;
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    highlightWinningCells([
      [0, 2],
      [1, 1],
      [2, 0],
    ]);
    declareWinner(board[0][2]);
    return;
  }

  if (board.flat().every((cell) => cell)) {
    messageElement.innerText = "It's a Draw!";
    gameActive = false;
  }
}
function highlightWinningCells(cells) {
  cells.forEach(([row, col]) => {
    const cell = document.querySelector(
      `.cell[data-row='${row}'][data-col='${col}']`
    );
    cell.classList.add("winning-cell");
  });
}

function declareWinner(winner) {
  messageElement.innerHTML = `<span class="winner-message">${winner} Wins!</span>`;
  gameActive = false;
}
function updateMessage() {
  if (gameActive) {
    messageElement.innerText = `${currentPlayer}'s Turn`;
  }
}
resetButton.addEventListener("click", resetGame);
function resetGame() {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  var a = Math.random();
  var b;
  if (a > 0.5) {
    b = "O";
  } else {
    b = "X";
  }
  currentPlayer = b;
  gameActive = true;
  createBoard();
  updateMessage();
}
createBoard();
updateMessage();
document.addEventListener("mousemove", (e) => {
  const cursorFollower = document.getElementById("cursor-follower");
  cursorFollower.style.left = e.clientX + "px";
  cursorFollower.style.top = e.clientY + "px";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((err) => console.error("Service Worker Registration Failed", err));
  });
}
window.addEventListener("load", () => {
  const splash = document.getElementById("custom-splash");

  // Simulate splash screen for 3 seconds
  setTimeout(() => {
    splash.style.display = "none";
  }, 1500); // Duration in milliseconds
});
setTimeout(() => {
  splash.classList.add("hide");
}, 1500);
