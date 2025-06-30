// ===== FINDE DIESE ZEILEN IN DEINEM CODE: =====
let coinSound; 
let gameOverSound;
let soundsLoaded = false;

// ===== FÜGE DIREKT DARUNTER HINZU: =====
// Neue Hintergrundmusik-Variablen
let menuMusic;
let easyGameMusic;
let mediumGameMusic;
let hardGameMusic;
let currentMusic = null;

// Sound-Einstellungen
let musicVolume = 0.5; // 0.0 bis 1.0
let soundEffectsVolume = 0.7;
let musicEnabled = true;
let soundEffectsEnabled = true;

// Einstellungsmenü-Variablen
let settingsOpen = false;
let selectedSettingsItem = 0;
let settingsItems = [
  { name: "Musik Lautstärke", type: "slider", value: "musicVolume", min: 0, max: 1, step: 0.1 },
  { name: "Sound Effekte", type: "slider", value: "soundEffectsVolume", min: 0, max: 1, step: 0.1 },
  { name: "Musik An/Aus", type: "toggle", value: "musicEnabled" },
  { name: "Sounds An/Aus", type: "toggle", value: "soundEffectsEnabled" },
  { name: "Zurück", type: "button" }
];

// Rand-Variable
let borderWidth = 20;  // Ca. 1/2 cm Randbreite

// Münz-Animation
let coinRotation = 0;

// Schwierigkeitsstufen
let gameDifficulty = "easy"; // "easy", "medium", "hard"
let walls = []; // Array für Labyrinth-Wände

// Spieler-Variablen
let playerX = 100;
let playerY = 100;
let playerSpeed = 5;
let playerAlive = true;

// Gegner-Variablen
let enemyX = 300;
let enemyY = 200;
let enemySpeed = 2;
let enemyBaseSpeed = 2;

// Sammelobjekt-Variablen
let collectibleX;
let collectibleY;

// Labyrinth-Variablen
let mazeSize = 40; // Größe der Labyrinth-Zellen
let maze = []; // 2D Array für das Labyrinth
let mazeWidth, mazeHeight;

// Partikel-System für Münzeffekt
let particles = [];

// Punktestand
let score = 0;
let highScore = 0;

// Zeitmessung
let lastSpeedIncrease = 0;
let minuteInMillis = 60000;
let speedIncreasePercentage = 0.1;
let difficultyLevel = 1;

// Spielstatus
let gameStarted = false;
let difficultySelected = false;

// Hindernis-Variablen
let obstacles = []; // Array für alle Hindernisse
let obstacleCount = 0; // Anzahl der Hindernisse je nach Schwierigkeit

// Shop-System Variablen
let coins = 0; // Gesammelte Münzen für den Shop
let shopOpen = false;
let selectedShopCategory = "player"; // "player", "enemy", "background"
let selectedShopItem = 0;

// Gekaufte Items
let ownedPlayerSkins = [0]; // Index 0 ist immer freigeschaltet (Standard)
let ownedEnemySkins = [0];
let ownedBackgrounds = [0];

// Aktuelle Auswahl
let currentPlayerSkin = 0;
let currentEnemySkin = 0;
let currentBackground = 0;

// Shop-Items Definitionen
let playerSkins = [
  {name: "Standard Blau", price: 0, color: [0, 0, 255]},
  {name: "Feuer Rot", price: 50, color: [255, 100, 0]},
  {name: "Neon Grün", price: 75, color: [0, 255, 100]},
  {name: "Royal Lila", price: 100, color: [150, 0, 255]},
  {name: "Gold Glanz", price: 150, color: [255, 215, 0]},
  {name: "Cyber Pink", price: 200, color: [255, 20, 147]}
];

let enemySkins = [
  {name: "Standard Rot", price: 0, color: [255, 0, 0]},
  {name: "Schatten Schwarz", price: 60, color: [50, 50, 50]},
  {name: "Gift Grün", price: 80, color: [100, 255, 100]},
  {name: "Eis Blau", price: 120, color: [100, 200, 255]},
  {name: "Magma Orange", price: 180, color: [255, 140, 0]},
  {name: "Void Violett", price: 250, color: [100, 0, 150]}
];

let backgrounds = [
  {name: "Standard Schwarz", price: 0, color: [0, 0, 0]},
  {name: "Mitternacht Blau", price: 40, color: [25, 25, 112]},
  {name: "Wald Grün", price: 70, color: [34, 139, 34]},
  {name: "Sonnenuntergang", price: 110, color: [139, 69, 19]},
  {name: "Ozean Türkis", price: 160, color: [64, 224, 208]},
  {name: "Galaxis Lila", price: 220, color: [75, 0, 130]}
];

// Pausen-Variable
let gamePaused = false;

// ===== ERSETZE DEINE KOMPLETTE PRELOAD() FUNKTION MIT: =====
function preload() {
  try {
    // Sound-Effekte laden
    coinSound = loadSound('coin.mp3', soundLoaded, soundError);
    gameOverSound = loadSound('gameover.mp3', soundLoaded, soundError);
    
    // Hintergrundmusik laden (du musst diese Dateien erstellen/hinzufügen)
    menuMusic = loadSound('menu_music.mp3', soundLoaded, soundError);
    easyGameMusic = loadSound('easy_game_music.mp3', soundLoaded, soundError);
    mediumGameMusic = loadSound('medium_game_music.mp3', soundLoaded, soundError);
    hardGameMusic = loadSound('hard_game_music.mp3', soundLoaded, soundError);
    
  } catch (e) {
    console.error("Fehler beim Laden der Sounds:", e);
    soundsLoaded = true;
  }
}

// Wird aufgerufen, wenn ein Sound erfolgreich geladen wurde
function soundLoaded() {
  console.log("Sound erfolgreich geladen");
  soundsLoaded = true;
}

// Wird aufgerufen, wenn beim Laden eines Sounds ein Fehler auftritt
function soundError(err) {
  console.error("Fehler beim Laden eines Sounds:", err);
  soundsLoaded = true; // Trotzdem fortfahren
}

function setup() {
  // Erstelle ein Spielfeld mit der Größe des Fensters
  createCanvas(windowWidth, windowHeight);
  
  // Wenn die Sounds nach 3 Sekunden nicht geladen sind, trotzdem fortfahren
  setTimeout(function() {
    soundsLoaded = true;
  }, 3000);
}

// ====== 1. ERWEITERTE DRAW() FUNKTION ======

// ===== ERSETZE DEINE KOMPLETTE draw() FUNKTION MIT DIESER: =====

