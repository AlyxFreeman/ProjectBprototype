let img, img1, img2, img3, img4, img5, img6, img7, img8, img9, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22;
let centauriClicks = 0;
let animT = 0;
let shine = 0;
let showMap = false;

let audioStarted = false

let SunFlash;
let cosmicBg;
let sunExpand;
let alienLaser;
let radioActive;
//pollution spots array {x, y, baseSize, life, permanent, removed}
let pollutionSpots = [];


//apocalypse effects
let apocalypseStarted = false;   
let shakeStrength = 0;          
let fadeAlpha = 0;              
let showEndText = false;        
let apocalypseTime = 0;         
let apocalypsePhase = "none";   // none, fadeIn, hold, fadeOut


//earth text 
let showEarthText = false;      
let earthTextStartTime = 0;     
const EarthTextDURATION = 5000; 


//earth color transition
let earthColorChange = false;   
let earthColorStartTime = 0;    
let earthColorProgress = 0;     
const EarthColourDURATION = 10000; 


//blackout timing
const FadeInSPEED = 3;        
const HoldDURATION = 3000;    
const FadeOutSPEED = 3;       


//Sun variables
let sunClicks = 0;
let sunFlashIntensity = 0;
let sunExpanding = false;
let sunExpandStartTime = 0;
let sunBaseSize = 400;
let sunCurrentSize = 400;
let sunRedGiantProgress = 0;
const SunExpandDURATION = 10000;
let earthEngulfed = false;
let sunEngulfFadeAlpha = 0;


//Track if apocalypse has occurred (disable map entry after)
let apocalypseCompleted = false;

//Alien attack variables
let alienAttackActive = false;
let laserBeams = [];
let earthExplosion = false;
let explosionParticles = [];
let explosionAlpha = 0;
let img10; 

//Final escaoe
let showEscapeOptions = false;
let spaceshipActive = false;
let engineActive = false;
let spaceshipT = 0;
let earthT = 0;
let escapeShipPos = null;
let escapeEnginePos = null;


//Ending
let showEnding = false;
let endingType = ""; //"spaceship" or "engine"

//Exit

let mapExitButton = null;
let endingBackButton = null;


//assets
function preload() {
  img  = loadImage("assets/Background.png");
  img1 = loadImage("assets/Earth1.png");
  img2 = loadImage("assets/Centauri.png");
  img3 = loadImage("assets/AlienShip.png");
  img4 = loadImage("assets/MapScene.png");
  img5 = loadImage("assets/Radioactive.png");
  img6 = loadImage("assets/StarShip.png");     
  img7 = loadImage("assets/PlanetEngine.png");       
  img8 = loadImage("assets/Ending2.png");  
  img9 = loadImage("assets/Ending1.png"); 
  //alienEnding
  img10 = loadImage("assets/AlienEnding.png");
  img11 = loadImage("assets/AlienBg.png");
  img12 = loadImage("assets/AlienEndingDebris.png");
  img13 = loadImage("assets/AlienEndingEarth.png");
  //ShipEnding
  img14 = loadImage("assets/ShipEndingBg.png");  
  img15 = loadImage("assets/ShipEndingShip.png");
  img16 = loadImage("assets/ShipEndingPlanet.png");
  //Engineending
  img17 = loadImage("assets/EngineEndingBg.png");
  img18 = loadImage("assets/EngineEndingSun.png");
  img19 = loadImage("assets/EngineEndingEarth.png");
  //PollutionEnding
  img20 = loadImage("assets/PollutionEndingBg.png");
  img21 = loadImage("assets/PollutionEndingDebris.png")
  img22 = loadImage("assets/PollutionEndingEarth.png")

  //AUDIO//
  //sun
  SunFlash = loadSound("assets\SunFlash.mp3")
  sunExpand = loadSound("assets/SunExpand.mp3")
  //background
  cosmicBg = loadSound("assets/CosmicBg.mp3")
  //alien
  alienLaser = loadSound("assets/AlienLaser.mp3")
  //pollution
  radioActive = loadSound("assets/RadioActive.mp3")
}


//foundation
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);

    cosmicBg.loop(); 
  cosmicBg.setVolume(0.3); 
}


