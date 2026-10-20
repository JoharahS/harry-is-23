
/*
  YOU'RE 23 — BIRTHDAY EDITION

  Customize this file:
  - Change the pride message in the HTML.
  - Change the racing difficulty in the ROAD TO 23 section below.
  - Change the surprise message and letter directly in index.html.
  - Add your own photos to the assets folder and update index.html.
*/

const $ = (id) => document.getElementById(id);

/* ===== NAVIGATION AND DISPLAY ===== */

$("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

$("menuToggle").addEventListener("click", () => {
  $("nav").classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach((link) => {
  link.addEventListener("click", () => {
    $("nav").classList.remove("open");
  });
});

/* ===== HIDDEN LETTER MESSAGE ===== */

$("letterSecret").addEventListener("click", () => {
  const secret = $("letterSecretText");

  secret.classList.toggle("hidden");

  $("letterSecret").textContent = secret.classList.contains("hidden")
    ? "one more thing..."
    : "hide my secret ♡";
});

/* ===== FINAL SURPRISE ===== */

$("surpriseButton").addEventListener("click", () => {
  $("surpriseMessage").classList.toggle("hidden");
});

/* =========================================================
   HOW PROUD AM I? — SLIDER AND CONFETTI CELEBRATION
   ========================================================= */

const prideSlider = $("prideSlider");
const prideValue = $("prideValue");
const prideHint = $("prideHint");
const prideSection = $("pride");
const prideCelebration = $("prideCelebration");
const confettiContainer = $("confettiContainer");

let prideCelebrated = false;
let confettiTimeouts = [];

const confettiColors = [
  "#315f58", // forest green
  "#91b8a6", // sage
  "#a9cbdc", // muted blue
  "#e1c889", // celebratory gold
  "#fffdf5"  // cream
];

function clearPrideConfetti() {
  confettiTimeouts.forEach((timeout) => clearTimeout(timeout));
  confettiTimeouts = [];
  confettiContainer.innerHTML = "";
}

function launchPrideConfetti() {
  clearPrideConfetti();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    return;
  }

  // A burst of 100 pieces in the birthday color palette.
  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = Math.random() * 100 + "%";

    piece.style.backgroundColor =
      confettiColors[
        Math.floor(Math.random() * confettiColors.length)
      ];

    piece.style.setProperty(
      "--fall-duration",
      (2.2 + Math.random() * 2.2) + "s"
    );

    piece.style.setProperty(
      "--fall-delay",
      (Math.random() * 1.2) + "s"
    );

    piece.style.setProperty(
      "--drift",
      (Math.random() * 180 - 90) + "px"
    );

    if (Math.random() > 0.5) {
      piece.style.width = "6px";
      piece.style.height = "18px";
    }

    confettiContainer.appendChild(piece);

    // Remove each piece after its animation finishes.
    const timeout = setTimeout(() => {
      piece.remove();
    }, 6000);

    confettiTimeouts.push(timeout);
  }
}

function celebratePride() {
  if (prideCelebrated) {
    return;
  }

  prideCelebrated = true;

  prideSection.classList.add("celebrating");
  prideCelebration.classList.remove("hidden");

  prideHint.textContent =
    "Plot twist: the slider ran out of room. I'm STILL proud of you. ✦";

  prideSlider.setAttribute(
    "aria-valuetext",
    "100 percent and beyond"
  );

  launchPrideConfetti();
}

function resetPrideCelebration() {
  prideCelebrated = false;

  prideSection.classList.remove("celebrating");
  prideCelebration.classList.add("hidden");

  clearPrideConfetti();
}

function updatePrideSlider() {
  const value = Number(prideSlider.value);

  prideValue.textContent = value;

  prideSlider.setAttribute(
    "aria-valuetext",
    value + " percent"
  );

  if (value === 100) {
    celebratePride();
    return;
  }

  // If he moves the slider back down, allow him to
  // reach 100 and celebrate again.
  if (prideCelebrated) {
    resetPrideCelebration();
  }

  if (value === 0) {
    prideHint.textContent =
      "Slide to find out. There's only one correct answer.";
  } else if (value < 25) {
    prideHint.textContent =
      "We're just getting started...";
  } else if (value < 50) {
    prideHint.textContent =
      "A pretty impressive year, I'd say. ✦";
  } else if (value < 75) {
    prideHint.textContent =
      "Look at everything you've accomplished.";
  } else {
    prideHint.textContent =
      "Keep going. You deserve the full 100.";
  }
}

prideSlider.addEventListener("input", updatePrideSlider);

// Replay the celebration without moving the slider again.
$("prideReplay").addEventListener("click", () => {
  launchPrideConfetti();
});

/* =========================================================
   ROAD TO 23 — ARCADE RACING GAME
   ========================================================= */

// Three lanes: left, middle, right.
const lanes = [22, 50, 78];

let raceFrame = null;
let raceTimer = null;
let raceActive = false;

let distance = 0;
let raceTime = 0;
let lane = 1;

let obstacles = [];
let lastSpawn = 0;
let lastTick = 0;
let nextObstacleId = 0;

// Game tuning.
const TARGET_CHECKPOINT = 23;
const DISTANCE_PER_MS = 0.0032;
const START_SPAWN_INTERVAL = 1000;
const MIN_SPAWN_INTERVAL = 430;

const OBSTACLE_TYPES = ["🚧", "🛢️", "🪨"];

/*
  Build the track once.

  The road, lane markers, car, and distance display remain in the DOM
  while the game runs. Only obstacle elements are added or removed.
*/

function buildRaceBoard() {
  const board = $("gameBoard");

  board.innerHTML = `
    <div class="race-skyline" aria-hidden="true">
      <span>✦</span>
      <span>☁</span>
    </div>

    <div class="road">
      <div class="lane-mark mark-one"></div>
      <div class="lane-mark mark-two"></div>
    </div>

    <div class="race-distance">
      <span>ROAD TO 23</span>
      <strong id="raceCheckpoint">CHECKPOINT 0 / 23</strong>
    </div>

    <div class="race-car" id="raceCar" aria-label="Your race car">
      🏎️
    </div>
  `;

  updateRaceDisplay();
}

function updateRaceDisplay() {
  const checkpoint = Math.min(
    TARGET_CHECKPOINT,
    Math.floor(distance)
  );

  $("gameScore").textContent = checkpoint;
  $("gameTime").textContent = raceTime;

  const checkpointLabel = $("raceCheckpoint");

  if (checkpointLabel) {
    checkpointLabel.textContent =
      `CHECKPOINT ${checkpoint} / ${TARGET_CHECKPOINT}`;
  }
}

function positionCar() {
  const car = $("raceCar");

  if (car) {
    car.style.left = lanes[lane] + "%";
  }
}

function moveCar(direction) {
  if (!raceActive) {
    return;
  }

  lane = Math.max(0, Math.min(2, lane + direction));

  positionCar();
}

/*
  Create an obstacle in a random lane.
  Its vertical position is measured as a percentage of the board.
*/

function spawnObstacle(timestamp) {
  const board = $("gameBoard");

  const obstacle = document.createElement("div");

  obstacle.className = "road-obstacle";
  obstacle.textContent =
    OBSTACLE_TYPES[
      Math.floor(Math.random() * OBSTACLE_TYPES.length)
    ];

  obstacle.setAttribute("aria-hidden", "true");

  const obstacleData = {
    id: nextObstacleId++,
    lane: Math.floor(Math.random() * 3),
    y: -8,
    element: obstacle
  };

  obstacle.style.left = lanes[obstacleData.lane] + "%";
  obstacle.style.top = obstacleData.y + "%";

  board.appendChild(obstacle);
  obstacles.push(obstacleData);

  lastSpawn = timestamp;
}

/*
  Difficulty increases gradually as the player advances.
  Obstacles spawn faster farther along the road.
*/

function getSpawnInterval() {
  return Math.max(
    MIN_SPAWN_INTERVAL,
    START_SPAWN_INTERVAL - distance * 20
  );
}

function getObstacleSpeed() {
  return 0.025 + distance * 0.0007;
}

/*
  Remove obstacles that have passed the player.
  The car is near the bottom of the track, around the 85% mark.
*/

function updateObstacles(deltaTime) {
  const speed = getObstacleSpeed();

  obstacles = obstacles.filter((obstacle) => {
    obstacle.y += deltaTime * speed;
    obstacle.element.style.top = obstacle.y + "%";

    if (obstacle.y > 105) {
      obstacle.element.remove();
      return false;
    }

    return true;
  });
}

/*
  A collision occurs when an obstacle enters the car's zone
  in the same lane.
*/

function checkCollision() {
  return obstacles.some((obstacle) => {
    return (
      obstacle.lane === lane &&
      obstacle.y > 76 &&
      obstacle.y < 94
    );
  });
}

function clearObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.element.remove();
  });

  obstacles = [];
}