function draw() {
  // Prüfen, ob die Sounds geladen wurden oder das Timeout erreicht wurde
  if (!soundsLoaded) {
    // Ladebildschirm anzeigen
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Lade Spiel...", width/2, height/2);
    return;
  }
  
  // DEBUG: Zeige was los ist
  console.log("DEBUG: difficultySelected=" + difficultySelected + ", gameStarted=" + gameStarted + ", playerAlive=" + playerAlive);
  
  // VORERST OHNE MUSIK-SYSTEM:
 try {
  handleMusicInDraw();
} catch(e) {
  console.log("Musik-Fehler ignoriert:", e);
}
  
  // Hintergrund mit ausgewähltem Skin zeichnen
  let bgColor = backgrounds[currentBackground].color;
  background(bgColor[0], bgColor[1], bgColor[2]);
  
  // Spielfeldbegrenzung zeichnen
  drawGameBorder();
  
  if (settingsOpen) {
  displaySettings();
  return;
}

  
  if (!difficultySelected) {
    // Schwierigkeitsauswahl anzeigen
    displayDifficultySelection();
    if (shopOpen) {
      displayShop();
    }
    return;
  }
  
  if (!gameStarted) {
    // Startbildschirm anzeigen
    displayStartScreen();
    if (shopOpen) {
      displayShop();
    }
    return;
  }
  
  if (!playerAlive) {
    // Game Over Bildschirm anzeigen
    displayGameOver();
    if (shopOpen) {
      displayShop();
    }
    return;
  }

  // Prüfen, ob das Spiel pausiert ist
  if (gamePaused) {
    displayPauseScreen();
    return;
  }

  // Hindernisse zeichnen (nur bei Medium und Hard)
  if (gameDifficulty === "medium" || gameDifficulty === "hard") {
    drawObstacles();
  }
  
  // Prüfen, ob eine Minute vergangen ist
  checkSpeedIncrease();
  
  // Spieler mit ausgewähltem Skin zeichnen
  let playerColor = playerSkins[currentPlayerSkin].color;
  fill(playerColor[0], playerColor[1], playerColor[2]);
  circle(playerX, playerY, 30);

  // Gegner mit ausgewähltem Skin zeichnen
  let enemyColor = enemySkins[currentEnemySkin].color;
  fill(enemyColor[0], enemyColor[1], enemyColor[2]);
  circle(enemyX, enemyY, 40);
  
  // Sammelobjekt (rotierende Münze) zeichnen
  if (!gamePaused) {
    coinRotation += 0.05; // Rotationsgeschwindigkeit nur wenn nicht pausiert
  }
  drawRotatingCoin(collectibleX, collectibleY, 24, coinRotation);
  
  // Partikeleffekte zeichnen
  updateAndDrawParticles();
  
  // Bewegung mit Pfeiltasten
  let newPlayerX = playerX;
  let newPlayerY = playerY;
  
  if (keyIsDown(LEFT_ARROW)) {
    newPlayerX -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    newPlayerX += playerSpeed;
  }
  if (keyIsDown(UP_ARROW)) {
    newPlayerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    newPlayerY += playerSpeed;
  }
  
  // Kollision mit Wänden prüfen (nur bei Medium und Hard)
  if (gameDifficulty === "medium" || gameDifficulty === "hard") {
    if (!checkWallCollision(newPlayerX, newPlayerY, 15)) {
      playerX = newPlayerX;
      playerY = newPlayerY;
    }
  } else {
    playerX = newPlayerX;
    playerY = newPlayerY;
  }
  
  // Spieler im Spielfeld halten (mit Rand)
  playerX = constrain(playerX, borderWidth, width - borderWidth);
  playerY = constrain(playerY, borderWidth, height - borderWidth);
  
  // Einfache Gegner-KI: folgt dem Spieler (Gegner kann durch Wände)
  if (enemyX < playerX) enemyX += enemySpeed;
  if (enemyX > playerX) enemyX -= enemySpeed;
  if (enemyY < playerY) enemyY += enemySpeed;
  if (enemyY > playerY) enemyY -= enemySpeed;
  
  // Gegner im Spielfeld halten (mit Rand)
  enemyX = constrain(enemyX, borderWidth, width - borderWidth);
  enemyY = constrain(enemyY, borderWidth, height - borderWidth);
  
  // Kollision mit Sammelobjekt prüfen
  let d = dist(playerX, playerY, collectibleX, collectibleY);
  if (d < 25) {
    playCoinSound();

    
    // Partikeleffekt erzeugen
    createCoinParticles(collectibleX, collectibleY);
    
    score++;
    coins++; // Füge Münzen für den Shop hinzu
    // Sammelobjekt an zufällige Position teleportieren (nicht in Wänden)
    spawnNewCoin();
  }
  
  // Kollision mit Gegner prüfen
  let playerEnemyDist = dist(playerX, playerY, enemyX, enemyY);
  if (playerEnemyDist < 35) {
    // Spieler ist tot
    playerAlive = false;
    
    // ALTE Sound-Aufrufe (ohne neues System):
    try {
      if (gameOverSound && gameOverSound.isLoaded()) {
        gameOverSound.play();
      }
    } catch (e) {
      console.error("Fehler beim Abspielen des Game Over Sounds:", e);
    }
    
    // Highscore aktualisieren
    if (score > highScore) {
      highScore = score;
    }
  }
  
  // Punktestand, Münzen und Schwierigkeitsstufe anzeigen
  fill(255);
  textSize(24);
  text("Münzen: " + coins, 65 + borderWidth, 30 + borderWidth);
  text("Schwierigkeit: " + gameDifficulty.toUpperCase() + " (Level " + difficultyLevel + ")", 165 + borderWidth, 60 + borderWidth);

  // Zeit bis zur nächsten Geschwindigkeitserhöhung anzeigen
  let timeLeft = minuteInMillis - (millis() - lastSpeedIncrease);
  let secondsLeft = floor(timeLeft / 1000);
  text("Nächste Erhöhung in: " + secondsLeft + " Sekunden", 195 + borderWidth, 90 + borderWidth);
}
// ====== 2. ERWEITERTE KEYPRESSED() FUNKTION ======

function keyPressed() {
  console.log("Taste gedrückt: " + key + " | Spielstatus: gameStarted=" + gameStarted + ", playerAlive=" + playerAlive + ", shopOpen=" + shopOpen);
  
function keyPressed() {
  // ===== FÜGE DIESE ZEILEN GANZ AM ANFANG HINZU: =====
  if (handleSettingsInKeyPressed()) {
    return;
  }
  
  // ... dein bestehender Code bleibt komplett gleich ...
}

  // NEU: Einstellungsmenü-Steuerung hat höchste Priorität
  if (handleSettingsInKeyPressed()) {
    return;
  }
  
  // Pausensteuerung (hat höchste Priorität nach Einstellungen)
  if (gameStarted && playerAlive && !shopOpen) {
    if (key === 'p' || key === 'P') {
      gamePaused = !gamePaused; // Pause umschalten
      console.log("Spiel " + (gamePaused ? "pausiert" : "fortgesetzt"));
      return;
    }
  }

  // Steuerung im Pausenmenü
  if (gamePaused) {
    if (key === 'p' || key === 'P') {
      gamePaused = false;
      console.log("Spiel fortgesetzt");
    } else if (keyCode === ESCAPE) {
      // Zurück zum Hauptmenü
      gamePaused = false;
      gameStarted = false;
      difficultySelected = false;
      playerAlive = true;
      console.log("Zurück zum Hauptmenü");
    }
    return;
  }

  // Shop-Steuerung
  if (shopOpen) {
    if (keyCode === LEFT_ARROW) {
      navigateShop("left");
    } else if (keyCode === RIGHT_ARROW) {
      navigateShop("right");
    } else if (keyCode === UP_ARROW) {
      navigateShop("up");
    } else if (keyCode === DOWN_ARROW) {
      navigateShop("down");
    } else if (keyCode === ENTER) {
      buyOrSelectItem();
    } else if (keyCode === ESCAPE) {
      shopOpen = false;
    }
    return;
  }
  
  // Shop öffnen (überall außer im Spiel)
  if (key === 's' || key === 'S') {
    if (!gameStarted || !playerAlive) {
      shopOpen = true;
      console.log("Shop geöffnet");
      return;
    } else {
      console.log("Shop kann nicht im Spiel geöffnet werden");
    }
  }
  
  // Rest der Steuerung nur wenn Shop geschlossen ist
  if (!shopOpen) {
    // Schwierigkeitsauswahl
    if (!difficultySelected) {
      if (key === '1') {
        gameDifficulty = "easy";
        difficultySelected = true;
      } else if (key === '2') {
        gameDifficulty = "medium";
        difficultySelected = true;
      } else if (key === '3') {
        gameDifficulty = "hard";
        difficultySelected = true;
      }
    }
    // Spiel starten vom Startbildschirm
    else if (difficultySelected && !gameStarted) {
      if (key === ' ') { // Nur Leertaste startet das Spiel
        gameStarted = true;
        resetGame();
      }
    }
    // Game Over
    else if (!playerAlive && gameStarted) {
      if (key === ' ') {
        resetGame();
      } else if (keyCode === ESCAPE) {
        difficultySelected = false;
        gameStarted = false;
        playerAlive = true;
      }
    }
  }
}

