$(document).ready(function() {

    //run game
    game.start();

});

//draw the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

// ###############################
//  Game Objects & Containers
// ###############################

//global player object 
var player = new Player();

//# of enemies
e = 3;

//creates an array for game objects
var gameElements = new Array();

//get random integer
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//add game objects to an array
function getElements() {
    //add player to game element array
    gameElements.push(player);
    var numOfEnemies = 0;

    //primary key of enemy
    var rID = 1;

    //check if element has those coordinates already
    while (numOfEnemies < e) {

        var n = 0;

        // instanciate enemies in random places on the board with random radiuses
        var rX = getRandomInteger(75, 1700);
        var rY = getRandomInteger(75, 600);
        var rR = getRandomInteger(10, 20);

        var tempEnemy = new Enemy(rX, rY, rR, rID);

        //do a collision test
        var collision = tempEnemy.collisionDetect(gameElements[n]);

        if (!collision) {
            numOfEnemies++
            //add enemy to the array
            gameElements.push(tempEnemy);
            //incriment unique id
            rID++
        }
    n++
    }
}

//##############################
// Game constructor
//##############################

//game world boundries - swap out h & w when you decided on a world size
var Game = function(x, y, h, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.h = h || 700;
    this.w = w || 1800;
    this.intervalHandle = null;

};

Game.prototype.draw = function() {
    if (player.death == true) {
        console.log("Players is dead, stop drawing");
        return;
    }
    //clear and then draw canvas & game elements        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var c = 0; c < gameElements.length; c++) {

        //draw enemy element on canvas
        gameElements[c].draw();
    }
};

//Score Card - How many Enemies has the player killed?
var playerKills = 0;

Game.prototype.update = function(dt) {
    //update positions of game elements
    for (var d = 0; d < gameElements.length; d++) {
        //check if element is dead or not
        if (gameElements[d].death == true) {
            //if dead, remove enemy from array
            gameElements.splice(d, 1);
            playerKills++
        } else if (gameElements[d].length == 1) {
            return;
        } else {
            gameElements[d].update(dt);
        }
    }
}

//runs the game (gets elements, draws game elements, updates game elements) @ 50 FPS
Game.prototype.run = function() {
    //get arrow key types
    keyPosition();

    //get game objects
    getElements();

    //frames per second
    FPS = 50;

    //####### Below code is for debugging #########
    this.step = function() {
            Game.prototype.update(1 / FPS);
            Game.prototype.draw();
        }
        //#############################################

    game.intervalHandle = setInterval(function() {
            if (player.death == true || gameElements.length == 1) {
                clearInterval(game.intervalHandle);
                Game.prototype.end();
            } else {
                Game.prototype.update(1 / FPS);
                Game.prototype.draw();
            }

            //####### Below code is for debugging ######################
            // This incriments the game by 1 time step to check for bugs
            //      game.step();
            //##########################################################
        },

        1000 / FPS);
}

Game.prototype.end = function() {
// 2 end states - you win or you lose.
    if (player.death == true) {
        $('#status').empty();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.textAlign = "center";
        ctx.font = "bold 80pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
        ctx.fillText('YOU DIED!', game.w / 2, game.h / 3);
        ctx.font = "bold 20pt Sans-Serif";
        ctx.fillText('Hit space or Enter to Play Again!', game.w / 2, game.h / 2);
    }

    if (gameElements.length == 1 || playerKills == e) {
        // you win!
        $('#status').empty();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.textAlign = "center";
        ctx.font = "bold 80pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
        ctx.fillText('YOU WIN! YAY!', game.w / 2, game.h / 2.5);
        ctx.font = "bold 20pt Sans-Serif";
        ctx.fillText('Hit space or Enter to Play Again!', game.w / 2, game.h / 2);
        gameElements = [];

    }
}


Game.prototype.start = function() {
    ctx.fillStyle = '#FFF';
    ctx.font = "bold 50pt Sans-Serif";
    ctx.textAlign = "center";
    //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
    ctx.fillText('Star Game: Hit Enter or Space to Start!', game.w / 2, game.h / 2);

    $(window).keydown(function(evt) {

        //#############################################################################
        // The keypress is always listening!!! This restarts the game in any state
        //#############################################################################

        if (evt.keyCode == 13 || evt.keyCode == 32) {
            console.log('starting game');
            $(window).off('keydown');
            Game.prototype.run();

        }
    });
}

