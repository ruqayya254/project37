//Create variables here
var dog,happyDog;
var dogImg,happyDogImg;
var dataBase;
var foodS,foodStock;

var database;

var feedButton, addButton;
var lastFed;
var foodObj;

function preload(){
  //load images here
  dogImg = loadImage('images/Dog.png');
  happyDogImg = loadImage('images/happydog.png')
}

function setup() {
  var canvas = createCanvas(900, 500);
  database = firebase.database();

  dog = createSprite(650,300,10,10);
  dog.addImage(dogImg)
  dog.scale = 0.5;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val;
  })
  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val()
  })
  feedButton = createButton("Feed Dog");
  addButton = createButton("Add Food");

  feedButton.position(100,180);
  addButton.position(200,180);

  feedButton.mousePressed(feedDog);
  addButton.mousePressed(addFood);

  foodObj = new Food();
}


function draw() {  
  background(46, 139, 87);
  
  //add styles here

  database.ref('FeedTime').on("value",readTime);

  foodObj.display();

  drawSprites();

  fill(0);
  textSize(25);
  text("Food Stock: "+foodS,30,120);

  if(lastFed>=12){
  text("Last Fed: "+lastFed%12 + " PM",50,50);
  }else if(lastFed===0){
    text("Last Fed: 12AM",50,50);
  }else{
    text("Last Fed: "+lastFed + "AM",50,50);
  }

}

//function to read and write food stock from database
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function readTime(data){
  lastFed = data.val();
}

//function to write values in database

function feedDog(){

  dog.addImage(happyDogImg);

  if(foodS<=0){
    foodS=0;
    }else{
      foodS = foodS-1;
    }
  
  database.ref('/').update({
    FeedTime:hour(),
    Food:foodS
  })
}

function addFood(){

  foodS = foodS+1;

  database.ref('/').update({
    Food:foodS
  })

}

  