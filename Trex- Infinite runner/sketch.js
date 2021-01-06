var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,over,overImg,start,startImg,check,die,jump;


function preload(){
  trex_running = loadAnimation("trex_1.png","trex_3.png","trex_4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  overImg=loadImage("gameOver.png");
startImg=loadImage("restart.png");
  
  check=loadSound("checkPoint.mp3");
  die=loadSound("die.mp3") ;   
  jump=loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.1;

  
  
  invisibleGround = createSprite(200,170,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,50);
 // trex.debug = true;
  
  score = 0
  
  
  over=createSprite(300,50,50,10);
  over.addImage("over1",overImg);
 
  
  start=createSprite(300,100,20,20);
  start.addImage("restart",startImg);
  start.scale=0.5;
 
}

function draw() {
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log(frameRate());
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+score/100);
    
     if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //scoring
    score = score +Math.round(frameRate()/60) ;

    //if(keyPressed(UP_ARROW)){

   //   trex.velocityX=3;
   // }      
    
     //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=150) {
        trex.velocityY = -13;
        
      
    }
    if(keyDown("up")) {
      trex.velocityX=3;
    
 }
 if(keyDown("down")) {
  trex.velocityX=-3;

}
camera.position.x = trex.x
camera.position.y = trex.y

    
    if(score %100===0 && score>0){
      
      check.play();
    }
    
     over.visible=false;
     start.visible=false;
    
   if(keyWentDown("space")){
      jump.play();
    }
    
   
   
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    
    
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        die.play();
     // trex.velocityY=-9;
     // jump.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-2);
     cloudsGroup.setLifetimeEach(-2);
     trex.changeAnimation("collided",trex_collided);
     trex.velocityX=0;
     trex.velocityY=0;
     
     over.visible=true;
     start.visible=true;
     
     if(mousePressedOver(start)){
       restart();
     }
     
     
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount %60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(4 + score/100);
   
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 180;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function restart(){
  
  gameState=PLAY;
  obstaclesGroup.destroyEach();  
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
   score=0; 
}

