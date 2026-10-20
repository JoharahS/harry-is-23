/*
  CUSTOMIZE THIS FILE FIRST!
  - Change the hero subtitle, quiz answers, memories, and song links below.
  - For real photos, place files in assets/ and replace the photo-placeholder
    divs in index.html with: <img src="assets/your-photo.jpg" alt="description">
  - Keep filenames simple (example: first-date.jpg).
*/
const CONFIG = {
  birthdayDate: "", // Optional: date for a birthday countdown if you add one later
  quiz: [
    { question: "What is the correct way to celebrate level 23?", options: ["Good food, good people, good chaos", "Doing absolutely nothing fun", "Filing taxes for entertainment", "Going to bed at 7 p.m."], answer: 0, correct: "correct. elite birthday strategy. ✦" },
    { question: "What is your most important birthday buff?", options: ["+23 wisdom points", "Unlimited snacks", "Main-character energy", "All of the above"], answer: 3, correct: "correct! all stats boosted for level 23. 🏆" },
    { question: "What should the year ahead include?", options: ["New adventures", "Big laughs", "Wins worth celebrating", "All of the above, obviously"], answer: 3, correct: "exactly. manifesting an absolutely legendary year. ✨" },
    { question: "Who is the birthday VIP today?", options: ["A random guy", "The birthday legend reading this", "A traffic cone", "The cake"], answer: 1, correct: "that's you, birthday legend. take your bow. 🏁" }
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

// ROAD TO 23: simple keyboard/touch racing game, no libraries required.
let raceTimer = null, raceFrame = null, raceActive = false;
let raceTime = 0, distance = 0, lane = 1, obstacles = [], lastSpawn = 0, lastTick = 0;
const lanes = [0.22, 0.5, 0.78];
function drawRace() {
  const board = $("gameBoard");
  board.innerHTML = '<div class="race-skyline"><span>✦</span><span>☁</span><span>✦</span></div><div class="road"><div class="lane-mark mark-one"></div><div class="lane-mark mark-two"></div><div class="lane-mark mark-three"></div></div><div class="race-distance"><span>ROAD TO 23</span><strong>CHECKPOINT ' + Math.min(23, Math.floor(distance)) + ' / 23</strong></div><div class="race-car" id="raceCar" style="left:' + (lanes[lane]*100) + '%">🏎️</div>';
  obstacles.forEach(o => {
    const el = document.createElement('div'); el.className = 'road-obstacle'; el.textContent = o.type;
    el.style.left = (lanes[o.lane]*100) + '%'; el.style.top = o.y + '%'; board.appendChild(el);
  });
}
function moveCar(dir) {
  if (!raceActive) return;
  lane = Math.max(0, Math.min(2, lane + dir));
  const car = $("raceCar"); if (car) car.style.left = (lanes[lane]*100) + '%';
}
function finishRace(won) {
  raceActive = false; cancelAnimationFrame(raceFrame); clearInterval(raceTimer);
  $("gamePrize").classList.toggle("hidden", !won);
  $("gameMessage").textContent = won ? "you made it! checkpoint 23 reached. birthday legend status: confirmed. 🏆" : "CRASH! The road got you this time. Reset and take another run at 23.";
  const board = $("gameBoard");
  const overlay = document.createElement('div'); overlay.className = 'race-result';
  overlay.innerHTML = '<div class="result-card"><span>' + (won ? '🏆' : '🚧') + '</span><h3>' + (won ? 'LEVEL 23 UNLOCKED' : 'RUN ENDED') + '</h3><p>' + (won ? 'Another year. More roads to conquer.' : 'Every legend needs a rematch.') + '</p><button class="button primary" id="startGame">' + (won ? 'DRIVE AGAIN' : 'RETRY RUN') + '</button></div>';
  board.appendChild(overlay); $("startGame").addEventListener("click", startRace);
}
function raceStep(timestamp) {
  if (!raceActive) return;
  const dt = Math.min(40, timestamp - (lastTick || timestamp)); lastTick = timestamp;
  // Travel steadily toward checkpoint 23; hazards increase with progress.
  distance += dt * 0.0032;
  if (timestamp - lastSpawn > Math.max(430, 1000 - distance * 20)) {
    obstacles.push({ lane: Math.floor(Math.random()*3), y: -10, type: ["🚧", "🛢️", "🪨"][Math.floor(Math.random()*3)] }); lastSpawn = timestamp;
  }
  obstacles.forEach(o => o.y += dt * (0.025 + distance * 0.0007));
  obstacles = obstacles.filter(o => o.y < 110);
  const hit = obstacles.some(o => o.lane === lane && o.y > 76 && o.y < 94);
  $("gameScore").textContent = Math.min(23, Math.floor(distance));
  drawRace();
  if (hit) { finishRace(false); return; }
  if (distance >= 23) { finishRace(true); return; }
  raceFrame = requestAnimationFrame(raceStep);
}
function startRace() {
  cancelAnimationFrame(raceFrame); clearInterval(raceTimer);
  raceActive = true; raceTime = 0; distance = 0; lane = 1; obstacles = []; lastSpawn = 0; lastTick = 0;
  $("gameScore").textContent = "0"; $("gameTime").textContent = "0"; $("gamePrize").classList.add("hidden");
  $("gameMessage").textContent = "Drive! Dodge the roadblocks and reach checkpoint 23.";
  drawRace();
  raceTimer = setInterval(() => { if (raceActive) { raceTime++; $("gameTime").textContent = raceTime; } }, 1000);
  raceFrame = requestAnimationFrame(raceStep);
}
$("startGame").addEventListener("click", startRace);
$("steerLeft").addEventListener("click", () => moveCar(-1));
$("steerRight").addEventListener("click", () => moveCar(1));
document.addEventListener("keydown", event => {
  if (["ArrowLeft", "a", "A"].includes(event.key)) { event.preventDefault(); moveCar(-1); }
  if (["ArrowRight", "d", "D"].includes(event.key)) { event.preventDefault(); moveCar(1); }
});
