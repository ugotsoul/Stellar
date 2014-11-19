// ###############################
//  Game Objects & Containers
// ###############################

//draw the game canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

//global player object 
var player = new Player(windowW/2, windowH/2);

//define region of the canvas
ctx.canvas.x= 0;
ctx.canvas.y= 0;
ctx.canvas.width = windowW;
ctx.canvas.height = windowH;

//# of enemies
NUM_OF_ENEMIES = 6;

//creates an array for game objects
var gameElements = new Array();

//add game objects to an array
function getElements() {
    //add player to game element array
    gameElements.push(player);
    var enemiesAdded = 0;

    //primary key of enemy
    var rID = 1;

    //check if element has those coordinates already
    while (enemiesAdded < NUM_OF_ENEMIES) {

        var n = 0;

        // instanciate enemies in random places on the board with random radiuses
        var rX = getRandomInteger(75, 1700);
        var rY = getRandomInteger(75, 600);
        var rR = getRandomInteger(10, 30);

        var tempEnemy = new Enemy(rX, rY, rR, rID);

        //do a collision test
        var collision = tempEnemy.collisionDetect(gameElements[n]);

        if (!collision) {
            enemiesAdded++
            //add enemy to the array
            gameElements.push(tempEnemy);
            //incriment unique id
            rID++
        }
    n++
    }
}

//##############################
// Game Constructor Functions
//##############################

//game world boundries - swap out h & w when you decided on a world size
var Game = function() {
    this.x = 0;
    this.y = 0;
    this.w = 3000;
    this.h = 3000;
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

    game.score();

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
        }
        else if (gameElements[d].length == 1) {
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

    //####### Below code is for debugging ######################
    // This incriments the game by 1 time step to check for bugs
    //      game.step();
    //##########################################################
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
        },
    1000 / FPS);
}

Game.prototype.end = function() {

$(window).keydown(function(evt) {

    if (evt.keyCode == 13 || evt.keyCode == 32) {
            console.log('Restarting game');
            $(window).off('keydown');
        //#############################################################################
        // For Testing: reset player.r to 20 & player kills on game restart
        //#############################################################################
            player.death = false;
            player.r = 20;
            playerKills = 0;
            gameElements = [];
            game.run();
        }
    });

// 2 end states - you win or you lose.
    if (player.death == true) {
        $('#status').empty();
        $('#status').off('html');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.textAlign = "center";
        ctx.font = "bold 80pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctx.fillText('YOU DIED!', windowW/2, windowH/2);
        ctx.font = "bold 20pt Sans-Serif";
        ctx.fillText('Hit space or Enter to Play Again!', windowW/2, windowH/2+50);
    }

    if (gameElements.length == 1) {
        // you win!
        $('#status').empty();
        $('#status').off('html');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.textAlign = "center";
        ctx.font = "bold 80pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctx.fillText('YOU WIN! YAY!', windowW/2, windowH/2);
        ctx.font = "bold 20pt Sans-Serif";
        ctx.fillText('Hit space or Enter to Play Again!', windowW/2, windowH/2+50);
        }    
}

Game.prototype.start = function() {
    ctx.fillStyle = '#FFF';
    ctx.font = "bold 50pt Sans-Serif";
    ctx.textAlign = "center";
    //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
    ctx.fillText('Star Game: Hit Enter or Space to Start!', windowW/2, windowH/2);

    $(window).keydown(function(evt) {

        if (evt.keyCode == 13 || evt.keyCode == 32) {
            console.log('starting game');
            $(window).off('keydown');
            Game.prototype.run();
        }
    });
}

//instanciate new game object
var game = new Game();


//##################################################################
// Below code is for the scoreboard - Change to follow player
//##################################################################
Game.prototype.score = function() {

//offfset scoreboard according to game width height
ctx.fillStyle = '#FFF';
ctx.font = "bold 30pt Sans-Serif";
ctx.textAlign = "start";
ctx.fillText('Kill Count: ' + playerKills, this.x+50, this.y+50);
ctx.fillText('Your X velocity is ' + Math.floor(player.vX), this.x+50, this.y+100);
ctx.fillText('Your Y velocity is ' + Math.floor(player.vY), this.x+50, this.y+150);
ctx.fillText('Your mass is ' + Math.floor(player.r) + '.', this.x+50, this.y+200);
}
