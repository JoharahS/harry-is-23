/*
  CUSTOMIZE THIS FILE FIRST!
  - Change the hero subtitle, quiz answers, memories, and song links below.
  - For real photos, place files in assets/ and replace the photo-placeholder
    divs in index.html with: <img src="assets/your-photo.jpg" alt="description">
  - Keep filenames simple (example: first-date.jpg).
*/
const CONFIG = {
  relationshipStartDate: "", // Optional: "2024-06-14" to show days since you started dating
  quiz: [
    { question: "What is my favorite kind of day with you?", options: ["A cozy day doing absolutely nothing", "A huge fancy event", "A day where we don't talk", "A 5 a.m. tax seminar"], answer: 0, correct: "correct! honestly, any day with you wins. ♡" },
    { question: "What do I want more of with you?", options: ["More memories and little adventures", "More arguments about nothing", "More boring spreadsheets", "To never take pictures"], answer: 0, correct: "yes!! more adventures, please. 💗" },
    { question: "What is your official title?", options: ["Just some guy", "My favorite human", "Assistant to the regional manager", "Professional sock thief"], answer: 1, correct: "that's right. promotion approved. ♡" },
    { question: "What happens when you finish this quiz?", options: ["You get a gold star", "You get reminded you're loved", "Both of the above", "Trick question: all three"], answer: 2, correct: "correct. your prize is me being very fond of you. ✨" }
  ]
};

const $ = (id) => document.getElementById(id);
$("themeToggle").addEventListener("click", () => document.body.classList.toggle("dark-mode"));
$("menuToggle").addEventListener("click", () => $("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => $("nav").classList.remove("open")));
$("letterSecret").addEventListener("click", () => {
  $("letterSecretText").classList.toggle("hidden");
  $("letterSecret").textContent = $("letterSecretText").classList.contains("hidden") ? "one more thing..." : "hide my secret ♡";
});
$("surpriseButton").addEventListener("click", () => $("surpriseMessage").classList.toggle("hidden"));

if (CONFIG.relationshipStartDate) {
  const start = new Date(CONFIG.relationshipStartDate + "T00:00:00");
  const days = Math.max(0, Math.floor((new Date() - start) / 86400000));
  $("daysCount").textContent = days.toLocaleString();
}

// Quiz
let quizIndex = 0, quizScore = 0, answered = false;
function renderQuestion() {
  const q = CONFIG.quiz[quizIndex];
  $("quizQuestion").textContent = q.question;
  $("quizProgress").textContent = `question ${quizIndex + 1} of ${CONFIG.quiz.length}`;
  $("quizScore").textContent = `${"♥ ".repeat(quizScore)}${"♡ ".repeat(CONFIG.quiz.length - quizScore)}`.trim();
  $("quizFeedback").textContent = "choose your answer, cutie.";
  $("nextQuestion").disabled = true;
  $("nextQuestion").textContent = quizIndex === CONFIG.quiz.length - 1 ? "see my score ♡" : "next question →";
  $("quizOptions").innerHTML = "";
  answered = false;
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const correct = index === q.answer;
      if (correct) quizScore++;
      [...$("quizOptions").children].forEach((el, i) => {
        el.disabled = true;
        if (i === q.answer) el.classList.add("correct");
        else if (i === index) el.classList.add("wrong");
      });
      $("quizFeedback").textContent = correct ? q.correct : "not quite, but you still get a kiss. try the highlighted answer next time ♡";
      $("quizScore").textContent = `${"♥ ".repeat(quizScore)}${"♡ ".repeat(CONFIG.quiz.length - quizScore)}`.trim();
      $("nextQuestion").disabled = false;
    });
    $("quizOptions").appendChild(button);
  });
}
$("nextQuestion").addEventListener("click", () => {
  if (quizIndex < CONFIG.quiz.length - 1) { quizIndex++; renderQuestion(); }
  else {
    $("quizQuestion").textContent = `you got ${quizScore} out of ${CONFIG.quiz.length}!`;
    $("quizOptions").innerHTML = "";
    $("quizFeedback").textContent = quizScore === CONFIG.quiz.length ? "perfect score! you know us so well. here's your virtual trophy: 🏆" : "your final grade: certified cutie. please collect your hug. ♡";
    $("nextQuestion").textContent = "play again ↻";
    $("nextQuestion").disabled = false;
    $("nextQuestion").onclick = () => { quizIndex = 0; quizScore = 0; $("nextQuestion").onclick = null; renderQuestion(); };
  }
});
renderQuestion();

// Catch-the-hearts mini-game. No external assets or libraries needed.
let gameInterval = null, spawnInterval = null, gameScore = 0, gameTime = 20, gameActive = false;
function endGame() {
  gameActive = false; clearInterval(gameInterval); clearInterval(spawnInterval);
  $("gameBoard").querySelectorAll(".catch-heart").forEach(el => el.remove());
  $("gameMessage").textContent = gameScore >= 10 ? "heart collector extraordinaire. 💗" : "the hearts were shy, but you can try again!";
  $("gamePrize").classList.toggle("hidden", gameScore < 10);
  const start = document.createElement("div"); start.className = "game-start";
  start.innerHTML = '<span>♡</span><p>you caught ' + gameScore + ' hearts!</p><button class="button primary" id="startGame">play again</button>';
  $("gameBoard").appendChild(start);
  $("startGame").addEventListener("click", startGame);
}
function spawnHeart() {
  if (!gameActive) return;
  const board = $("gameBoard");
  const heart = document.createElement("button");
  heart.className = "catch-heart"; heart.textContent = ["♡", "💗", "💖", "💕"][Math.floor(Math.random()*4)];
  heart.setAttribute("aria-label", "catch heart");
  heart.style.left = Math.random() * (board.clientWidth - 50) + "px";
  heart.style.top = (Math.random() * (board.clientHeight - 60) + 10) + "px";
  heart.addEventListener("click", () => {
    if (!gameActive) return;
    gameScore++; $("gameScore").textContent = gameScore; heart.remove();
    $("gameMessage").textContent = gameScore >= 10 ? "you unlocked the love note — keep going! ♡" : "yay! one more little heart collected.";
    if (gameScore >= 10) $("gamePrize").classList.remove("hidden");
  });
  board.appendChild(heart);
  setTimeout(() => heart.remove(), 1500);
}
function startGame() {
  clearInterval(gameInterval); clearInterval(spawnInterval);
  gameScore = 0; gameTime = 20; gameActive = true;
  $("gameScore").textContent = "0"; $("gameTime").textContent = gameTime; $("gamePrize").classList.add("hidden");
  $("gameBoard").innerHTML = "";
  $("gameMessage").textContent = "go go go! catch those hearts 💗";
  spawnHeart(); spawnInterval = setInterval(spawnHeart, 650);
  gameInterval = setInterval(() => {
    gameTime--; $("gameTime").textContent = gameTime;
    if (gameTime <= 0) endGame();
  }, 1000);
}
$("startGame").addEventListener("click", startGame);
