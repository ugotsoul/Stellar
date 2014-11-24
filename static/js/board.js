// ###############################
//  Game Objects & Containers
// ###############################

//draw the game canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

//define region of the canvas
ctx.canvas.x= 0;
ctx.canvas.y= 0;
ctx.canvas.width = windowW;
ctx.canvas.height = windowH;

//define player coordinates in the middle of the canvas
var offsetX = canvas.width/2;
var offsetY = canvas.height/2;

//# of enemies
NUM_OF_ENEMIES = 5;

//global player object 
var player = new Player(canvas.width, canvas.height);

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

        //set max enemy radius - will be born no more than 2 times player radius
        var maxR = player.r*2;

        // instanciate enemies in random places on the board 
        // note: bounds are restricted to account for max radius
        var rX = getRandomInteger(maxR, game.w-maxR);
        var rY = getRandomInteger(maxR, game.h-maxR);
        var rR = 30; //getRandomInteger(10, 30);

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
    background.draw();
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
            player.r = 100;
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
        ctx.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctx.fillText('YOU DIED!', canvas.width/2, canvas.height/2);
        ctx.font = "bold 20pt Sans-Serif";
        ctx.fillText('Hit space or Enter to Play Again!', canvas.width/2, canvas.height/2+30);
    }

    if (gameElements.length == 1) {
        // you win!
        $('#status').empty();
        $('#status').off('html');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.textAlign = "center";
        ctx.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctx.fillText('YOU WIN! YAY!', canvas.width/2, canvas.height/2);
        ctx.font = "bold 20pt Sans-Serif";
        ctx.fillText('Hit space or Enter to Play Again!', canvas.width/2, canvas.height/2+30);
        }    
}

Game.prototype.start = function() {
    ctx.fillStyle = '#FFF';
    ctx.font = "bold 50pt Sans-Serif";
    ctx.textAlign = "center";
    //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
    ctx.fillText('Stellar', canvas.width/2, canvas.height/2);
    ctx.font = "20pt Sans-Serif";
    ctx.fillText('Hit enter or space to start', canvas.width/2, (canvas.height/2)+30);

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
ctx.font = "bold 16pt Sans-Serif";
ctx.textAlign = "start";
ctx.fillText('Score Board', canvas.x+5, canvas.y+20);
ctx.font = "14pt Sans-Serif";
ctx.fillText('Enemies Killed: ' + playerKills, canvas.x+5, canvas.y+40);
ctx.fillText('Your X velocity is ' + Math.floor(player.vX), canvas.x+5, canvas.y+60);
ctx.fillText('Your Y velocity is ' + Math.floor(player.vY), canvas.x+5, canvas.y+80);
ctx.fillText('Your mass is ' + Math.floor(player.r) + '.', canvas.x+5, canvas.y+100);

}


//##################################################################
// Game Camera - Follows player around, translates Game Objects
//##################################################################

//get current views by calculating the player's distance from translated origin
Object.defineProperty(Game.prototype, 'viewX', {get: function(){ return player.x - offsetX; }});
Object.defineProperty(Game.prototype, 'viewY', {get: function(){ return player.y - offsetY; }});

var bg = function() {

    this.x = 0;
    this.y = 0;
    this.w = game.w;
    this.h = game.h;

    var self = this;

    var maxStars = 500;
    var stars = [];

    //make an array of random stars
    for (var i=0; i<maxStars; i++) {
    stars.push({
        x: getRandomInteger(0, game.w),
        y: getRandomInteger(0, game.h),
        r: getRandomInteger(1, 3)
        });
    }

    self.draw = function() {
    //test star background  
    // var STARS_IMG = new Image();
    // STARS_IMG.onload = function (){ctx.drawImage(STARS_IMG, -game.viewX, -game.viewY, self.w, self.h);}
    // STARS_IMG.src = "static/bg/stars3.png"; 

    ctx.fillStyle="rgba(255, 255, 255, .6)";
    ctx.beginPath();
        
        //draw the stars
        for (var i=0; i<stars.length; i++) {
        var star = stars[i];
        ctx.moveTo(star.x, star.y);
        ctx.arc(star.x-game.viewX, star.y-game.viewY, star.r, 0, Math.PI * 2, false);
        }
    
    ctx.fill();
    ctx.closePath();
    
    }
}

//make a new background object
var background = new bg();



Game.prototype.camera =  function(moveType) {

        switch(moveType) {
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