function draw() {
  background(220);
  
  if (showEnding) {
    drawEnding();
    return;
  }

  if (showMap) {
    noCursor(); 
    drawMapScene();
  } else {
    cursor(); 
    drawSpaceScene();
    drawLaserAttack(); 
    drawEarthExplosion(); 
  }

  Apocalypse();
  EarthText();
  EarthColor();
  SunEngulf();
}


//SPACE SCENE


function drawSpaceScene() {
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;

  //background
  let bgX = width / 2 - dx * 0.05;
  let bgY = height / 2 - dy * 0.05;

  image(img, bgX, bgY, windowWidth + 500, windowHeight + 500);
  noTint();

  //Earth Base
  let earthBaseX = width / 2 + dx * 0.1;
  let earthBaseY = height / 2 + dy * 0.1;

  //Centauri Base
  let centauriBaseX = bgX + 4/10 * width;
  let centauriBaseY = bgY - 4/10 * height;
  let centauriX = centauriBaseX;
  let centauriY = centauriBaseY;
  shine += 0.05;
  let brightness = 127.5 + sin(shine) * 50;
  tint(255, brightness);
  image(img2, centauriX, centauriY, 400, 400);
  noTint();

  //Earth Color
  if (earthColorProgress > 0) {
    let r = lerp(255, 160, earthColorProgress);
    let g = lerp(255, 100, earthColorProgress);
    let b = lerp(255, 60, earthColorProgress);
    tint(r, g, b);
  }

  //Earth Size Calc
  let drawEarthX = earthBaseX;
  let drawEarthY = earthBaseY;
  let earthSize = 150; //Primitive Size

  if (engineActive) {
    earthT += 0.005;
    let tEarth = constrain(earthT, 0, 1);
    drawEarthX = lerp(earthBaseX, centauriX, tEarth);
    drawEarthY = lerp(earthBaseY, centauriY, tEarth);
    earthSize = lerp(150, 0, tEarth); //Disappear

    //Engine Flare
    push();
    noStroke();
    for (let i = 0; i < 10; i++) {
      let trailT = tEarth - i * 0.03; //Earth positions
      trailT = constrain(trailT, 0, 1);
      
      let tailX = lerp(earthBaseX, centauriX, trailT);
      let tailY = lerp(earthBaseY, centauriY, trailT);
      
      let alpha = lerp(0, 180, 1 - i / 10);
      let size = lerp(20, 120, i / 10);
      fill(80, 160, 255, alpha);
      ellipse(tailX, tailY, size, size * 0.6);
    }
    pop();

    //Ending Check
    if (tEarth >= 1 && !showEnding) {
      showEnding = true;
      endingType = "engine";
    }
  }

  //Earth
  if (!earthEngulfed && earthSize > 0) {
    image(img1, drawEarthX, drawEarthY, earthSize + 50, earthSize);
  }
  noTint();

  //Warning
  if (centauriClicks == 1) {
    fill(255, 0, 0);
    textSize(32);
    text("DO NOT RESPOND!", width / 2, height / 2 - 200);
  }

  //AlienShip
  if (centauriClicks >= 2 && animT < 1) {
    animT += 0.02;
  }
  if (centauriClicks >= 2) {
    let t = constrain(animT, 0, 1);
    let shipBaseX = lerp(centauriX, drawEarthX + 100, t);
    let shipBaseY = lerp(centauriY, drawEarthY - 100, t);
    let shipX = shipBaseX + dx * 0.11;
    let shipY = shipBaseY + dy * 0.11;
    let shipW = lerp(30, 300, t);
    let shipH = lerp(16, 160, t);
    image(img3, shipX, shipY, shipW, shipH);
  }

  //Sun Expand text
  if (showEscapeOptions && !earthEngulfed && !showMap) {
    push();
    fill(255, 200, 100);
    textSize(22);
    text("The sun is expanding,\nTIME IS RUNNING OUT", drawEarthX, drawEarthY - 130);
    
    let shipIconX = drawEarthX - 120;
    let shipIconY = drawEarthY + 80;
    let engineIconX = drawEarthX + 120;
    let engineIconY = drawEarthY + 80;

    image(img6, shipIconX, shipIconY, 80, 40);
    image(img7, engineIconX, engineIconY, 60, 60);
    pop();

    escapeShipPos = { x: shipIconX, y: shipIconY };
    escapeEnginePos = { x: engineIconX, y: engineIconY };
  }

  //StarShip Anime
  if (spaceshipActive) {
    spaceshipT += 0.01;
    let t = constrain(spaceshipT, 0, 1);

    let startX;
    let startY;

    if (escapeShipPos) {
      startX = escapeShipPos.x;
      startY = escapeShipPos.y;
    } else {
      startX = drawEarthX + 100;
      startY = drawEarthY;
    }

    let shipX = lerp(startX, centauriX, t);
    let shipY = lerp(startY, centauriY, t);

    let shipSize = lerp(80, 10, t);
    image(img6, shipX, shipY, shipSize * 2, shipSize);

    //Ending Detect
    if (t >= 1 && !showEnding) {
      showEnding = true;
      endingType = "spaceship";
    }
  }

  //sun
  drawSun(dx, dy);
}


