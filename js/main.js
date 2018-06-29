function initiate() {
  var elem = document.getElementById("myCanvasGame");
  var imgPlayer = new Image();
  imgPlayer.src = "images/myspaceship.png";
  var imgEnemy = new Image();

  //Defining the global veriables
  myCanvasGame = elem.getContext("2d");
  gameRunning = true;
  player = new GameObject(250, 480, myCanvasGame, 3, imgPlayer);
  objectArray = [];
  bulletArray = [];
  enemyBulletArray = [];
  leftKeyDown = false;
  rightKeyDown = false;
  spaceBarDown = false;
  reverse = false;
  score = 0;

  document.addEventListener("keydown", keyDown, false);
  document.addEventListener("keyup", keyUp, false);

  //This section is for the number of alien enemies per row.
  //First row.
  for (var i = 0; i < 7; i++) {
    imgEnemy.src = "images/aliens3.png";
    var enemy = new GameObject(i * 70 + 75, 20, myCanvasGame, 1, imgEnemy);
    objectArray.push(enemy);
  }

  //Second row of alien enemies.
  for (i = 0; i < 5; i++) {
    imgEnemy.src = "images/aliens3.png";
    var enemy = new GameObject(i * 70 + 140, 100, myCanvasGame, 1, imgEnemy);
    objectArray.push(enemy);
  }

  //Third row of alien enemies.
  for (i = 0; i < 3; i++) {
    imgEnemy.src = "images/aliens3.png";
    var enemy = new GameObject(i * 70 + 210, 180, myCanvasGame, 1, imgEnemy);
    objectArray.push(enemy);
  }

  setInterval(gameLoop, 33);
}
window.addEventListener("load", initiate, false);

//Main game loop
function gameLoop() {
  myCanvasGame.clearRect(0, 0, 600, 600);

  //Updates enemies
  for (i = 0; i < objectArray.length; i++) {
    var object = objectArray[i];
    if (object.getXCord() > 500) {
      reverse = true;
    }
    if (object.getXCord() < 40) {
      reverse = false;
    }
    if (reverse) {
      object.setXCord(object.getXCord() - 2);
    }
    else {
      object.setXCord(object.getXCord() + 2);
    }
    if (object.getHealth() <= 0) {
      delete objectArray[i];
      objectArray.splice(i, 1);
      console.log("Removing object");
    }
    object.update();
  }

  //Updates player
  if (player.getXCord() < 40) {
    if (rightKeyDown) {
      player.setXCord(player.getXCord() + 4);
    }
    if (spaceBarDown) {
      var imgBullet = new Image();
      imgBullet.src = "images/bullet.png";
      var bullet = new Bullet(player.getXCord() + 17, player.getYCord() + 20, myCanvasGame, 1, imgBullet);
      bulletArray.push(bullet);
      bullet.update();
      spaceBarDown = false;
    }
  }
  else if (player.getXCord() > 500) {
    if (leftKeyDown) {
      player.setXCord(player.getXCord() - 4);
    }
    if (spaceBarDown) {
      var imgBullet = new Image();
      imgBullet.src = "images/bullet.png";
      var bullet = new Bullet(player.getXCord() + 17, player.getYCord() + 10, myCanvasGame, 1, imgBullet);
      bulletArray.push(bullet);
      bullet.update();
      spaceBarDown = false;
    }
  }
  else {
    if (leftKeyDown) {
      player.setXCord(player.getXCord() - 4);
    }
    else if (rightKeyDown) {
      player.setXCord(player.getXCord() + 4);
    }
    if (spaceBarDown) {
      var imgBullet = new Image();
      imgBullet.src = "images/bullet.png";
      var bullet = new Bullet(player.getXCord() + 20, player.getYCord() - 20, myCanvasGame, 1, imgBullet);
      bulletArray.push(bullet);
      bullet.update();
      spaceBarDown = false;
    }
  }

  player.update();

  //Updates the bullets.
  for (i = 0; i < bulletArray.length; i++) {
    var currentBullet = bulletArray[i];
    currentBullet.setYCord(currentBullet.getYCord() - 4);

    if (currentBullet.getYCord() < 5) {
      delete bulletArray[i];
      bulletArray.splice(i, 1);
    }

    for (x = 0; x < objectArray.length; x++) {
      var currentEnemy = objectArray[x];
      var xcord = currentEnemy.getXCord();
      var xedge = xcord + 50;
      var ycord = currentEnemy.getYCord();
      var yedge = ycord + 50;
      if ((currentBullet.getXCord() > xcord) && (currentBullet.getXCord() < xedge) && (currentBullet.getYCord() > ycord) && (currentBullet.getYCord() < yedge)) {
        delete bulletArray[i];
        bulletArray.splice(i, 1);
        currentEnemy.takeDamage();
        score++;
      }
    }
    currentBullet.update();
  }

  //This Updates the games score.
  var output = document.getElementById("output");
  output.innerHTML = "Your score: " + score;
}

