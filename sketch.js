var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood, foodDog;
var foodObj;
var feed;
var lastFed;
var timeofday;
var foodAmt;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}


function updateLastFed() {

  lastFed = hour();

  database.ref('/').update({

    FeedTime:lastFed

  });


}

function updateTime() {

  if (lastFed >= 12) {

    lastFed = lastFed - 12;

    timeofday = "PM";

  }

  else{

    timeofday = "AM";

  }

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here\
  foodDog = createButton("Feed the dog");
  foodDog.position(700,95);
  foodDog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  updateLastFed();
  updateTime();

}

function draw() {
  background(46,139,87);

  fill("white");
  text("Last feed : " + lastFed + " " + timeofday, 350, 30);

  foodObj.display();

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  foodAmt = foodObj.getFoodStock();

  if (foodAmt <= 0) {

    foodObj.updateFoodStock(foodAmt * 0);

  }

  else {

    foodObj.updateFoodStock(foodAmt - 1);

  }

  database.ref('/').update({

    Food:foodAmt

  });

  updateLastFed();
  updateTime();

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}