//SUN DRAWING FUNCTION (Low-Poly Style)
function drawSun(dx, dy) {
  //Size
  let sunBaseX = -sunCurrentSize * 0.25;
  let sunBaseY = height + sunCurrentSize * 0.25;
  let sunX = sunBaseX - dx * 0.08;
  let sunY = sunBaseY - dy * 0.08;

  //Sun Expand
  if (sunExpanding) {
    let elapsed = millis() - sunExpandStartTime;
    sunRedGiantProgress = elapsed / SunExpandDURATION;
    sunRedGiantProgress = constrain(sunRedGiantProgress, 0, 1);

    //Expansion
    let maxSize = sqrt(width * width + height * height) * 10;//how big will sun grow
    let growthFactor = pow(sunRedGiantProgress, 1.5);
    sunCurrentSize = lerp(sunBaseSize, maxSize, growthFactor);
  }

  //Flash
  if (sunFlashIntensity > 0) {
    sunFlashIntensity *= 0.92;
    if (sunFlashIntensity < 1) sunFlashIntensity = 0;
  }

  //Color Change
  let sunR, sunG, sunB;
  if (sunExpanding) {
    sunR = lerp(255, 200, sunRedGiantProgress);
    sunG = lerp(220, 50, sunRedGiantProgress);
    sunB = lerp(50, 20, sunRedGiantProgress);
  } else {
    sunR = 255;
    sunG = 220;
    sunB = 50;
  }

  let glowPhase = sin(frameCount * 0.08) * 0.3 + 0.7;
  let flashBoost = sunFlashIntensity * 2;

  push();
  noStroke();

  //Sun's Corona - polygon layers
  for (let i = 5; i > 0; i--) {
    let glowSize = sunCurrentSize + i * 25 + flashBoost * 3;
    let alpha = (30 - i * 5) * glowPhase + flashBoost * 0.5;
    fill(sunR, sunG, sunB, alpha);
    drawPolygonCircle(sunX, sunY, glowSize / 2, 8 + i);
  }

  //Corona Light - triangle rays
  let rayCount = 12;
  for (let i = 0; i < rayCount; i++) {
    let angle = (2*PI / rayCount) * i + frameCount * 0.01;
    let rayLength = sunCurrentSize * 0.4 * glowPhase + flashBoost;

    let innerRadius = sunCurrentSize * 0.5;
    let outerRadius = innerRadius + rayLength;
    
    let x1 = sunX + cos(angle - 0.1) * innerRadius;
    let y1 = sunY + sin(angle - 0.1) * innerRadius;
    let x2 = sunX + cos(angle + 0.1) * innerRadius;
    let y2 = sunY + sin(angle + 0.1) * innerRadius;
    let x3 = sunX + cos(angle) * outerRadius;
    let y3 = sunY + sin(angle) * outerRadius;

    fill(sunR, sunG, sunB, 150 + flashBoost);
    triangle(x1, y1, x2, y2, x3, y3);
  }

  //Sun itself - main polygon
  let bodyBrightness = 255 + flashBoost;
  fill(min(sunR + 20, bodyBrightness), min(sunG + 20, bodyBrightness), sunB);
  drawPolygonCircle(sunX, sunY, sunCurrentSize / 2, 16);

  //Sun core - inner polygon
  let coreSize = sunCurrentSize * 0.6;
  fill(255, min(255, sunG + 50 + flashBoost), min(150, sunB + flashBoost), 200);
  drawPolygonCircle(sunX, sunY, coreSize / 2, 12);

  pop();

  //Sun consume Earth
  if (!earthEngulfed && !showMap && !spaceshipActive && !engineActive) {
    let earthX = width / 2 + dx * 0.1;
    let earthY = height / 2 + dy * 0.1;

    let distToEarth = dist(sunX, sunY, earthX, earthY);
    if (distToEarth < sunCurrentSize / 2) {
      earthEngulfed = true;
      sunEngulfFadeAlpha = 0;
      showEscapeOptions = false;
    }
  }
}