//#######################Below Code is PlaceHolder Function For Parallax ##################################
//For parallax effect,make a pretty game background 5000x5000 and put it in gamebackground object
//################################################################################################
function gameBackground(image) {}

//instanciate new game object
var game = new Game();

// #########################################
//  GAME STUFF: PLAYER MOVEMENT BY KEYPRESS
// #########################################

//track player movements
var moveType;

//movement handler for player
function keyPosition() {

    // event listener for keys
    $(window).keydown(function(evt) {

        $('#status').html('Use the Arrow Keys to Move & Eat The Other Stellar Bodies.');

        //log key movements in moveArr
        for (var e = 0; e < gameElements.length; e++) {

            if (gameElements[e] instanceof Enemy) {

                switch (true) {

                    case (evt.keyCode == 40):
                        //player moves up, player -y   
                        moveType = 'down';
                        break;
                    case (evt.keyCode == 38):
                        //player moves down, player +y
                        moveType = 'up';
                        break;
                    case (evt.keyCode == 37):
                        //player moves right, player +x
                        moveType = 'left';
                        break;
                    case (evt.keyCode == 39):
                        //player moves left, player -x
                        moveType = 'right';
                        break;
                }
                movePlayer(moveType);
            }
        }
    });
};


function movePlayer(moveType) {

    switch (moveType) {
        case 'up':
            player.vY -= player.speed;
            break;

        case 'down':
            player.vY += player.speed;
            break;

        case 'left':
            player.vX -= player.speed;
            break;

        case 'right':
            player.vX += player.speed;
            break;
    }
}

//##############################################
// Game Object Constructor Functions
//##############################################