// ====== 3. ERWEITERTE DISPLAYSTARTSCREEN() FUNKTION ======

function displayStartScreen() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Drücke LEERTASTE zum Starten", width/2, height/2 - 50);
  textSize(18);
  text("Bewege dich mit den Pfeiltasten und sammle goldene Münzen", width/2, height/2);
  text("Vermeide den roten Kreis, er wird jede Minute schneller!", width/2, height/2 + 30);
  text("Schwierigkeit: " + gameDifficulty.toUpperCase(), width/2, height/2 + 60);
  text("Pausiere das Spiel mit Taste P", width/2, height/2 + 90); 
  
  if (gameDifficulty === "medium" || gameDifficulty === "hard") {
    text("Der rote Gegner kann durch Wände, du nicht!", width/2, height/2 + 120);
  }
  
  // NEU: Shop und Einstellungen-Hinweise
  textSize(20);
  fill(255, 255, 0); // Gelbe Farbe für Aufmerksamkeit
  text("'S' für SHOP | 'E' für EINSTELLUNGEN (Münzen: " + coins + ")", width/2, height/2 + 160);
}

// ====== 4. ERWEITERTE SCHWIERIGKEITSAUSWAHL ======

function displayDifficultySelection() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Wähle deine Herausforderung", width/2, height/2 - 100);
  
  textSize(24);
  text("1 - EASY: Normales Spiel", width/2, height/2 - 30);
  text("2 - MEDIUM: Einfaches Labyrinth", width/2, height/2 + 10);
  text("3 - HARD: Schweres Labyrinth + schnellerer Gegner", width/2, height/2 + 50);
  
  textSize(18);
  text("Drücke 1, 2 oder 3 auf der Tastatur", width/2, height/2 + 100);
  
  // NEU: Einstellungen-Hinweis hinzufügen
  textSize(16);
  fill(255, 255, 0);
  text("Drücke 'E' für EINSTELLUNGEN (Musik & Sounds)", width/2, height/2 + 140);
}

// ====== 5. ERWEITERTE GAME OVER ANZEIGE ======

function displayGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("GAME OVER", width/2, height/2 - 50);
  textSize(24);
  text("Dein Punktestand: " + score, width/2, height/2 + 20);
  text("Highscore: " + highScore, width/2, height/2 + 60);
  textSize(18);
  text("Drücke LEERTASTE für ein neues Spiel", width/2, height/2 + 120);
  text("Drücke ESC für neue Schwierigkeitsauswahl", width/2, height/2 + 150);
  
  // NEU: Shop und Einstellungen-Hinweise
  textSize(20);
  fill(255, 255, 0); // Gelbe Farbe
  text("'S' für SHOP | 'E' für EINSTELLUNGEN (Münzen: " + coins + ")", width/2, height/2 + 180);
}

// Zeigt den Pausenbildschirm an
function displayPauseScreen() {
  // Halbtransparenter Overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Pausentext
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("PAUSE", width/2, height/2 - 50);
  
  textSize(24);
  text("Drücke 'P' zum Fortsetzen", width/2, height/2 + 20);
  text("Drücke 'ESC' für Hauptmenü", width/2, height/2 + 60);
  
  // Aktuelle Statistiken anzeigen
  textSize(18);
  text("Punkte: " + score, width/2, height/2 + 120);
  text("Münzen: " + coins, width/2, height/2 + 150);
}

// Zeigt die Schwierigkeitsauswahl an
function displayDifficultySelection() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Wähle deine Herausforderung", width/2, height/2 - 100);
  
  textSize(24);
  text("1 - EASY: Normales Spiel", width/2, height/2 - 30);
  text("2 - MEDIUM: Einfaches Labyrinth", width/2, height/2 + 10);
  text("3 - HARD: Schweres Labyrinth + schnellerer Gegner", width/2, height/2 + 50);
  
  textSize(18);
  text("Drücke 1, 2 oder 3 auf der Tastatur", width/2, height/2 + 100);
}

// Erstellt Hindernisse je nach Schwierigkeitsstufe
function createMaze() {
  createObstacles();
}

// Zeichnet das Labyrinth
function drawMaze() {
  fill(120, 120, 120);  // Graue Wände
  noStroke();
  
  for (let wall of walls) {
    rect(wall.x, wall.y, wall.w, wall.h);
  }
}

// Prüft Kollision mit Hindernissen
function checkWallCollision(x, y, radius) {
  for (let obstacle of obstacles) {
    if (checkObstacleCollision(x, y, radius, obstacle)) {
      return true;
    }
  }
  return false;
}

// Überprüft Kollision mit einem spezifischen Hindernis
function checkObstacleCollision(x, y, radius, obstacle) {
  // Transformiere Spielerposition relativ zum Hindernis
  let dx = x - obstacle.x;
  let dy = y - obstacle.y;
  
  // Rotiere den Punkt um das Hindernis
  let cos_r = cos(-obstacle.rotation);
  let sin_r = sin(-obstacle.rotation);
  let rotatedX = dx * cos_r - dy * sin_r;
  let rotatedY = dx * sin_r + dy * cos_r;
  
  switch(obstacle.type) {
    case 'rectangle':
      return checkRectangleCollision(rotatedX, rotatedY, radius, 
                                   obstacle.width, obstacle.height);
    case 'circle':
      return dist(0, 0, rotatedX, rotatedY) < (radius + obstacle.radius);
    case 'triangle':
      return checkTriangleCollision(rotatedX, rotatedY, radius, obstacle.size);
    case 'L-shape':
      return checkLShapeCollision(rotatedX, rotatedY, radius, 
                                obstacle.size, obstacle.thickness);
  }
  return false;
}

// Kollision mit Rechteck
function checkRectangleCollision(x, y, radius, w, h) {
  let closestX = constrain(x, -w/2, w/2);
  let closestY = constrain(y, -h/2, h/2);
  let distance = dist(x, y, closestX, closestY);
  return distance < radius;
}

// Kollision mit Dreieck (vereinfacht)
function checkTriangleCollision(x, y, radius, size) {
  // Vereinfachte Kollision: Nutze umschließenden Kreis
  return dist(0, 0, x, y) < (radius + size/2);
}