//Helper function to draw polygon circle
function drawPolygonCircle(x, y, radius, sides) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    let angle = (TWO_PI / sides) * i;
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}


//SUN Consume EFFECT
function SunEngulf() {
  if (!earthEngulfed) return;
  
  sunEngulfFadeAlpha += 0.5;
  sunEngulfFadeAlpha = constrain(sunEngulfFadeAlpha, 0, 255);
  
  if (sunEngulfFadeAlpha > 0) {
    push();
    noStroke();
    fill(180, 40, 20, sunEngulfFadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    
    if (sunEngulfFadeAlpha > 200) {
      fill(255, sunEngulfFadeAlpha);
      textSize(50)
      text("Ending I Unlocked : Warm in here?" , width/2, height/2 - 100)
      textSize(36);
      textSize(40);
      text("The Sun has consumed Earth.", width / 2, height / 2);
      textSize(24);
      text("5 billion years too early...", width / 2, height / 2 + 50);
      textSize(60)
  showEnding = true;
  endingType = "sun";
   
    }
    pop();
  
}

}


//ENDING SCENE
function drawEnding() {
  background(0);

  let dx = mouseX - width / 2;
  //let dy = mouseY - height / 2;

  //background
  let bgX = width / 2 - dx * 0.05;
  //let bgY = height / 2 - dy * 0.05;

  let earthBaseX = width / 2 + dx * 0.1;
  //let earthBaseY = height / 2 + dy * 0.1;
  
  let debrisX = bgX + dx * 0.025
  if (endingType === "spaceship") {
    //Ship Ending
image(img14, bgX, height / 2, width + 500, (width + 500) * (1344/3136));
    image(img16, debrisX, height / 2, width + 500, (width + 500) * (1344/3136));
    image(img15, earthBaseX, height / 2, width + 500, (width + 500) * (1344/3136) );
    fill(255);
    textSize(50)
    text("Ending II Unlocked : New Planet, New Home", width/2, height - 200);
    textSize(36);
    text("A few of us escaped on the spaceship", width / 2, height - 100);
    textSize(24);
    text("A new journey begins at Alpha Centauri...", width / 2, height - 50);
    
  } else if (endingType === "engine") {
    //Wandering Earth Ending
    image(img17, bgX, height / 2, width + 500, (width + 500) * (1344/3136));
    image(img18, debrisX, height / 2, width + 500, (width + 500) * (1344/3136));
    image(img19, earthBaseX, height / 2, width + 500, (width + 500) * (1344/3136) );
    fill(255);
    textSize(50)
    text("Ending III Unlocked : Will The New Sun Treat Us Well?" , width/2, height - 200); 
    textSize(36);
    text("Earth arrived at Alpha Centauri", width / 2, height - 100);
    textSize(24);
    text("The Wandering Earth finds a new home...", width / 2, height - 50);
  
  } else if (endingType === "alien") {
    //AlienEnding
    image(img11, bgX, height / 2, width + 500, (width + 500) * (1344/3136));
    image(img12, debrisX, height / 2, width + 500, (width + 500) * (1344/3136));
    image(img13, earthBaseX, height / 2, width + 500, (width + 500) * (1344/3136) );
    fill(255);
    textSize(50)
    text("Ending IV Unlocked : Told you!" , width/2, height - 200)
    textSize(36);
    textSize(36);
    text("Earth was destroyed by alien attack", width / 2, height - 100);
    textSize(24);
    text("Perhaps we should have remained silent...", width / 2, height - 50);

    } else if (endingType === "pollution") {
    
    image(img20, bgX, height / 2, width + 500, (width + 500) * (1344 / 3136));
    image(img21, debrisX, height / 2, width + 500, (width + 500) * (1344 / 3136));
    image(img22, earthBaseX, height / 2, width + 500, (width + 500) * (1344/3136) );

    fill(255);
    textSize(50);
    text("Ending V Unlocked : Nowhere Left To Run", width / 2, height - 200);
    textSize(36);
    text("Earth choked by its own pollution", width / 2, height - 100);
    textSize(24);
    text("When every map is dark, there is no exit...", width / 2, height - 50);
  }

  if (endingType === "sun") {
  
  background(0);
  fill(255);
  textSize(50);
  text("Ending I Unlocked : Warm in here?", width/2, height - 200);
  textSize(36);
  text("The Sun has consumed Earth.", width / 2, height - 100);
  textSize(24);
  text("5 billion years too early...", width / 2, height - 50);
}

   let btnW = 200;
  let btnH = 50;
  let btnX = width - btnW - 40;
  let btnY = height - btnH - 40;

  push();
  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 180);
  rect(btnX, btnY, btnW, btnH, 10);
  fill(255);
  textSize(22);
  textAlign(CENTER, CENTER);
  text("BACK TO START", btnX + btnW / 2, btnY + btnH / 2);
  pop();
  
  endingBackButton = {x: btnX, y: btnY, w: btnW, h: btnH}
}


