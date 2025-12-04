let img, img1, img2, img3, img4, img5;

let centauriClicks = 0;
let animT = 0;
let shine = 0;
let showMap = false;

//pollution spots array{x, y, baseSize, life, permanent, removed}
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
const EARTH_TEXT_DURATION = 5000; 

//earth color transition
let earthColorChange = false;   
let earthColorStartTime = 0;    
let earthColorProgress = 0;     
const EARTH_COLOR_DURATION = 10000; 

//blackout timing
const FADE_IN_SPEED = 3;        
const HOLD_DURATION = 10000;    
const FADE_OUT_SPEED = 3;       
//assets
function preload() {
  img  = loadImage("assets/wp9189738.jpg");
  img1 = loadImage("assets/Earth.png");
  img2 = loadImage("assets/Centauri.png");
  img3 = loadImage("assets/AlienShip.png");
  img4 = loadImage("assets/MapScene.png");
  img5 = loadImage("assets/Radioactive.png");
}
//foundation
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(220);

  if (showMap) {
    noCursor(); 
    drawMapScene();
  } else {
    cursor(); 
    drawSpaceScene();
  }

  //end-of-world
  Apocalypse();
  
  //text above earth
  EarthText();
  
  //earth color fade
  EarthColor();
}

//SPACE SCENE//

function drawSpaceScene() {
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;

  //background
  let bgX = width / 2 - dx * 0.05;
  let bgY = height / 2 - dy * 0.05;
  tint(150, 150, 150);
  image(img, bgX, bgY, windowWidth + 500, windowHeight + 500);
  noTint();

  //Earth
  let earthX = width / 2 + dx * 0.1;
  let earthY = height / 2 + dy * 0.1;
  
  //color tint based on pollution
  if(earthColorProgress > 0) {
    let r = lerp(255, 160, earthColorProgress);
    let g = lerp(255, 100, earthColorProgress);
    let b = lerp(255, 60, earthColorProgress);
    tint(r, g, b);
  }
  
  image(img1, earthX, earthY, 150, 150);
  noTint();

  //Centauri system
  let centauriBaseX = width - 100;
  let centauriBaseY = 100;
  let centauriX = centauriBaseX - dx * 0.05;
  let centauriY = centauriBaseY - dy * 0.05;
  shine += 0.05;

  let brightness = 127.5 + sin(shine) * 127.5;
  tint(255, brightness);
  image(img2, centauriX, centauriY, 400, 400);
  noTint();

  //warning
  if (centauriClicks == 1) {
    fill(255, 0, 0);
    textSize(32);
    text("DO NOT RESPOND!", width / 2, height / 2 - 200);
  }

  //alien ship
  if(centauriClicks >= 2 && animT < 1) {
    animT += 0.02;
  }
  if(centauriClicks >= 2) {
    let t = constrain(animT, 0, 1);
    let shipBaseX = lerp(centauriX, earthX + 100, t);
    let shipBaseY = lerp(centauriY, earthY - 100, t);
    let shipX = shipBaseX + dx * 0.11;
    let shipY = shipBaseY + dy * 0.11;
    let shipW = lerp(30, 300, t);
    let shipH = lerp(16, 160, t);
    image(img3, shipX, shipY, shipW, shipH);
  }
}

//MAP SCENE//