/*
  End the current race and show the result overlay.
*/

function finishRace(won) {
  if (!raceActive) {
    return;
  }

  raceActive = false;

  if (raceFrame !== null) {
    cancelAnimationFrame(raceFrame);
    raceFrame = null;
  }

  if (raceTimer !== null) {
    clearInterval(raceTimer);
    raceTimer = null;
  }

  if (won) {
    distance = TARGET_CHECKPOINT;
    updateRaceDisplay();
  }

  $("gamePrize").classList.toggle("hidden", !won);

  $("gameMessage").textContent = won
    ? "you made it! checkpoint 23 reached. birthday legend status: confirmed. 🏆"
    : "CRASH! The road got you this time. Reset and take another run at 23.";

  const board = $("gameBoard");
  const overlay = document.createElement("div");

  overlay.className = "race-result";

  overlay.innerHTML = `
    <div class="result-card">
      <span>${won ? "🏆" : "🚧"}</span>
      <h3>${won ? "LEVEL 23 UNLOCKED" : "RUN ENDED"}</h3>
      <p>
        ${
          won
            ? "Another year. More roads to conquer."
            : "Every legend needs a rematch."
        }
      </p>
      <button class="button primary" id="restartRace">
        ${won ? "DRIVE AGAIN" : "RETRY RUN"}
      </button>
    </div>
  `;

  board.appendChild(overlay);

  $("restartRace").addEventListener("click", startRace);
}