//Check click is on sun
function isClickOnSun(mx, my) {
  let dx = mx - width / 2;
  let dy = my - height / 2;
  let sunBaseX = -sunCurrentSize * 0.25;
  let sunBaseY = height + sunCurrentSize * 0.25;
  let sunX = sunBaseX - dx * 0.08;
  let sunY = sunBaseY - dy * 0.08;
  
  let d = dist(mx, my, sunX, sunY);
  return d < sunCurrentSize / 2 + 20;
}

function resetGameState() {
  //Reset all variables if back to start
  centauriClicks = 0;
  animT = 0;
  shine = 0;
  showMap = false;

  pollutionSpots = [];

  apocalypseStarted = false;
  shakeStrength = 0;
  fadeAlpha = 0;
  showEndText = false;
  apocalypseTime = 0;
  apocalypsePhase = "none";

  showEarthText = false;
  earthTextStartTime = 0;

  earthColorChange = false;
  earthColorStartTime = 0;
  earthColorProgress = 0;

  sunClicks = 0;
  sunFlashIntensity = 0;
  sunExpanding = false;
  sunExpandStartTime = 0;
  sunBaseSize = 400;
  sunCurrentSize = 400;
  sunRedGiantProgress = 0;
  earthEngulfed = false;
  sunEngulfFadeAlpha = 0;

  apocalypseCompleted = false;

  alienAttackActive = false;
  laserBeams = [];
  earthExplosion = false;
  explosionParticles = [];
  explosionAlpha = 0;

  showEscapeOptions = false;
  spaceshipActive = false;
  engineActive = false;
  spaceshipT = 0;
  earthT = 0;
  escapeShipPos = null;
  escapeEnginePos = null;

  showEnding = false;
  endingType = "";

  mapExitButton = null;

   if (!cosmicBg.isPlaying()) {
    cosmicBg.loop();
    cosmicBg.setVolume(0.3);
  }

}


//MAP SCENE