// constructor objects -- game elements 
function Player(x, y, r, fill) {

    //player attributes
    this.x = x || 500;
    this.y = y || 350; //350
    this.r = r || 20;
    this.fill = fill || "red";
    this.death = false;
    this.mass = (Math.PI * this.r * 2);

    //physics attributes here
    //divide all below by FPS
    this.speed = 10;

    //pixels per second
    this.vX = 1;
    this.vY = 1;

    //this is the incriment of vX & vY divided by the timestep (x pixels per 1/FPS)
    this.dx = 0;
    this.dy = 0;

    //restrict the speed of player movement
    this.maxV = 75;
    this.drag = .005;

    //Animation attributes - glowing orb
    this.stop = Math.random() * .2 + .4;

    this.update = function(dt) {

        //calculate angle of movement along a vector
        this.dx = (this.vX * dt);
        this.dy = (this.vY * dt);
        //move player along vector
        this.x += this.dx;
        this.y += this.dy;

        //limit speed of vectors
        if (this.vX > this.maxV) {
            this.vX = this.maxV;
        } else if (this.vY > this.maxV) {
            this.vY = this.maxV;
        } else if (this.vX < -this.maxV) {
            this.vX = -this.maxV;
        } else if (this.vY < -this.maxV) {
            this.vY = -this.maxV;
        }

        //decriment speed the vectors of X & Y
        this.vX -= this.vX * this.drag;
        this.vY -= this.vY * this.drag;

        //check game board restricts, adjust angle of vector accordingly
        this.interact(dt);
    }


    //########################################
    // AABB check - overlapping bounding boxes
    //########################################

    this.displacementVector = function(enemy) {
        //get the distance between centers of player and enemy object
        var distance = new Array();

        //###############################################
        // EXCEPTION: Line 350 on End Game state
        //###############################################
        //eX & eY are for the elements X, Y
        distance[0] = this.x - enemy.x;
        distance[1] = this.y - enemy.y;

        return distance;
    }

    this.displacement = function(enemy) {
        //vector subtraction yields the hypotenuse of the triangle law

        //get distance array object
        var distance = this.displacementVector(enemy);

        //get the hypotenuse 
        var moveLength = Math.sqrt(distance[0] * distance[0] + distance[1] * distance[1]);

        return moveLength;
    }

    this.collisionDetect = function(enemy) {
        //get the length of the distance from center of player to enemy
        return this.displacement(enemy) <= (this.r + enemy.r);
    }

    this.reboundDirection = function(enemy, dt) {


        //######################################################################################
        //HTML5 Canvas guide - Multiple Collisions w/ the equation for conservation of momentum
        //######################################################################################

        //displacement vector (x,y) array
        var displacement = this.displacementVector(enemy);
        var collisionAngle = Math.atan2(displacement[0], displacement[1]);
        //velocity vectors
        var speedPlayer = Math.sqrt(this.vX * this.vX + this.vY * this.vY);
        var speedEnemy = Math.sqrt(enemy.vX * enemy.vX + enemy.vY * enemy.vY);

        //angles at current velocities
        var directionPlayer = Math.atan2(this.vX, this.vY);
        var directionEnemy = Math.atan2(enemy.vX, enemy.vY);

        //rotate vectors counter clockwise - make the angle of collision flat
        var vRotationPx = speedPlayer * Math.cos(directionPlayer - collisionAngle);
        var vRotationPy = speedPlayer * Math.sin(directionPlayer - collisionAngle);
        var vRotationEx = speedEnemy * Math.cos(directionEnemy - collisionAngle);
        var vRotationEy = speedEnemy * Math.sin(directionEnemy - collisionAngle);

        //update velocities of player and enemy - note the y velocity remains constant
        var finalVx1 = ((this.r - enemy.r) * vRotationPx + (2 * enemy.r) * vRotationEx) / (this.r + enemy.r);
        var finalVx2 = ((this.r * 2) * vRotationPx + (enemy.r - this.r) * vRotationEx) / (this.r + enemy.r);

        var finalVy1 = vRotationPy;
        var finalVy2 = vRotationEy;

        //rotate the angles back again so the collision angle is preserved

        this.vX = Math.cos(collisionAngle) * finalVx1 + Math.cos(collisionAngle + Math.PI / 2) * finalVy1;
        this.vY = Math.sin(collisionAngle) * finalVx1 + Math.sin(collisionAngle + Math.PI / 2) * finalVy1;

        enemy.vX = Math.cos(collisionAngle) * finalVx2 + Math.cos(collisionAngle + Math.PI / 2) * finalVy2;
        enemy.vY = Math.sin(collisionAngle) * finalVx2 + Math.sin(collisionAngle + Math.PI / 2) * finalVy2;

        //update objects position @ x,y

        this.x = (this.x += this.vX * dt);
        this.y = (this.y += this.vY * dt);
        enemy.x = (enemy.x += enemy.vX * dt);
        enemy.y = (enemy.y += enemy.vY * dt);
    }


    //Collision Detection & Response
    this.interact = function(dt) {

        if ((this.x + this.r) >= game.w) {
            this.vX = -this.vX;
            this.x = game.w - this.r;
        } else if ((this.x - this.r) <= game.x) {
            this.vX = -this.vX;
            this.x = this.r;
        } else if ((this.y - this.r) <= game.y) {
            this.vY = -this.vY;
            this.y = this.r;
        } else if (this.y + this.r >= game.h) {
            this.vY = -this.vY;
            this.y = game.h - this.r;
        }

        //Collision Check & Response
        for (var i = 0; i < gameElements.length; i++) {
            var element = gameElements[i];
            if (element instanceof Enemy) {
                if (this.collisionDetect(element)) {
                    //clearInterval(game.intervalHandle);
                    //clear interval. see where the collision is.
                    console.log('Rebounding');
                    this.reboundDirection(element, dt);
                    element.attack(player);
                }
            }
        }
    }


    //draw player method
    this.draw = function() {

        //player size & style
        //ctx.fillStyle = this.fill;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################

        var new_opacity = getRandomNum(.7, .8);
        g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
        g.addColorStop(.85, 'rgba(255,239,0,' + (new_opacity * .70) + ')');
        g.addColorStop(1.0, 'rgba(255,239,0,0)');
        ctx.fillStyle = g;
        ctx.fill();

        //###############################################
        // Below code is to draw coordinates & check math
        //###############################################

        //center coordinates of enemy object
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 8pt Sans-Serif";
        ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), this.x - 40, this.y + 20);

        //player center distance from enemy center
        //change this to a div
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 12pt Sans-Serif";
        ctx.textAlign = "start";
        ctx.fillText('Kill Count: ' + playerKills, 50, 25);
        ctx.fillText('Your X velocity is ' + Math.floor(this.vX), 50, 50);
        ctx.fillText('Your Y velocity is ' + Math.floor(this.vY), 50, 75);
        ctx.fillText('You are ' + Math.floor(this.displacement(gameElements[1])) + ' px from the enemy.', 50, 100);
        ctx.fillText('Your mass is ' + Math.floor(this.r) + '.', 50, 125);

    }
}