// Kollision mit L-Form
function checkLShapeCollision(x, y, radius, size, thickness) {
  // Überprüfe beide Rechtecke der L-Form
  let rect1 = checkRectangleCollision(x, y, radius, size, thickness);
  let rect2 = checkRectangleCollision(x, y, radius, thickness, size);
  return rect1 || rect2;
}

// Spawnt eine neue Münze an einer gültigen Position (nicht in Hindernissen)
function spawnNewCoin() {
  let attempts = 0;
  let maxAttempts = 100;
  
  do {
    collectibleX = random(borderWidth + 30, width - borderWidth - 30);
    collectibleY = random(borderWidth + 30, height - borderWidth - 30);
    attempts++;
  } while (checkWallCollision(collectibleX, collectibleY, 15) && attempts < maxAttempts);
  
  // Fallback: Falls keine gültige Position gefunden wird
  if (attempts >= maxAttempts) {
    collectibleX = width/2;
    collectibleY = height/2;
  }
}

// Zeichnet den Spielfeldrand
function drawGameBorder() {
  // Füllung für den Rand
  fill(70, 70, 70);  // Dunkelgrauer Rand
  noStroke();
  
  // Oberer Rand
  rect(0, 0, width, borderWidth);
  // Linker Rand
  rect(0, 0, borderWidth, height);
  // Rechter Rand
  rect(width - borderWidth, 0, borderWidth, height);
  // Unterer Rand
  rect(0, height - borderWidth, width, borderWidth);
}

// Zeichnet eine realistische Münze
function drawCoin(x, y, size) {
  push(); // Speichere den aktuellen Zeichenstatus
  
  // Äußerer Ring (dunkles Gold)
  fill(184, 134, 11); // Dunkles Gold
  noStroke();
  circle(x, y, size);
  
  // Innerer Bereich (helles Gold)
  fill(255, 215, 0); // Helles Gold
  circle(x, y, size * 0.85);
  
  // Glanzeffekt oben links
  fill(255, 255, 200, 150); // Hellgelb mit Transparenz
  circle(x - size * 0.15, y - size * 0.15, size * 0.4);
  
  // Schatten unten rechts
  fill(139, 101, 8, 100); // Dunkleres Gold mit Transparenz
  circle(x + size * 0.1, y + size * 0.1, size * 0.6);
  
  // Mittlerer Kreis (Münzdetail)
  fill(205, 149, 12); // Mittleres Gold
  circle(x, y, size * 0.5);
  
  // Zentraler Punkt
  fill(255, 215, 0); // Helles Gold
  circle(x, y, size * 0.2);
  
  // Münzrand (gestrichelte Linie)
  noFill();
  stroke(139, 101, 8); // Dunkles Gold
  strokeWeight(1);
  circle(x, y, size * 0.9);
  
  // Kleine Details um den Rand
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let detailX = x + cos(angle) * (size * 0.35);
    let detailY = y + sin(angle) * (size * 0.35);
    fill(184, 134, 11);
    noStroke();
    circle(detailX, detailY, 2);
  }
  
  pop(); // Stelle den vorherigen Zeichenstatus wieder her
}

// Zeichnet eine rotierende Münze
function drawRotatingCoin(x, y, size, rotation) {
  push();
  translate(x, y);
  rotate(rotation);
  
  // Perspektive-Effekt durch Skalierung
  let scaleX = abs(cos(rotation * 2)) * 0.3 + 0.7; // Zwischen 0.7 und 1.0
  scale(scaleX, 1);
  
  drawCoin(0, 0, size);
  
  pop();
}

// Erstellt Partikel beim Einsammeln einer Münze
function createCoinParticles(x, y) {
  // 20 Partikel erzeugen
  for (let i = 0; i < 20; i++) {
    let particle = {
      x: x,
      y: y,
      vx: random(-3, 3),  // Zufällige Geschwindigkeit in x-Richtung
      vy: random(-3, 3),  // Zufällige Geschwindigkeit in y-Richtung
      size: random(3, 8),   // Zufällige Größe
      color: color(random(200, 255), random(150, 215), random(0, 50), 255),  // Gold-Farben
      alpha: 255,         // Transparenz
      life: 255           // Lebensdauer
    };
    particles.push(particle);
  }
}

// Aktualisiert und zeichnet alle Partikel
function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Partikel bewegen
    p.x += p.vx;
    p.y += p.vy;
    
    // Lebensdauer verringern
    p.life -= 10;
    p.alpha = p.life;
    
    // Partikel zeichnen
    noStroke();
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    circle(p.x, p.y, p.size);
    
    // Tote Partikel entfernen
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Spieler an einer zufälligen freien Position spawnen lassen
function spawnPlayerAtRandomCorner() {
  if (gameDifficulty === "easy") {
    // Normale Ecken-Logik für Easy
    let cornerPadding = borderWidth + 30;
    let corners = [
      {x: cornerPadding, y: cornerPadding},
      {x: width - cornerPadding, y: cornerPadding},
      {x: cornerPadding, y: height - cornerPadding},
      {x: width - cornerPadding, y: height - cornerPadding}
    ];
    
    let randomCorner = random(corners);
    playerX = randomCorner.x;
    playerY = randomCorner.y;
  } else {
    // Spawne an einer freien Position für Medium/Hard
    let attempts = 0;
    let maxAttempts = 50;
    let cornerPadding = borderWidth + 50;
    
    let corners = [
      {x: cornerPadding, y: cornerPadding},
      {x: width - cornerPadding, y: cornerPadding},
      {x: cornerPadding, y: height - cornerPadding},
      {x: width - cornerPadding, y: height - cornerPadding}
    ];
    
    do {
      let randomCorner = random(corners);
      if (!checkWallCollision(randomCorner.x, randomCorner.y, 20)) {
        playerX = randomCorner.x;
        playerY = randomCorner.y;
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);
    
    // Fallback
    if (attempts >= maxAttempts) {
      playerX = borderWidth + 50;
      playerY = borderWidth + 50;
    }
  }
}

function checkSpeedIncrease() {
  if (gamePaused) return; // Keine Geschwindigkeitserhöhung während Pause
  
  let currentTime = millis();
  if (currentTime - lastSpeedIncrease >= minuteInMillis) {
    increaseEnemySpeed();
    lastSpeedIncrease = currentTime;
  }
}

// Erhöht die Geschwindigkeit des Gegners um 10%
function increaseEnemySpeed() {
  let multiplier = 1 + speedIncreasePercentage;
  if (gameDifficulty === "hard") {
    multiplier = 1 + (speedIncreasePercentage * 1.5); // 15% statt 10% bei Hard
  }
  enemySpeed *= multiplier;
  difficultyLevel++;
}

// Zeigt den Startbildschirm an
function displayStartScreen() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Drücke LEERTASTE zum Starten", width/2, height/2 - 50);
  textSize(18);
  text("Bewege dich mit den Pfeiltasten und sammle goldene Münzen", width/2, height/2);
  text("Vermeide den roten Kreis, er wird jede Minute schneller!", width/2, height/2 + 30);
  text("Schwierigkeit: " + gameDifficulty.toUpperCase(), width/2, height/2 + 60);
  text("Pausiere das Spiel mit Taste P", width/2, height/2 + 90); 
  
  if (gameDifficulty === "medium" || gameDifficulty === "hard") {
   text("'S' für SHOP | 'E' für EINSTELLUNGEN (Münzen: " + coins + ")", width/2, height/2 + 180);
  }
  
  // Shop-Hinweis hinzufügen
  textSize(20);
  fill(255, 255, 0); // Gelbe Farbe für Aufmerksamkeit
  text("Drücke 'S' für SHOP (Münzen: " + coins + ")", width/2, height/2 + 160);
  
  // ÄNDERE DIES: Anstatt keyIsPressed verwende eine spezifische Taste in keyPressed()
  // Das wird jetzt in der keyPressed() Funktion behandelt
}