function drawMapScene() {
  if (!showMap) return;

  let offsetX = 0;
  let offsetY = 0;
  if (apocalypseStarted && shakeStrength > 0 && apocalypsePhase === "fadeIn") {
    offsetX = random(-shakeStrength, shakeStrength);
    offsetY = random(-shakeStrength, shakeStrength);
  }

  imageMode(CENTER);
  noTint();
  image(
    img4,
    windowWidth * 0.5 + offsetX,
    windowHeight * 0.5 + offsetY,
    windowWidth,
    windowHeight
  );

  let activeCount = 0;
  for (let i = 0; i < pollutionSpots.length; i++) {
    if (!pollutionSpots[i].removed) activeCount++;
  }

  if (!apocalypseStarted && activeCount > 300) {
    apocalypseStarted = true;
    apocalypsePhase = "fadeIn";
    shakeStrength = 20;
    fadeAlpha = 0;
    showEndText = false;
    apocalypseTime = millis(); 
  }

  if ((!apocalypseStarted || apocalypsePhase === "fadeIn") && fadeAlpha < 255) {

    if (activeCount >= 5) { 
      for (let i = 0; i < pollutionSpots.length; i++) {
        if (!pollutionSpots[i].removed) {
          pollutionSpots[i].permanent = true;
        }
      }

      if (frameCount % 6 === 0) {
        let sources = [];
        for (let i = 0; i < pollutionSpots.length; i++) {
          if (!pollutionSpots[i].removed) {
            sources.push(pollutionSpots[i]);
          }
        }

        if (sources.length > 0) {
          let base = random(sources);

          let nx = base.x + random(-200, 200);
          let ny = base.y + random(-200, 200);

          nx = constrain(nx, 30, width - 30);
          ny = constrain(ny, 30, height - 30);

          pollutionSpots.push({
            x: nx,
            y: ny,
            baseSize: random(60, 100),
            life: 0,
            permanent: true,
            removed: false
          });
        }
      }
    }

    noStroke();
    fill(160, 70, 20, 180);

    for (let i = 0; i < pollutionSpots.length; i++) {
      let spot = pollutionSpots[i];
      if (spot.removed) continue;

      if (!spot.permanent) {
        spot.life += 0.005;
        if (spot.life >= 1 && activeCount < 5) {
          spot.removed = true;
          continue;
        }
      } else {
        spot.life += 0.003;
        spot.x += random(-0.3, 0.3);
        spot.y += random(-0.3, 0.3);
      }

      let t = constrain(spot.life, 0, 1);
      let radius;
      if (spot.permanent) {
        radius = spot.baseSize * 0.8;
      } else {
        if (t < 0.5) {
          radius = lerp(0, spot.baseSize, t * 2);
        } else {
          radius = lerp(spot.baseSize, spot.baseSize * 0.3, (t - 0.5) * 2);
        }
      }

      ellipse(spot.x + offsetX, spot.y + offsetY, radius);
    }
  }
//exit control
  let exitW = 120;
  let exitH = 40;
  let exitX = width - exitW - 30;
  let exitY = 30;

  push();
  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 150);
  rect(exitX, exitY, exitW, exitH, 8);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("EXIT", exitX + exitW / 2, exitY + exitH / 2);
  pop();

  //exit range detect control
  mapExitButton = { x: exitX, y: exitY, w: exitW, h: exitH };

  image(img5, mouseX, mouseY, 200, 100);
}