function Enemy(x, y, r, id, fill) {

    //enemy attributes
    this.x = x || 650; // x || 1400;
    this.y = y || 380; // y || 200;
    this.r = r || 60;
    this.fill = fill || "blue";
    this.strength = 5;
    this.death = false;
    this.id = id;

    //enemy physics
    this.dx = 0;
    this.dy = 0;

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
    this.drag = .0001;
    this.maxV = 75;

    //Animation attributes - glowing orb
    this.stop = Math.random() * .2 + .4;


    //get length of vector from center of enemy to center of player
      this.displacementVector = function(element) {
        //get the distance between centers of player and element object
        var distance = new Array();

        //eX & eY are for the elements X, Y
        distance[0] = this.x - element.x;
        distance[1] = this.y - element.y;

        return distance;
    }

    this.displacement = function(element) {
        //vector subtraction yields the hypotenuse of the triangle law

        //get distance array object
        var distance = this.displacementVector(element);

        //get the hypotenuse 
        var moveLength = Math.sqrt(distance[0] * distance[0] + distance[1] * distance[1]);

        return moveLength;
    }

    this.collisionDetect = function(element) {
        //get the length of the distance from center of player to element
        return this.displacement(element) <= (this.r + element.r);
    }

    this.reboundDirection = function(element, dt) {

        //######################################################################################
        //HTML5 Canvas guide - Multiple Collisions w/ the equation for conservation of momentum
        //######################################################################################

        //displacement vector (x,y) array
        var displacement = this.displacementVector(element);
        var collisionAngle = Math.atan2(displacement[0], displacement[1]);
        //velocity vectors
        var speedThis = Math.sqrt(this.vX * this.vX + this.vY * this.vY);
        var speedElement = Math.sqrt(element.vX * element.vX + element.vY * element.vY);

        //angles at current velocities
        var directionThis = Math.atan2(this.vX, this.vY);
        var directionElement = Math.atan2(element.vX, element.vY);
        //rotate vectors counter clockwise - make the angle of collision flat
        var vRotationTx = speedThis * Math.cos(directionThis - collisionAngle);
        var vRotationTy = speedThis * Math.sin(directionThis - collisionAngle);
        var vRotationEx = speedElement * Math.cos(directionElement - collisionAngle);
        var vRotationEy = speedElement * Math.sin(directionElement - collisionAngle);

        //update velocities of this game object and other game object (element) - note the y velocity remains constant
        var finalVx1 = ((this.r - element.r) * vRotationTx + (2 * element.r) * vRotationEx) / (this.r + element.r);
        var finalVx2 = ((this.r * 2) * vRotationTx + (element.r - this.r) * vRotationEx) / (this.r + element.r);

        var finalVy1 = vRotationTy;
        var finalVy2 = vRotationEy;

        //rotate the angles back again so the collision angle is preserved

        this.vX = Math.cos(collisionAngle) * finalVx1 + Math.cos(collisionAngle + Math.PI / 2) * finalVy1;
        this.vY = Math.sin(collisionAngle) * finalVx1 + Math.sin(collisionAngle + Math.PI / 2) * finalVy1;

        element.vX = Math.cos(collisionAngle) * finalVx2 + Math.cos(collisionAngle + Math.PI / 2) * finalVy2;
        element.vY = Math.sin(collisionAngle) * finalVx2 + Math.sin(collisionAngle + Math.PI / 2) * finalVy2;

        //update objects position @ x,y

        this.x = (this.x += this.vX * dt);
        this.y = (this.y += this.vY * dt);
        element.x = (element.x += element.vX * dt);
        element.y = (element.y += element.vY * dt);
    }

    //check if enemy hits game boundries
    this.interact = function(dt) {

        if ((this.x + this.r) >= game.w) {
            this.vX = -this.vX;
            this.x = game.w - this.r;
        } else if ((this.x - this.r) <= game.x) {
            this.vX = -this.vX;
            this.x = this.r;
        } else if ((this.y - this.r) <= game.y) {
            this.vY = -this.vY;
            this.y = this.r;
        } else if (this.y + this.r >= game.h) {
            this.vY = -this.vY;
            this.y = game.h - this.r;
        }

        for (var i = 0; i < gameElements.length; i++) {
            var element = gameElements[i];

            //only check other elements in the array. before this was looping over every element
            if (!(element.id == this.id)) {

                //console.log('checking for other game elements');
                if (this.collisionDetect(element)) {
                    //clearInterval(game.intervalHandle);
                    //clear interval. see where the collision is.
                    //rebound direction will return a velocity vector
                    this.reboundDirection(element, dt);
                    this.attack(element);
                }
         }   
        }
    }

    //attack the player
    this.attack = function(element) {

        //define the maximum enemy mass allowed before player loses
        var maxMass = element.r * 7;

        //get the current this object to manipulate the instance
        var self = this;

        if (self.r <= 6) {
            self.death = true;
            console.log('enemy died');
            return;
        }

        if (player.r <= 10) {
            //if player radius/mass lower than 20 pixels, death!
            player.death = true;
            return;
        }

        if (self.r > element.r) {

            //#####################################################################################################################
            //Below code only alters current object - What if I want to alter all the enemy objects size in relation to the player?
            //#####################################################################################################################

            //slowly gain mass
            console.log('enemy is gaining mass');
            var timer1 = setInterval(function() {
                self.r += .1;
                element.r -= .1;
            }, 75);

            setTimeout(function() {
                //console.log('clearing interval');
                clearInterval(timer1);
            }, 750);
        }

        //eat enemies smaller than yourself
        else if (self.r < element.r) {

            console.log('player is gaining mass');
            var timer3 = setInterval(function() {
                self.r -= .1;
                element.r += .1;
            }, 75);

            setTimeout(function() {
                //console.log('clearing interval');
                clearInterval(timer3);
            }, 750);
        }

        //##########################################################################
        // This doesn't work - WHY - its in collision detection loop?
        //##########################################################################

        // else if (self.r == element.r) {
        //     //randomly choose which one will be eaten
        //     var killArr = new Array();
        //     killArr.push(self.r);
        //     killArr.push(element.r);

        //     var i = Math.floor(Math.random()*killArr.length);

        //     //kill one of the game objects
        //     var timer2 = setInterval(function() {
        //         if (i == 0) {
        //             $('#status').html('Random Attack: enemy1 is gaining mass');
        //             self.r -= .05;
        //             killArr[1] += .05;
        //         }
        //         else {
        //             $('#status').html('Random Attack: enemy2 is gaining mass');
        //             self.r += .05;
        //             killArr[0] -= .05;
        //         }
        //     }, 75);
        //     setTimeout(function() {
        //         //console.log('clearing interval');
        //         clearInterval(timer2);
        //     }, 750);
        // }

    }


    //update enemy position
    this.update = function(dt) {

        //calculate angle of movement along a vector
        this.dx = (this.vX * dt);
        this.dy = (this.vY * dt);
        //move enemy along vector
        this.x += this.dx;
        this.y += this.dy;

        //limit speed of vectors
        if (this.vX > this.maxV) {
            this.vX = this.maxV;
        } else if (this.vY > this.maxV) {
            this.vY = this.maxV;
        } else if (this.vX < -this.maxV) {
            this.vX = -this.maxV;
        } else if (this.vY < -this.maxV) {
            this.vY = -this.maxV;
        }
    
        //decriment speed the vectors of X & Y
        this.vX -= this.vX * this.drag;
        this.vY -= this.vY * this.drag;

        //check game board restricts, adjust angle of vector accordingly
        this.interact(dt);

    }

    //draw enemy method
    this.draw = function() {

        //enemy size & style
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################
        var new_opacity = getRandomNum(.5, .6);

        g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * .95);
        g.addColorStop(0.0, 'rgba(60,255,255,' + new_opacity + ')');
        g.addColorStop(.75, 'rgba(0,60,255,' + (new_opacity * .7) + ')');
        g.addColorStop(1.0, 'rgba(0,60,255,0)');
        ctx.fillStyle = g;
        ctx.fill();

        //###############################################
        // Below code is to draw coordinates & check math
        //###############################################

        //center coordinates of enemy object
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 8pt Sans-Serif";
        ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), this.x - 20, this.y + 20);
    }

}

function getRandomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}