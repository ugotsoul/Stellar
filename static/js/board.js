// ###############################
//  HTML5 Canvas properties
// ###############################

//prepare the 'buffer' game canvas
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

//define region of the canvas
ctx.canvas.x = 0;
ctx.canvas.y = 0;
ctx.canvas.width = windowW;
ctx.canvas.height = windowH;

//define player coordinates in the middle of the canvas
var offsetX = canvas.width/2;
var offsetY = canvas.height/2;

// ###########################################################################
// Note: Double Buffering marginally helped with FPS preformance by 10 frames.
// ############################################################################ 

//prepare the main game canvas
var mainCanvas = document.getElementById('main');

mainCanvas.width = canvas.width;
mainCanvas.height = canvas.height;

var ctxMain = mainCanvas.getContext('2d');

// ###########################################
//  Game state attributes & object containers
// ###########################################

//# of enemies
NUM_OF_ENEMIES = 5;

//global player object 
var player = new Player(canvas.width, canvas.height);

//creates an array for game objects
var gameElements = new Array();

//#########################################
//Make get Elements part of the Game Class
//#########################################

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

    //draw player status board
    game.score();
};

//Note: playerKills == NUM of enemeies signals winning game end state
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

//calls the buffer canvas when ready
Game.prototype.render = function() {

ctxMain.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
ctxMain.drawImage(bgCanvas, 0, 0);
ctxMain.drawImage(canvas, 0, 0);

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
    //###########################################################

    game.intervalHandle = setInterval(function() {
            if (player.death == true || gameElements.length == 1) {
                clearInterval(game.intervalHandle);
                Game.prototype.end();
            } else {
                Game.prototype.update(1 / FPS);              
                //draw star background
                background.draw();         
                Game.prototype.draw();
                Game.prototype.render();
            }
        },
    1000 / FPS);
}

//#########################################################################
// Refactor: End should just check for player death & clear state, not draw
//#########################################################################

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
    ctxMain.fillStyle = '#00F';
    ctxMain.font = "bold 80pt Sans-Serif";
    ctxMain.textAlign = "center";
    //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
    ctxMain.fillText('Stellar', canvas.width/2, canvas.height/2 - 150);
    ctxMain.font = "20pt Sans-Serif";
    ctxMain.fillText('Be a star. Consume the universe.', canvas.width/2, (canvas.height/2)-100);
    ctxMain.font = "bold 22pt Sans-Serif";
    ctxMain.fillStyle = '#00E';
    ctxMain.fillText('Hit enter or space to start', canvas.width/2, (canvas.height/2)+100);

    $(window).keydown(function(evt) {

        if (evt.keyCode == 13 || evt.keyCode == 32) {
            $(window).off('keydown');
            Game.prototype.run();
        }
    });
}

//instanciate new game object
var game = new Game();

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

//get offset values by calculating the player's current distance from translated origin
Object.defineProperty(Game.prototype, 'viewX', {get: function(){ return player.x - offsetX; }});
Object.defineProperty(Game.prototype, 'viewY', {get: function(){ return player.y - offsetY; }});


var bgCanvas = document.createElement('canvas');
var bgCtx = bgCanvas.getContext('2d');

bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;

var Background = function() {

    this.x = 0;
    this.y = 0;
    this.w = game.w;
    this.h = game.h;

    var maxStars = 500;
    var stars = [];

    this.makeStars = function(stars) {
        for (var i=0; i<maxStars; i++) {
            stars.push({
            x: getRandomInteger(0, game.w),
            y: getRandomInteger(0, game.h),
            r: getRandomInteger(0, 2),
            });
        }
    }
}


//make a new background object

Background.prototype.stars = function() {

    this.fill = 
    var maxStars = 500;
    var stars = [];


    for (var i=0; i<maxStars; i++) {
    stars.push({
        x: getRandomInteger(0, game.w),
        y: getRandomInteger(0, game.h),
        r: getRandomInteger(0, 2),
        });
    }

    //twinkle effect - Not implimented
    //var twink = getRandomNum(.5, .9);

    //fill all stars with a color on the purple/blue scale
}


Background.prototype.draw = function() {

    //clear and then draw canvas & star objects       
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    //make a game world bounding rectangle
    bgCtx.strokeStyle = starFill;
    bgCtx.lineWidth = 2;
    bgCtx.strokeRect(-game.viewX, -game.viewY, this.w, this.h);

    bgCtx.fillStyle = starFill;
    bgCtx.beginPath();
        //draw the stars
        for (var i=0; i<stars.length; i++) {
        var star = stars[i];
        bgCtx.moveTo(star.x, star.y);
        bgCtx.arc(star.x-game.viewX, star.y-game.viewY, star.r, 0, Math.PI * 2, false);
        }
    bgCtx.fill();
    bgCtx.closePath();
