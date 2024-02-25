var score = 0
var gamestate = 0
var start = 0
var play = 1
var end = 2
var win = 3
var bosshits = 0
var theme



function preload(){
//loading boss music
bossmusic = loadSound("bossfight.mp3")

//loading background
backgroundImg = loadImage("background.png")

//loading asteroids
asteroidImg = loadImage("asteroid.png")
alienBossImg = loadImage("saul.jpg")


//loading amogus
astronautImg = loadImage("amogus.png")
}

function setup() {
//loadinging music
theme = loadSound("theme.mp3", loaded)
//loading canvas
createCanvas(windowWidth, windowHeight)

//making the background
backround=createSprite(windowWidth/2, windowHeight/2, windowWidth, windowHeight)
backround.addImage(backgroundImg)
backround.scale=1.4

//scrolling background
backround.velocityX=-15

//making amogus
astronaut = createSprite(windowWidth/19, windowHeight/2, 20, 50)
astronaut.addImage(astronautImg)
astronaut.debug=true
astronaut.scale=0.3


//creating groups
asteroidGroup = createGroup()
beamGroup = createGroup()
alienBossGroup = createGroup()
bulletGroup = createGroup()


//displaying health bar
healthbackround=createSprite(windowWidth/2, 50, 1000, 20)
health=createSprite(healthbackround.x-(bosshits*33.333), 50, 1000-(bosshits*66.6667), 20)
health.shapeColor=("red")

//making game over and restart
 
}

function loaded(){
  theme.loop()
}


function draw() {     
 background(180)
 drawSprites()
 console.log(World.mouseY)

 //scrolling background
 if (backround.x<windowWidth/6){
  backround.x = backround.width/2
}

health.width=1000-(bosshits*66.6667)
health.x=healthbackround.x-(bosshits*33.333)

 

 //tutorial
 if (gamestate===start){
   healthbackround.visible=false
   health.visible=false
   astronaut.visible=false
   backround.velocityX=0
   fill("white")
   textSize(30)
   text("Welcome to ______", windowWidth/2-windowWidth/11, windowHeight/2-30)
   text("Use the cursor to control the height of the astronaut, use space to shoot lasers.", windowWidth/2-windowWidth/5, windowHeight/2+30)
   text("Press space to continue!", windowWidth/2-windowWidth/11, windowHeight/2+80)

 if (keyWentDown("SPACE")){
   gamestate=play
 }
 }


 if (gamestate === play){
//resseting from tutorial
astronaut.visible=true
backround.velocityX=-30-(score*2) 

//barrier 
 if (astronaut.y>=windowHeight-40){
  astronaut.velocityY=0
}
 if (astronaut.y<=0){
  astronaut.velocityY=1
}

 //movement
 astronaut.y=World.mouseY



 
 //showing the score
 fill("blue")
 textSize((windowWidth+windowHeight)*0.016)
 text("Score: "+ score, windowWidth/2-50, windowHeight-6)

 
 //asteroids destroyed by beams
 if (beamGroup.isTouching(asteroidGroup)){
 asteroidGroup.setLifetimeEach(-1)
 asteroidGroup.setVisibleEach(false)
 asteroidGroup.destroyEach()
 beamGroup.setLifetimeEach(-1)
 beamGroup.setVisibleEach(false)
 score=score+1
 }

 //astronaut destroyed by asteroid
 if (astronaut.isTouching(asteroidGroup)){
 astronaut.lifetime=-1
 astronaut.visible=false
 gamestate=end
 backround.velocityX=0
 }

 //astronaut destroyed by boss bullets
 if(astronaut.isTouching(bulletGroup)){
  astronaut.lifetime=-1
  astronaut.visible=false
  gamestate=end
  backround.velocityX=0
 }




 //asteroid boss health
 if (beamGroup.isTouching(alienBossGroup)){
 bosshits=bosshits+1
 beamGroup.destroyEach()
 }

 if (bosshits>=15){
 alienBossGroup.destroyEach()
 gamestate = win
 }

 

 if (bosshits===15){
   health.visible=false
 }

 if (score>=10){
   health.visible=true
   healthbackround.visible=true
   backround.velocityX=-60
 }

 

 

 
 
 console.log(windowWidth/6)
 console.log(bosshits)
 spawnAsteroids()
 shooting()
 spawnAlienboss()
 }

 //gameover
 else if(gamestate === end){
 fill("orange")
 textSize(40)
 text("GAME OVER!", windowWidth/2-windowWidth/11, windowHeight/2)
 }

 //victory
 if(gamestate === win){
 astronaut.velocityX=3
 fill("125, 183, 255")
 textSize(50)
 text("You win!", windowWidth/2-windowWidth/11, windowHeight/2)
 healthbackround.visible=false
 backround.velocityX=-10
 }
 
}

function spawnAsteroids(){
 if ((frameCount % 25 === 0)&&score<=10){
   if (gamestate===play){
    var asteroid = createSprite(windowWidth-windowWidth/20, (random(windowHeight-windowHeight/11, 30)), 80, 80)
    asteroid.velocityX=-windowWidth/25
    asteroid.scale=0.4
    asteroid.addImage(asteroidImg)
    asteroid.rotation=25
    asteroid.setCollider("circle",0,0,150);
    asteroid.debug = false

    //add each planet to the group
    asteroidGroup.add(asteroid)
   }

 }
}

function shooting(){
 if (keyWentDown("SPACE")){
 beam = createSprite(astronaut.x+10, astronaut.y, 30, 20)
 beam.velocityX = 65
 beam.shapeColor = "purple"
 beamGroup.add(beam)
 beam.debug=true
 } 
}

function spawnAlienboss(){
 if ((score>=10)&&frameCount % 1 === 0){

 
 if (bosshits<=14){
 alienBoss = createSprite((windowWidth-windowWidth/7),windowHeight/2, 120, 120)
 alienBoss.addImage(alienBossImg)
 alienBoss.scale=3
 alienBoss.lifetime=2
 asteroidGroup.destroyEach()
 alienBossGroup.add(alienBoss)
 alienBoss.y=astronaut.y
 
 
 

 if (frameCount % 7 ===0){
 bullet = createSprite(alienBoss.x-20, alienBoss.y, 60, 20)
 bullet.velocityX = -60
 bullet.shapeColor="red"
 bulletGroup.add(bullet)
     }
 
     

   }
 }
 
 if (score===10){
 theme.stop()
 bossmusic.loop()
 score=score+1
 }

}