// Zeigt den Game Over Bildschirm an
function displayGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("GAME OVER", width/2, height/2 - 50);
  textSize(24);
  text("Dein Punktestand: " + score, width/2, height/2 + 20);
  text("Highscore: " + highScore, width/2, height/2 + 60);
  textSize(18);
  text("Drücke LEERTASTE für ein neues Spiel", width/2, height/2 + 120);
  text("Drücke ESC für neue Schwierigkeitsauswahl", width/2, height/2 + 150);
  
  // Shop-Hinweis hinzufügen
  textSize(20);
  fill(255, 255, 0); // Gelbe Farbe
  text("Drücke 'S' für SHOP (Münzen: " + coins + ")", width/2, height/2 + 180);
  
  if (keyIsDown(32)) {
    resetGame();
  }
  if (keyCode === ESCAPE) {
    difficultySelected = false;
    gameStarted = false;
    playerAlive = true;
  }
}

// Setzt das Spiel zurück
function resetGame() {
  // Labyrinth erstellen basierend auf Schwierigkeit
  createMaze();
  
  // Spieler spawnen
  spawnPlayerAtRandomCorner();
  playerAlive = true;
  
  // Den Gegner in der Mitte des Spielfelds spawnen
  enemyX = width/2;
  enemyY = height/2;
  
  // Geschwindigkeit basierend auf Schwierigkeit setzen
  if (gameDifficulty === "easy") {
    enemyBaseSpeed = 2;
  } else if (gameDifficulty === "medium") {
    enemyBaseSpeed = 2.2;
  } else if (gameDifficulty === "hard") {
    enemyBaseSpeed = 2.5;
  }
  enemySpeed = enemyBaseSpeed;
  
  score = 0;
// coins bleiben erhalten, damit man sie im Shop verwenden kann
// Wenn du willst, dass Münzen auch zurückgesetzt werden, füge hinzu: coins = 0;
sq
  difficultyLevel = 1;
  lastSpeedIncrease = millis();
  
  // Münze spawnen
  spawnNewCoin();
  
  // Alle Partikel entfernen
  particles = [];
}