/*
  Main animation loop.
  RequestAnimationFrame keeps movement smooth across browsers.
*/

function raceStep(timestamp) {
  if (!raceActive) {
    return;
  }

  const deltaTime = lastTick
    ? Math.min(40, timestamp - lastTick)
    : 0;

  lastTick = timestamp;

  // Progress toward checkpoint 23.
  distance += deltaTime * DISTANCE_PER_MS;

  // Spawn hazards at increasingly shorter intervals.
  if (timestamp - lastSpawn > getSpawnInterval()) {
    spawnObstacle(timestamp);
  }

  updateObstacles(deltaTime);
  updateRaceDisplay();

  // Check collisions before checking for a win.
  if (checkCollision()) {
    finishRace(false);
    return;
  }

  if (distance >= TARGET_CHECKPOINT) {
    finishRace(true);
    return;
  }

  raceFrame = requestAnimationFrame(raceStep);
}

/*
  Start or restart the game.
*/

function startRace() {
  // Stop any previous game loop before starting another.
  if (raceFrame !== null) {
    cancelAnimationFrame(raceFrame);
    raceFrame = null;
  }

  if (raceTimer !== null) {
    clearInterval(raceTimer);
    raceTimer = null;
  }

  raceActive = true;

  distance = 0;
  raceTime = 0;
  lane = 1;

  obstacles = [];
  lastSpawn = 0;
  lastTick = 0;

  $("gamePrize").classList.add("hidden");

  $("gameMessage").textContent =
    "Drive! Dodge the roadblocks and reach checkpoint 23.";

  buildRaceBoard();

  raceTimer = setInterval(() => {
    if (raceActive) {
      raceTime++;
      $("gameTime").textContent = raceTime;
    }
  }, 1000);

  raceFrame = requestAnimationFrame(raceStep);
}

/* ===== RACE CONTROLS ===== */

$("startGame").addEventListener("click", startRace);

$("steerLeft").addEventListener("click", () => {
  moveCar(-1);
});

$("steerRight").addEventListener("click", () => {
  moveCar(1);
});

document.addEventListener("keydown", (event) => {
  // Don't hijack keyboard controls while typing in a form field.
  const tag = event.target.tagName;

  if (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    event.target.isContentEditable
  ) {
    return;
  }

  if (["ArrowLeft", "a", "A"].includes(event.key)) {
    if (raceActive) {
      event.preventDefault();
      moveCar(-1);
    }
  }

  if (["ArrowRight", "d", "D"].includes(event.key)) {
    if (raceActive) {
      event.preventDefault();
      moveCar(1);
    }
  }
});