function drawMapScene() {
  if (!showMap) {
    return;
  }

  //shake effect
  let offsetX = 0;
  let offsetY = 0;
  if(apocalypseStarted && shakeStrength > 0 && apocalypsePhase === "fadeIn") {
    offsetX = random(-shakeStrength, shakeStrength);
    offsetY = random(-shakeStrength, shakeStrength);
  }

  imageMode(CENTER);
  noTint();
  image(img4, windowWidth * 0.5 + offsetX, windowHeight * 0.5 + offsetY, 
        windowWidth, windowHeight);

  //count pollution spots
  let activeCount = 0;
  for(let i = 0; i < pollutionSpots.length; i++) {
    if(!pollutionSpots[i].removed) activeCount++;
  }

  //apocalypse
  if(!apocalypseStarted && activeCount > 300) {
    apocalypseStarted = true;
    apocalypsePhase = "fadeIn";
    shakeStrength = 20;
    fadeAlpha = 0;
    showEndText = false;
    apocalypseTime = millis(); 
  }

  
  if((!apocalypseStarted || apocalypsePhase === "fadeIn") && fadeAlpha < 255) {

    //random spread
    if(activeCount >= 5) { 
      for(let i = 0; i < pollutionSpots.length; i++) {
        if(!pollutionSpots[i].removed) {
          pollutionSpots[i].permanent = true;
        }
      }

      //auto pollution
      if(frameCount % 6 === 0) {
        let sources = [];
        for(let i = 0; i < pollutionSpots.length; i++) {
          if(!pollutionSpots[i].removed) {
            sources.push(pollutionSpots[i]);
          }
        }

        if(sources.length > 0) {
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

    //draw all pollution spots
    noStroke();
    fill(160, 70, 20, 180);

    for(let i = 0; i < pollutionSpots.length; i++) {
      let spot = pollutionSpots[i];
      if(spot.removed) continue;

      if(!spot.permanent) {
        spot.life += 0.01;
        if(spot.life >= 1 && activeCount < 5) {
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
      if(spot.permanent) {
        radius = spot.baseSize * 0.8;
      } else {
        if(t < 0.5) {
          radius = lerp(0, spot.baseSize, t * 2);
        } else {
          radius = lerp(spot.baseSize, spot.baseSize * 0.3, (t - 0.5) * 2);
        }
      }

      ellipse(spot.x + offsetX, spot.y + offsetY, radius);
    }
  }

  //cursor
  image(img5, mouseX, mouseY, 200, 100);
}

//AFTERMATH//
function Apocalypse() {
  if(!apocalypseStarted || apocalypsePhase === "none") {
    return;
  }

  //reduce shake 
  if(apocalypsePhase === "fadeIn" && shakeStrength > 0) {
    shakeStrength *= 0.97;
    if(shakeStrength < 0.5) {
      shakeStrength = 0;
    }
  }

  //phase state
  if(apocalypsePhase === "fadeIn") {
    fadeAlpha += FADE_IN_SPEED;
    if(fadeAlpha >= 255) {
      fadeAlpha = 255;
      showEndText = true;
      apocalypsePhase = "hold";
      apocalypseTime = millis(); 
    }
  } else if(apocalypsePhase === "hold") {
    let elapsed = millis() - apocalypseTime;
    if(elapsed >= HOLD_DURATION) {
      apocalypsePhase = "fadeOut";
    }
  } else if(apocalypsePhase === "fadeOut") {
    fadeAlpha -= FADE_OUT_SPEED;
    if(fadeAlpha <= 0) {
      fadeAlpha = 0;
      showEndText = false;
      apocalypsePhase = "none";
      apocalypseStarted = false;

      //reset 
      showMap = false;
      pollutionSpots = [];
      
      //earth text & color change
      showEarthText = true;
      earthTextStartTime = millis();
      
      earthColorChange = true;
      earthColorStartTime = millis();
      earthColorProgress = 0;
    }
  }

  //blackout
  if(fadeAlpha > 0) {
    push();
    noStroke();
    fill(0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    pop();
  }

  //main text & countdown
  if(showEndText && fadeAlpha > 0) {
    push();
    fill(255);
    textSize(36);
    text("Is this what the future looks like?", width / 2, height / 2);
    
    if(apocalypsePhase === "hold") {
      let elapsed = millis() - apocalypseTime;
      let remaining = ceil((HOLD_DURATION - elapsed) / 1000);
      remaining = max(0, remaining);
      
      textSize(28);
      fill(200, 200, 200);
      text(remaining + "s", width / 2, height / 2 + 60);
    }
    pop();
  }
}

//EARTH TEXT DISPLAY//

function EarthText() {
  if(!showEarthText) {
    return;
  }
  
  let elapsed = millis() - earthTextStartTime;
  if(elapsed >= EARTH_TEXT_DURATION) {
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
  if(!earthColorChange) {
    return;
  }
  
  let elapsed = millis() - earthColorStartTime;
  earthColorProgress = elapsed / EARTH_COLOR_DURATION;
  earthColorProgress = constrain(earthColorProgress, 0, 1);
  
  if(earthColorProgress >= 1) {
    earthColorChange = false;
    earthColorProgress = 1; 
  }
}

//INTERACTION//

function mousePressed() {
  // disable input during blackout
  if(apocalypsePhase === "hold" || apocalypsePhase === "fadeIn") {
    return;
  }

  if(showMap) {
    // spawn pollution on click
    pollutionSpots.push({
      x: mouseX,
      y: mouseY,
      baseSize: 110,
      life: 0,
      permanent: false,
      removed: false
    });

  } else {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;

    //trigger ship
    let centauriBaseX = width - 100;
    let centauriBaseY = 100;
    if(mouseX > centauriBaseX - 200 && mouseX < centauriBaseX + 200 &&
       mouseY > centauriBaseY - 200 && mouseY < centauriBaseY + 200) {
      centauriClicks++;
      if(centauriClicks == 2) animT = 0;
    }

    //enter map
    let earthX = width / 2 + dx * 0.1;
    let earthY = height / 2 + dy * 0.1;
    let d = dist(mouseX, mouseY, earthX, earthY);
    if(d < 80) {
      showMap = true;
    }
  }
}
