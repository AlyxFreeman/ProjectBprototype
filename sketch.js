let score = 0;
function preload() {
  img = loadImage("assets/wp9189738.jpg")
  img1 = loadImage("assets/Earth.png")
}

function setup() {
  let canvas = createCanvas(1000, 600);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  textAlign(CENTER, CENTER);
  textSize(18);
  
  
}

function draw() {
  background(220);
  
  let imageX = map(mouseX, 0, 600, 320,280)
  let imageY = map(mouseY, 0, 1000, 200, 170)
imageMode(CENTER)
filter(BLUR,0)
  tint(150,150,150)
image(img, imageX + 200, imageY, 1500, 1000)
  

  let g = map(score, -5, 5, 80, 200); 
  let b = map(score, -5, 5, 80, 255); 
  let earthX = map(mouseX, 0, 1000, width*4/10, width*6/10);
  let earthY = map(mouseY, 0, 400, 170, 200)
 image(img1, earthX + 50, earthY + 100, 150,150)
  fill(0, g, b);
  

  


}
  