function keyPressed() {
  console.log("Taste gedrückt: " + key + " | Spielstatus: gameStarted=" + gameStarted + ", playerAlive=" + playerAlive + ", shopOpen=" + shopOpen);
  
  // Pausensteuerung (hat höchste Priorität nach Shop)
  if (gameStarted && playerAlive && !shopOpen) {
    if (key === 'p' || key === 'P') {
      gamePaused = !gamePaused; // Pause umschalten
      console.log("Spiel " + (gamePaused ? "pausiert" : "fortgesetzt"));
      return;
    }
  }

  // Steuerung im Pausenmenü
  if (gamePaused) {
    if (key === 'p' || key === 'P') {
      gamePaused = false;
      console.log("Spiel fortgesetzt");
    } else if (keyCode === ESCAPE) {
      // Zurück zum Hauptmenü
      gamePaused = false;
      gameStarted = false;
      difficultySelected = false;
      playerAlive = true;
      console.log("Zurück zum Hauptmenü");
    }
    return;
  }

  // Shop-Steuerung
  if (shopOpen) {
    if (keyCode === LEFT_ARROW) {
      navigateShop("left");
    } else if (keyCode === RIGHT_ARROW) {
      navigateShop("right");
    } else if (keyCode === UP_ARROW) {
      navigateShop("up");
    } else if (keyCode === DOWN_ARROW) {
      navigateShop("down");
    } else if (keyCode === ENTER) {
      buyOrSelectItem();
    } else if (keyCode === ESCAPE) {
      shopOpen = false;
    }
    return;
  }
  
  // Shop öffnen (überall außer im Spiel)
  if (key === 's' || key === 'S') {
    if (!gameStarted || !playerAlive) {
      shopOpen = true;
      console.log("Shop geöffnet");
      return;
    } else {
      console.log("Shop kann nicht im Spiel geöffnet werden");
    }
  }
  
  // Rest der Steuerung nur wenn Shop geschlossen ist
  if (!shopOpen) {
    // Schwierigkeitsauswahl
    if (!difficultySelected) {
      if (key === '1') {
        gameDifficulty = "easy";
        difficultySelected = true;
      } else if (key === '2') {
        gameDifficulty = "medium";
        difficultySelected = true;
      } else if (key === '3') {
        gameDifficulty = "hard";
        difficultySelected = true;
      }
    }
    // ENTFERNE DIESEN BLOCK KOMPLETT:
    // else if (difficultySelected && !gameStarted) {
    //   gameStarted = true;
    //   resetGame();
    // }
    
    // Spiel starten vom Startbildschirm
    else if (difficultySelected && !gameStarted) {
      if (key === ' ') { // Nur Leertaste startet das Spiel
        gameStarted = true;
        resetGame();
      }
    }
    // Game Over
    else if (!playerAlive && gameStarted) {
      if (key === ' ') {
        resetGame();
      } else if (keyCode === ESCAPE) {
        difficultySelected = false;
        gameStarted = false;
        playerAlive = true;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Erstellt ein vollständiges Labyrinth über die ganze Map
function createFullMaze() {
  // Berechne Labyrinth-Dimensionen
  mazeWidth = Math.floor((width - 2 * borderWidth) / mazeSize);
  mazeHeight = Math.floor((height - 2 * borderWidth) / mazeSize);
  
  // Initialisiere Labyrinth-Array (true = Wand, false = Weg)
  maze = [];
  for (let y = 0; y < mazeHeight; y++) {
    maze[y] = [];
    for (let x = 0; x < mazeWidth; x++) {
      maze[y][x] = true; // Beginne mit allen Wänden
    }
  }
  
  if (gameDifficulty === "medium") {
    generateSimpleMaze();
  } else if (gameDifficulty === "hard") {
    generateComplexMaze();
  }
}

// Generiert ein einfaches Labyrinth für Medium
function generateSimpleMaze() {
  // Erstelle einige große offene Bereiche und einfache Pfade
  for (let y = 1; y < mazeHeight - 1; y += 3) {
    for (let x = 1; x < mazeWidth - 1; x += 3) {
      // Erstelle 2x2 offene Bereiche
      maze[y][x] = false;
      maze[y][x + 1] = false;
      maze[y + 1][x] = false;
      maze[y + 1][x + 1] = false;
    }
  }
  
  // Verbinde die Bereiche mit Pfaden
  for (let y = 2; y < mazeHeight - 2; y += 3) {
    for (let x = 2; x < mazeWidth - 2; x += 6) {
      maze[y][x] = false;
      maze[y][x + 1] = false;
      maze[y][x + 2] = false;
    }
  }
  
  for (let x = 2; x < mazeWidth - 2; x += 3) {
    for (let y = 2; y < mazeHeight - 2; y += 6) {
      maze[y][x] = false;
      maze[y + 1][x] = false;
      maze[y + 2][x] = false;
    }
  }
}

// Generiert ein komplexes Labyrinth für Hard
function generateComplexMaze() {
  // Starte mit einem zufälligen Punkt
  let startX = 1;
  let startY = 1;
  maze[startY][startX] = false;
  
  let stack = [];
  let current = {x: startX, y: startY};
  
  // Labyrinth-Generierung mit Depth-First Search
  while (true) {
    let neighbors = getUnvisitedNeighbors(current.x, current.y);
    
    if (neighbors.length > 0) {
      let next = random(neighbors);
      
      // Entferne Wand zwischen current und next
      let wallX = current.x + (next.x - current.x) / 2;
      let wallY = current.y + (next.y - current.y) / 2;
      maze[wallY][wallX] = false;
      maze[next.y][next.x] = false;
      
      stack.push(current);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
  
  // Öffne zusätzliche Pfade für bessere Spielbarkeit
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(random(1, mazeWidth - 1));
    let y = Math.floor(random(1, mazeHeight - 1));
    maze[y][x] = false;
  }
}

// Hilfsfunktion für die Labyrinth-Generierung
function getUnvisitedNeighbors(x, y) {
  let neighbors = [];
  let directions = [
    {x: 0, y: -2}, // oben
    {x: 2, y: 0},  // rechts
    {x: 0, y: 2},  // unten
    {x: -2, y: 0}  // links
  ];
  
  for (let dir of directions) {
    let newX = x + dir.x;
    let newY = y + dir.y;
    
    if (newX > 0 && newX < mazeWidth - 1 && 
        newY > 0 && newY < mazeHeight - 1 && 
        maze[newY][newX] === true) {
      neighbors.push({x: newX, y: newY});
    }
  }
  
  return neighbors;
}

// Zeichnet das vollständige Labyrinth
function drawMaze() {
  fill(120, 120, 120);  // Graue Wände
  noStroke();
  
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if (maze[y][x]) { // Wenn es eine Wand ist
        let pixelX = borderWidth + x * mazeSize;
        let pixelY = borderWidth + y * mazeSize;
        rect(pixelX, pixelY, mazeSize, mazeSize);
      }
    }
  }
}

// Erstellt Hindernisse basierend auf Schwierigkeitsstufe
function createObstacles() {
  obstacles = [];
  
  if (gameDifficulty === "medium") {
    obstacleCount = 8; // Wenige Hindernisse für Medium
  } else if (gameDifficulty === "hard") {
    obstacleCount = 16; // Viele Hindernisse für Hard
  } else {
    return; // Keine Hindernisse für Easy
  }
  
  // Erstelle verschiedene Arten von Hindernissen
  for (let i = 0; i < obstacleCount; i++) {
    let obstacle = createRandomObstacle();
    
    // Stelle sicher, dass Hindernisse nicht zu nah am Spielfeld-Rand sind
    let attempts = 0;
    let maxAttempts = 50;
    
    do {
      obstacle.x = random(borderWidth + 60, width - borderWidth - 60);
      obstacle.y = random(borderWidth + 60, height - borderWidth - 60);
      attempts++;
    } while (isObstacleTooClose(obstacle) && attempts < maxAttempts);
    
    obstacles.push(obstacle);
  }
}

// Erstellt ein zufälliges Hindernis
function createRandomObstacle() {
  let obstacleTypes = ['rectangle', 'circle', 'triangle', 'L-shape'];
  let type = random(obstacleTypes);
  let rotation = random(TWO_PI); // Zufällige Rotation
  
  let obstacle = {
    type: type,
    x: 0,
    y: 0,
    rotation: rotation,
    color: color(random(80, 140), random(80, 140), random(80, 140)) // Zufällige graue Töne
  };
  
  // Spezifische Eigenschaften je nach Typ
  switch(type) {
    case 'rectangle':
      obstacle.width = random(60, 120);
      obstacle.height = random(30, 80);
      break;
    case 'circle':
      obstacle.radius = random(25, 50);
      break;
    case 'triangle':
      obstacle.size = random(40, 80);
      break;
    case 'L-shape':
      obstacle.size = random(50, 90);
      obstacle.thickness = random(15, 25);
      break;
  }
  
  return obstacle;
}

// Überprüft, ob ein Hindernis zu nah an anderen ist
function isObstacleTooClose(newObstacle) {
  let minDistance = 100; // Mindestabstand zwischen Hindernissen
  
  for (let obstacle of obstacles) {
    let distance = dist(newObstacle.x, newObstacle.y, obstacle.x, obstacle.y);
    if (distance < minDistance) {
      return true;
    }
  }
  return false;
}

// Zeichnet alle Hindernisse
function drawObstacles() {
  for (let obstacle of obstacles) {
    push();
    translate(obstacle.x, obstacle.y);
    rotate(obstacle.rotation);
    fill(obstacle.color);
    noStroke();
    
    switch(obstacle.type) {
      case 'rectangle':
        rect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
        break;
        
      case 'circle':
        circle(0, 0, obstacle.radius * 2);
        break;
        
      case 'triangle':
        triangle(0, -obstacle.size/2, 
                -obstacle.size/2, obstacle.size/2, 
                obstacle.size/2, obstacle.size/2);
        break;
        
      case 'L-shape':
        // Zeichne L-Form als zwei Rechtecke
        rect(-obstacle.size/2, -obstacle.size/2, obstacle.size, obstacle.thickness);
        rect(-obstacle.size/2, -obstacle.size/2, obstacle.thickness, obstacle.size);
        break;
    }
    
    pop();
  }
}

// Zeigt den Shop an
function displayShop() {
  // Hintergrund für Shop
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  
  // Shop-Titel
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("SHOP", width/2, 80);
  
  // Münzen-Anzeige
  textSize(24);
  text("Münzen: " + coins, width/2, 120);
  
  // Kategorie-Buttons
  drawCategoryButtons();
  
  // Shop-Items anzeigen
  drawShopItems();
  
  // Navigation-Hinweise
  textSize(16);
  text("← → Kategorien wechseln | ↑ ↓ Items wählen | ENTER kaufen/auswählen | ESC schließen", width/2, height - 30);
}

// Zeichnet die Kategorie-Buttons
function drawCategoryButtons() {
  let buttonWidth = 150;
  let buttonHeight = 40;
  let buttonY = 160;
  let categories = ["player", "enemy", "background"];
  let categoryNames = ["Spieler", "Gegner", "Hintergrund"];
  
  for (let i = 0; i < categories.length; i++) {
    let x = width/2 - (categories.length * buttonWidth)/2 + i * buttonWidth + buttonWidth/2;
    
    // Button-Hintergrund
    if (selectedShopCategory === categories[i]) {
      fill(100, 100, 255); // Ausgewählt
    } else {
      fill(80, 80, 80); // Normal
    }
    rect(x - buttonWidth/2, buttonY, buttonWidth, buttonHeight);
    
    // Button-Text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(categoryNames[i], x, buttonY + buttonHeight/2);
  }
}

// Zeichnet die Shop-Items
function drawShopItems() {
  let items = getCurrentShopItems();
  let ownedItems = getCurrentOwnedItems();
  let currentSkin = getCurrentSkin();
  
  let itemHeight = 60;
  let startY = 240;
  let maxVisible = 6;
  
  for (let i = 0; i < Math.min(items.length, maxVisible); i++) {
    let y = startY + i * itemHeight;
    let item = items[i];
    let isOwned = ownedItems.includes(i);
    let isSelected = (i === selectedShopItem);
    let isActive = (i === currentSkin);
    
    // Item-Hintergrund
    if (isSelected) {
      fill(60, 60, 60); // Ausgewählt
    } else {
      fill(40, 40, 40); // Normal
    }
    rect(width/4, y, width/2, itemHeight - 5);
    
    // Item-Vorschau (Farbe)
    fill(item.color[0], item.color[1], item.color[2]);
    if (selectedShopCategory === "player" || selectedShopCategory === "enemy") {
      circle(width/4 + 30, y + itemHeight/2, 30);
    } else {
      rect(width/4 + 15, y + 15, 30, 30);
    }
    
    // Item-Name
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(20);
    text(item.name, width/4 + 60, y + itemHeight/2 - 10);
    
    // Preis oder Status
    textSize(16);
    if (isActive) {
      fill(0, 255, 0);
      text("AKTIV", width/4 + 60, y + itemHeight/2 + 15);
    } else if (isOwned) {
      fill(100, 255, 100);
      text("BESESSEN", width/4 + 60, y + itemHeight/2 + 15);
    } else {
      if (coins >= item.price) {
        fill(255, 255, 0);
      } else {
        fill(255, 100, 100);
      }
      text("Preis: " + item.price + " Münzen", width/4 + 60, y + itemHeight/2 + 15);
    }
  }
}

// Hilfsfunktionen für Shop
function getCurrentShopItems() {
  switch(selectedShopCategory) {
    case "player": return playerSkins;
    case "enemy": return enemySkins;
    case "background": return backgrounds;
  }
}

function getCurrentOwnedItems() {
  switch(selectedShopCategory) {
    case "player": return ownedPlayerSkins;
    case "enemy": return ownedEnemySkins;
    case "background": return ownedBackgrounds;
  }
}

function getCurrentSkin() {
  switch(selectedShopCategory) {
    case "player": return currentPlayerSkin;
    case "enemy": return currentEnemySkin;
    case "background": return currentBackground;
  }
}


// Kauft oder wählt ein Item aus
function buyOrSelectItem() {
  console.log("Item kaufen/auswählen");
}

// Zeichnet die Kategorie-Buttons
function drawCategoryButtons() {
  let buttonWidth = 150;
  let buttonHeight = 40;
  let buttonY = 160;
  let categories = ["player", "enemy", "background"];
  let categoryNames = ["Spieler", "Gegner", "Hintergrund"];
  
  for (let i = 0; i < categories.length; i++) {
    let x = width/2 - (categories.length * buttonWidth)/2 + i * buttonWidth + buttonWidth/2;
    
    // Button-Hintergrund
    if (selectedShopCategory === categories[i]) {
      fill(100, 100, 255); // Ausgewählt
    } else {
      fill(80, 80, 80); // Normal
    }
    rect(x - buttonWidth/2, buttonY, buttonWidth, buttonHeight);
    
    // Button-Text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(categoryNames[i], x, buttonY + buttonHeight/2);
  }
}

// Zeichnet die Shop-Items
function drawShopItems() {
  let items = getCurrentShopItems();
  let ownedItems = getCurrentOwnedItems();
  let currentSkin = getCurrentSkin();
  
  let itemHeight = 60;
  let startY = 240;
  let maxVisible = 6;
  
  for (let i = 0; i < Math.min(items.length, maxVisible); i++) {
    let y = startY + i * itemHeight;
    let item = items[i];
    let isOwned = ownedItems.includes(i);
    let isSelected = (i === selectedShopItem);
    let isActive = (i === currentSkin);
    
    // Item-Hintergrund
    if (isSelected) {
      fill(60, 60, 60); // Ausgewählt
    } else {
      fill(40, 40, 40); // Normal
    }
    rect(width/4, y, width/2, itemHeight - 5);
    
    // Item-Vorschau (Farbe)
    fill(item.color[0], item.color[1], item.color[2]);
    if (selectedShopCategory === "player" || selectedShopCategory === "enemy") {
      circle(width/4 + 30, y + itemHeight/2, 30);
    } else {
      rect(width/4 + 15, y + 15, 30, 30);
    }
    
    // Item-Name
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(20);
    text(item.name, width/4 + 60, y + itemHeight/2 - 10);
    
    // Preis oder Status
    textSize(16);
    if (isActive) {
      fill(0, 255, 0);
      text("AKTIV", width/4 + 60, y + itemHeight/2 + 15);
    } else if (isOwned) {
      fill(100, 255, 100);
      text("BESESSEN", width/4 + 60, y + itemHeight/2 + 15);
    } else {
      if (coins >= item.price) {
        fill(255, 255, 0);
      } else {
        fill(255, 100, 100);
      }
      text("Preis: " + item.price + " Münzen", width/4 + 60, y + itemHeight/2 + 15);
    }
  }
}

// Hilfsfunktionen für Shop
function getCurrentShopItems() {
  switch(selectedShopCategory) {
    case "player": return playerSkins;
    case "enemy": return enemySkins;
    case "background": return backgrounds;
  }
}

function getCurrentOwnedItems() {
  switch(selectedShopCategory) {
    case "player": return ownedPlayerSkins;
    case "enemy": return ownedEnemySkins;
    case "background": return ownedBackgrounds;
  }
}

function getCurrentSkin() {
  switch(selectedShopCategory) {
    case "player": return currentPlayerSkin;
    case "enemy": return currentEnemySkin;
    case "background": return currentBackground;
  }
}

// Kauft oder wählt ein Item aus
function buyOrSelectItem() {
  let items = getCurrentShopItems();
  let ownedItems = getCurrentOwnedItems();
  let item = items[selectedShopItem];
  
  if (ownedItems.includes(selectedShopItem)) {
    // Item bereits besessen - auswählen
    switch(selectedShopCategory) {
      case "player": currentPlayerSkin = selectedShopItem; break;
      case "enemy": currentEnemySkin = selectedShopItem; break;
      case "background": currentBackground = selectedShopItem; break;
    }
  } else {
    // Item kaufen
    if (coins >= item.price) {
      coins -= item.price;
      ownedItems.push(selectedShopItem);
      
      // Automatisch auswählen nach Kauf
      switch(selectedShopCategory) {
        case "player": currentPlayerSkin = selectedShopItem; break;
        case "enemy": currentEnemySkin = selectedShopItem; break;
        case "background": currentBackground = selectedShopItem; break;
      }
    }
  }
}

// Navigation im Shop
function navigateShop(direction) {
  if (direction === "left" || direction === "right") {
    // Kategorie wechseln
    let categories = ["player", "enemy", "background"];
    let currentIndex = categories.indexOf(selectedShopCategory);
    
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + categories.length) % categories.length;
    } else {
      currentIndex = (currentIndex + 1) % categories.length;
    }
    
    selectedShopCategory = categories[currentIndex];
    selectedShopItem = 0; // Zurück zum ersten Item
  } else if (direction === "up" || direction === "down") {
    // Item wechseln
    let items = getCurrentShopItems();
    
    if (direction === "up") {
      selectedShopItem = (selectedShopItem - 1 + items.length) % items.length;
    } else {
      selectedShopItem = (selectedShopItem + 1) % items.length;
    }
  }
}

// ===== FÜGE DIESE FUNKTIONEN AM ENDE DEINER DATEI HINZU: =====

// ====== SOUND-MANAGEMENT FUNKTIONEN ======
function playSound(sound, volume = null) {
  if (!soundEffectsEnabled || !sound || !sound.isLoaded()) return;
  
  try {
    if (volume !== null) {
      sound.setVolume(volume * soundEffectsVolume);
    } else {
      sound.setVolume(soundEffectsVolume);
    }
    sound.play();
  } catch (e) {
    console.error("Fehler beim Abspielen des Sounds:", e);
  }
}

function playBackgroundMusic(music) {
  if (!musicEnabled || !music || !music.isLoaded()) return;
  
  try {
    // Aktuelle Musik stoppen
    if (currentMusic && currentMusic.isPlaying()) {
      currentMusic.stop();
    }
    
    // Neue Musik starten
    music.setVolume(musicVolume);
    music.loop(); // Endlosschleife
    currentMusic = music;
  } catch (e) {
    console.error("Fehler beim Abspielen der Musik:", e);
  }
}

function stopBackgroundMusic() {
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
  }
}