////AFTERMATH
function Apocalypse() {
  if (!apocalypseStarted || apocalypsePhase === "none") return;

  if (apocalypsePhase === "fadeIn" && shakeStrength > 0) {
    shakeStrength *= 0.97;
    if (shakeStrength < 0.5) {
      shakeStrength = 0;
    }
  }

  if (apocalypsePhase === "fadeIn") {
    fadeAlpha += FadeInSPEED;
    if (fadeAlpha >= 255) {
      fadeAlpha = 255;
      showEndText = true;
      apocalypsePhase = "hold";
      apocalypseTime = millis(); 
    }
  } else if (apocalypsePhase === "hold") {
    let elapsed = millis() - apocalypseTime;
    if (elapsed >= HoldDURATION) {
      apocalypsePhase = "fadeOut";
    }
   } else if (apocalypsePhase === "fadeOut") {
    fadeAlpha -= FadeOutSPEED;
    if (fadeAlpha <= 0) {
      fadeAlpha = 0;
      showEndText = false;
      apocalypsePhase = "none";
      apocalypseStarted = false;

      //go to pollution ending
      showEnding = true;
      endingType = "pollution";
    }
  }


  if (fadeAlpha > 0) {
    push();
    noStroke();
    fill(0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    pop();
  }

  if (showEndText && fadeAlpha > 0) {
    push();
    fill(255);
    textSize(36);
    text("Is This What The Future Looks Like?", width / 2, height / 2);
    
    if (apocalypsePhase === "hold") {
      let elapsed = millis() - apocalypseTime;
      let remaining = ceil((HoldDURATION - elapsed) / 1000);
      remaining = max(0, remaining);
      
      textSize(28);
      fill(200, 200, 200);
      text(remaining, width / 2, height / 2 + 60);
    }
    pop();
  }
}


////EARTH TEXT DISPLAY


function EarthText() {
  if (!showEarthText) return;
  
  let elapsed = millis() - earthTextStartTime;
  if (elapsed >= EarthTextDURATION) {
    showEarthText = false;
    return;
  }
  
  push();
  fill(255, 200, 100);
  textSize(32);
  
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;
  let earthX = width / 2 + dx * 0.1;
  let earthY = height / 2 + dy * 0.1;
  
  text("Where can we go now?", earthX, earthY - 120);
  pop();
}


//EARTH COLOR TRANSITION


function EarthColor() {
  if (!earthColorChange) return;
  
  let elapsed = millis() - earthColorStartTime;
  earthColorProgress = elapsed / EarthColourDURATION;
  earthColorProgress = constrain(earthColorProgress, 0, 1);
  
  if (earthColorProgress >= 1) {
    earthColorChange = false;
    earthColorProgress = 1; 
  }
}


////INTERACTION


function mousePressed() {

   if (!audioStarted) {
    userStartAudio();
    if (!cosmicBg.isPlaying()) {
      cosmicBg.loop();
      cosmicBg.setVolume(0.3);
    }
    audioStarted = true;
    
  }
  if (showEnding) {
    if (endingBackButton) {
      if (
        mouseX > endingBackButton.x &&
        mouseX < endingBackButton.x + endingBackButton.w &&
        mouseY > endingBackButton.y &&
        mouseY < endingBackButton.y + endingBackButton.h
      ) {
        resetGameState();
      }
    }
    return; //no reaction to other clicks
  }

  if (apocalypsePhase === "hold" || apocalypsePhase === "fadeIn") return;
  if (earthEngulfed) return;


  if (alienAttackActive) return; //NO click at attack //No Click at Ending
   if (alienAttackActive) return; //NO click at attack

 if (showMap) {
    //ExitClick
    if (mapExitButton) {
      if (
        mouseX > mapExitButton.x && mouseX < mapExitButton.x + mapExitButton.w && mouseY > mapExitButton.y && mouseY < mapExitButton.y + mapExitButton.h
      ) {
        showMap = false;  // back to space
        return;
      }
    }

    //add pollutionSpots on other place
    pollutionSpots.push({
      x: mouseX,
      y: mouseY,
      baseSize: 110,
      life: 0,
      permanent: false,
      removed: false
    });

     if (radioActive) {
      radioActive.play(); 
      radioActive.setVolume(1.0); 
    }
  } else {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
     //Detect AlienShip Top Priority
    if (isClickOnAlienShip(mouseX, mouseY) && !alienAttackActive) {
      alienAttackActive = true;
      laserBeams = [];

       if (alienLaser) {
      alienLaser.play(); 
      alienLaser.setVolume(1.0); 
    }
      return;
    }
    //Detect Sun 
    if (isClickOnSun(mouseX, mouseY) && !sunExpanding) {
      sunClicks++;
      sunFlashIntensity = 255;

       if (SunFlash && !SunFlash.isPlaying()) {
    SunFlash.play();
  }
      
      if (sunClicks >= 3 && !sunExpanding) {
        sunExpanding = true;
        sunExpandStartTime = millis();

        if (sunExpand) {
        sunExpand.play(); 
        sunExpand.setVolume(1.0); 
      }
        showEscapeOptions = true;
        spaceshipActive = false;
        engineActive = false;
        spaceshipT = 0;
        earthT = 0;
      }
      return;
    }

    //Escape option click
    if (showEscapeOptions && !earthEngulfed) {
      if (escapeShipPos && !spaceshipActive && !engineActive) {
        let dShip = dist(mouseX, mouseY, escapeShipPos.x, escapeShipPos.y);
        if (dShip < 50) {
          spaceshipActive = true;
          spaceshipT = 0;
          showEscapeOptions = false;
        }
      }
      if (escapeEnginePos && !spaceshipActive && !engineActive) {
        let dEngine = dist(mouseX, mouseY, escapeEnginePos.x, escapeEnginePos.y);
        if (dEngine < 50) {
          engineActive = true;
          earthT = 0;
          showEscapeOptions = false;
        }
      }
    }

    //Centauri Click
    let centauriBaseX = width - 100;
    let centauriBaseY = 100;
    if (
      mouseX > centauriBaseX - 200 && mouseX < centauriBaseX + 200 &&
      mouseY > centauriBaseY - 200 && mouseY < centauriBaseY + 200
    ) {
      centauriClicks++;
      if (centauriClicks == 2) animT = 0;
    }

    //Enter Map
    let earthX = width / 2 + dx * 0.1;
    let earthY = height / 2 + dy * 0.1;
    let d = dist(mouseX, mouseY, earthX, earthY);
    if (d < 80 && !apocalypseCompleted) {
      showMap = true;
    }
  }
}
//Dectect Click on AlienShip
function isClickOnAlienShip(mx, my) {
  if (centauriClicks < 2 || animT < 1) return false;
  
  let dx = mx - width / 2;
  let dy = my - height / 2;
  
  let centauriBaseX = width / 2 + (mouseX - width / 2) * 0.05 + 4/10 * width;
  let centauriBaseY = height / 2 + (mouseY - height / 2) * 0.05 - 4/10 * height;
  
  let earthBaseX = width / 2 + dx * 0.1;
  let earthBaseY = height / 2 + dy * 0.1;
  
  let shipX = lerp(centauriBaseX, earthBaseX + 100, animT) + dx * 0.11;
  let shipY = lerp(centauriBaseY, earthBaseY - 100, animT) + dy * 0.11;
  
  let shipW = lerp(30, 300, animT);
  let shipH = lerp(16, 160, animT);
  
  return abs(mx - shipX) < shipW / 2 && abs(my - shipY) < shipH / 2;
}

//DrawLaser
function drawLaserAttack() {
  if (!alienAttackActive) return;
  
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;
  
  let centauriBaseX = width / 2 + (mouseX - width / 2) * 0.05 + 4/10 * width;
  let centauriBaseY = height / 2 + (mouseY - height / 2) * 0.05 - 4/10 * height;
  
  let earthBaseX = width / 2 + dx * 0.1;
  let earthBaseY = height / 2 + dy * 0.1;
  
  let shipX = lerp(centauriBaseX, earthBaseX + 100, 1) + dx * 0.11;
  let shipY = lerp(centauriBaseY, earthBaseY - 100, 1) + dy * 0.11;
  
  //drawLaser
  if (frameCount % 3 === 0 && laserBeams.length < 20) {
    laserBeams.push({
      x: shipX,
      y: shipY,
      targetX: earthBaseX,
      targetY: earthBaseY,
      progress: 0,
      thickness: random(3, 8)
    });
  }
  
  //drawlaser
  for (let i = laserBeams.length - 1; i >= 0; i--) {
    let laser = laserBeams[i];
    laser.progress += 0.08;
    
    if (laser.progress >= 1) {
      laserBeams.splice(i, 1);
      continue;
    }
    
    let currentX = lerp(laser.x, laser.targetX, laser.progress);
    let currentY = lerp(laser.y, laser.targetY, laser.progress);
    
    push();
    strokeWeight(laser.thickness);
    stroke(255, 50, 50, 200);
    line(laser.x, laser.y, currentX, currentY);
    
    //laser halo
    strokeWeight(laser.thickness * 2);
    stroke(255, 100, 100, 100);
    line(laser.x, laser.y, currentX, currentY);
    pop();
  }
  
  //explode after 30 frame
  if (alienAttackActive && frameCount % 60 === 0 && !earthExplosion) {
    earthExplosion = true;
    createExplosion(earthBaseX, earthBaseY);
  }
}

//create explosion particles
function createExplosion(x, y) {
  for (let i = 0; i < 100; i++) {
    let angle = random(2 * PI);
    let speed = random(2, 10);
    explosionParticles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(5, 20),
      life: 255,
      color: random() > 0.5 ? color(255, 150, 50) : color(255, 80, 20)
    });
  }
}

//draw explosion effect
function drawEarthExplosion() {
  if (!earthExplosion) return;
  
  //draw and update explosion particles
  for (let i = explosionParticles.length - 1; i >= 0; i--) {
    let p = explosionParticles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    //p.vy += 0.2; //fall down
    p.life -= 3;
    
    if (p.life <= 0) {
      explosionParticles.splice(i, 1);
      continue;
    }
    
    push();
    noStroke();
    fill(red(p.color), green(p.color), blue(p.color), p.life);
    ellipse(p.x, p.y, p.size);
    pop();
  }
  
  //Go to Ending after explosion
  if (explosionParticles.length < 20 && explosionAlpha < 255) {
    explosionAlpha += 3;
  }
  
  if (explosionAlpha > 0) {
    push();
    noStroke();
    fill(0, explosionAlpha);
    rect(0, 0, width, height);
    pop();
  }
  
  //Go to Alien ending
  if (explosionAlpha >= 255 && !showEnding) {
    showEnding = true;
    endingType = "alien";
  }
}