//Keys where the spaceship moves and shoots on keyDown.
function keyDown(e) {
  var keyCode = e.keyCode;

  switch (keyCode) {
    case 37:
      leftKeyDown = true;
      break;
    case 39:
      rightKeyDown = true;
      break;
    case 32:
      spaceBarDown = true;
      break;
  }
}

//Keys where the spaceship moves and shoots on keyUp.
function keyUp(e) {
  var keyCode = e.keyCode;
  switch (keyCode) {
    case 37:
      leftKeyDown = false;
      break;
    case 39:
      rightKeyDown = false;
      break;
    case 32:
      spaceBarDown = false;
      setTimeout(keyDown, 20);
      break;
  }
}
//Objects
function GameObject(x, y, c, hp, i) {
  this.xcord = x;
  this.ycord = y;
  this.oldxcord = 0;
  this.myCanvasGame = c;
  this.health = hp;
  this.image = i;
}
GameObject.prototype.setXCord = function (x) {
  if (x <= 600 && x >= 0) {
    this.oldxcord = this.xcord;
    this.xcord = x;
  }
  else {
    console.error("Error: invalid x cord.");
  }
};
GameObject.prototype.getXCord = function () {
  return this.xcord;
};
GameObject.prototype.setYCord = function (y) {
  if (y <= 600 && y >= 0) {
    this.oldycord = this.ycord;
    this.ycord = y;
  }
  else {
    console.error("Error: invalid y cord.");
  }
};
GameObject.prototype.getYCord = function () {
  return this.ycord;
};
GameObject.prototype.setHealth = function (h) {
  if (h >= 0) {
    this.health = h;
  }
};
GameObject.prototype.getHealth = function () {
  return this.health;
};
GameObject.prototype.takeDamage = function () {
  this.health = this.health - 1;
};
GameObject.prototype.update = function () {
  this.myCanvasGame.drawImage(this.image, this.xcord, this.ycord, 50, 50);
};

//Bullets Constuctor
function Bullet(x, y, c, hp, i) {
  GameObject.call(x, y, c, hp, i);
  this.xcord = x;
  this.ycord = y;
  this.myCanvasGame = c;
  this.health = hp;
  this.image = i;
}

//Bullets Prototype upDate, Function, Bullet Sizes, drawn on the canvas game board.
Bullet.prototype = new GameObject();
Bullet.prototype.update = function () {
  this.myCanvasGame.drawImage(this.image, this.xcord, this.ycord, 10, 10);
};

//Enemies firing bullets.
function createEnemyBullets(enemy) {
  this.xcord = x;
  var imgEnemy = new Image();
  var enemyBullets = new GameObject();

  return imgEnemy.imgBullet(x, y, c, hp, i).push(enemy).enemy.bullets.push(Bullet);
}
createEnemyBullets();

//Working on the game themes sound.
function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = myMusic = new Sound("backgroundmusic.mp3");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  // this.stop = function(){
  //this.sound.pause();
  //}
}

sound();

//Game thing music
function startGame() {
  var myMusic;
  myMusic = new Sound("backgroundmusic.mp3");
  myMusic.play();
  myGameArea.start();
}
startGame(myMusic.play());

//End of the game. Want to create an end game now button, plus a few more features as well.
//function exit() {
//}

//Notes for creating the next block of code for 
//the aliens firing randomly, from each row,
//back at the players ship.

/*cr fctn like shoot protoype of enemy 
its going to create new bullet
push that bullet into big array OF bullets
at and only for one bullet per enemy
only one shooting
create the bullet at the bottom at the center of the x and y height of the enemy
write a set interval that like whatever twice every Sec
add like 5 to the y value of the bullet 

last piece is:
go into your main game loop
loop over the array of bullets
then draw over while its in the loop
compile thought logic into js Code when creating the above code, 
per Verbal Processing Instructions from Software Development Instructor.*/