function updateMusicVolume() {
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.setVolume(musicVolume);
  }
}

function handleMusicInDraw() {
  // Musik-Management basierend auf Spielzustand
  if (!difficultySelected) {
    // Im Schwierigkeitsauswahlmenü
    if (!currentMusic || currentMusic !== menuMusic) {
      playBackgroundMusic(menuMusic);
    }
  } else if (!gameStarted) {
    // Im Startbildschirm
    if (!currentMusic || currentMusic !== menuMusic) {
      playBackgroundMusic(menuMusic);
    }
  } else if (gameStarted && playerAlive && !gamePaused) {
    // Im Spiel - je nach Schwierigkeit
    let gameMusic;
    switch(gameDifficulty) {
      case "easy": gameMusic = easyGameMusic; break;
      case "medium": gameMusic = mediumGameMusic; break;
      case "hard": gameMusic = hardGameMusic; break;
    }
    
    if (!currentMusic || currentMusic !== gameMusic) {
      playBackgroundMusic(gameMusic);
    }
  } else if (!playerAlive) {
    // Game Over - Musik stoppen oder leise stellen
    if (currentMusic && currentMusic.isPlaying()) {
      currentMusic.setVolume(musicVolume * 0.3); // Leiser machen
    }
  }
}

function playCoinSound() {
  playSound(coinSound);
}

function playGameOverSound() {
  playSound(gameOverSound);
}

// ====== EINSTELLUNGSMENÜ FUNKTIONEN ======
function displaySettings() {
  // Hintergrund für Einstellungen
  fill(0, 0, 0, 220);
  rect(0, 0, width, height);
  
  // Einstellungs-Titel
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("EINSTELLUNGEN", width/2, 100);
  
  // Einstellungsitems anzeigen
  let itemHeight = 60;
  let startY = 200;
  
  for (let i = 0; i < settingsItems.length; i++) {
    let y = startY + i * itemHeight;
    let item = settingsItems[i];
    let isSelected = (i === selectedSettingsItem);
    
    // Item-Hintergrund
    if (isSelected) {
      fill(60, 60, 120);
    } else {
      fill(40, 40, 40);
    }
    rect(width/4, y, width/2, itemHeight - 10);
    
    // Item-Name
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(20);
    text(item.name, width/4 + 20, y + 20);
    
    // Item-Wert anzeigen
    textAlign(RIGHT, CENTER);
    textSize(18);
    
    if (item.type === "slider") {
      let currentValue = eval(item.value);
      let percentage = Math.round((currentValue - item.min) / (item.max - item.min) * 100);
      
      fill(100, 255, 100);
      text(percentage + "%", width/4 + width/2 - 20, y + 20);
      
      // Slider-Balken zeichnen
      let barWidth = 200;
      let barHeight = 8;
      let barX = width/4 + 20;
      let barY = y + 35;
      
      fill(80, 80, 80);
      rect(barX, barY, barWidth, barHeight);
      
      fill(100, 255, 100);
      let progressWidth = (currentValue - item.min) / (item.max - item.min) * barWidth;
      rect(barX, barY, progressWidth, barHeight);
      
    } else if (item.type === "toggle") {
      let isEnabled = eval(item.value);
      fill(isEnabled ? [0, 255, 0] : [255, 100, 100]);
      text(isEnabled ? "AN" : "AUS", width/4 + width/2 - 20, y + 20);
      
    } else if (item.type === "button") {
      fill(255, 255, 0);
      text("", width/4 + width/2 - 20, y + 20);
    }
  }
  
  // Navigation-Hinweise
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("↑ ↓ Auswählen | ← → Wert ändern | ENTER bestätigen | ESC zurück", width/2, height - 50);
}

function navigateSettings(direction) {
  if (direction === "up") {
    selectedSettingsItem = (selectedSettingsItem - 1 + settingsItems.length) % settingsItems.length;
  } else if (direction === "down") {
    selectedSettingsItem = (selectedSettingsItem + 1) % settingsItems.length;
  } else if (direction === "left" || direction === "right") {
    let item = settingsItems[selectedSettingsItem];
    
    if (item.type === "slider") {
      let currentValue = eval(item.value);
      let change = item.step * (direction === "right" ? 1 : -1);
      let newValue = Math.max(item.min, Math.min(item.max, currentValue + change));
      
      if (item.value === "musicVolume") {
        musicVolume = newValue;
        updateMusicVolume();
      } else if (item.value === "soundEffectsVolume") {
        soundEffectsVolume = newValue;
      }
      
    } else if (item.type === "toggle") {
      if (item.value === "musicEnabled") {
        musicEnabled = !musicEnabled;
        if (!musicEnabled) {
          stopBackgroundMusic();
        }
      } else if (item.value === "soundEffectsEnabled") {
        soundEffectsEnabled = !soundEffectsEnabled;
      }
    }
  }
}

function confirmSettingsAction() {
  let item = settingsItems[selectedSettingsItem];
  
  if (item.type === "button" && item.name === "Zurück") {
    settingsOpen = false;
  } else if (item.type === "toggle") {
    if (item.value === "musicEnabled") {
      musicEnabled = !musicEnabled;
      if (!musicEnabled) {
        stopBackgroundMusic();
      }
    } else if (item.value === "soundEffectsEnabled") {
      soundEffectsEnabled = !soundEffectsEnabled;
    }
  }
}

function handleSettingsInKeyPressed() {
  if (settingsOpen) {
    if (keyCode === UP_ARROW) {
      navigateSettings("up");
    } else if (keyCode === DOWN_ARROW) {
      navigateSettings("down");
    } else if (keyCode === LEFT_ARROW) {
      navigateSettings("left");
    } else if (keyCode === RIGHT_ARROW) {
      navigateSettings("right");
    } else if (keyCode === ENTER) {
      confirmSettingsAction();
    } else if (keyCode === ESCAPE) {
      settingsOpen = false;
    }
    return true;
  }
  
  if (key === 'e' || key === 'E') {
    if (!gameStarted || !playerAlive) {
      settingsOpen = true;
      console.log("Einstellungen geöffnet");
      return true;
    }
  }
  
  return false;
}