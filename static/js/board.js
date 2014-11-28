
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
var ctxMain = mainCanvas.getContext('2d');

ctxMain.canvas.x = 0;
ctxMain.canvas.y = 0;
ctxMain.canvas.width = ctx.canvas.width;
ctxMain.canvas.height = ctx.canvas.height;

//##############################
// Game Constructor Functions
//##############################

//global player object 
var player = new Player(canvas.width, canvas.height);

var Game = function() {
    this.x = 0;
    this.y = 0;
    this.w = 3000;
    this.h = 3000;
    this.intervalHandle = null;
    this.playerKills = 0;
    this.maxEnemies = 5;
    this.gameObjects = this.getElements();
};

Game.prototype.keyPress = function(player) {

    $(window).keyup(function(evt) {

        switch (true) {
                case (evt.keyCode == 38):
                    //player moves up, player -y 
                    player.moveType['up']= false;
                    break;
                case (evt.keyCode == 40):
                    //player moves down, player +y
                    player.moveType['down'] = false;
                    break;
                case (evt.keyCode == 39):
                    //player moves right, player +x
                    player.moveType['right']= false;
                    break;
                case (evt.keyCode == 37):
                    //player moves left, player -x
                    player.moveType['left'] = false;
                    break;
            }

    });

    // event listener for keys
    $(window).keydown(function(evt) {

            switch (true) {
                case (evt.keyCode == 38):
                    //player moves up, player -y 
                    player.moveType['up']= true;
                    break;
                case (evt.keyCode == 40):
                    //player moves down, player +y
                    player.moveType['down'] = true;
                    break;
                case (evt.keyCode == 39):
                    //player moves right, player +x
                    player.moveType['right']= true;
                    break;
                case (evt.keyCode == 37):
                    //player moves left, player -x
                    player.moveType['left'] = true;
                    break;
            }

        });
    }

Game.prototype.getElements = function() {
    
    var gameElements = [];

    //add player to game element array
    gameElements.push(player);
    
    var enemiesAdded = 0;

    //primary key of enemy
    var rID = 1;

    while (enemiesAdded < this.maxEnemies) {

        var n = 0;

        //set max enemy radius - will be born no more than 2 times player radius
        var maxR = player.r*2;

        // instanciate enemies in random places on the board 
        // note: bounds are restricted to account for max radius
        var rX = getRandomInteger(maxR, this.w-maxR);
        var rY = getRandomInteger(maxR, this.h-maxR);
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

    return gameElements;
}

Game.prototype.draw = function(ctx) {
       
    if (player.death == true) {
        console.log("Players is dead, stop drawing");
        return;
    }

    //clear and then draw canvas & game elements        
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var c = 0; c < this.gameObjects.length; c++) {

        //draw enemy element on canvas
        this.gameObjects[c].draw(ctx);
    }

    //draw player status board
    this.score(ctx);
};

Game.prototype.update = function(dt) {

    //update positions of game elements
    for (var d = 0; d < this.gameObjects.length; d++) {
        //check if element is dead or not
        if (this.gameObjects[d].death == true) {
            //if dead, remove enemy from array
            this.gameObjects.splice(d, 1);
            this.playerKills++
            }
        
        else if (this.gameObjects[d].length == 1) {
            return;
            } 

        else {
            this.gameObjects[d].update(dt);
            }
    }
}

//calls the buffer canvas when ready
Game.prototype.render = function() {

    ctxMain.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    background.render(); 
    
    this.draw(ctx);

    return ctxMain.drawImage(bgCanvas, 0, 0), ctxMain.drawImage(canvas, 0, 0);

}

//runs the game (gets elements, draws game elements, updates game elements) @ 50 FPS
Game.prototype.run = function() {

    //get arrow key types
    this.keyPress(player);

    //get mouse clicks
    //this.mouseClick();

    //frames per second
    FPS = 50;

    //####### Below code is for debugging ######################
    // This incriments the game by 1 time step to check for bugs
    //      game.step();
    //##########################################################
    //this.step = function() {
    //        Game.prototype.update(1 / FPS);
    //      Game.prototype.draw();  }
    //###########################################################
    
    //inherted variable scope
    var self = this;

    this.intervalHandle = setInterval( function() {
            
            if (player.death == true || self.gameObjects.length == 1) {
                clearInterval(self.intervalHandle);
                self.end(ctxMain);
            } else {
                self.update(1 / FPS);              
                self.render();
            }
        },

    1000 / FPS);
}

//#########################################################################
// Refactor: End should just check for player death & clear state, not draw
//#########################################################################

Game.prototype.end = function(ctxMain) {

    var self = this;

$(window).keydown(function(evt) {

    if (evt.keyCode == 13 || evt.keyCode == 32) {
            console.log('Restarting game');
            $(window).off('keydown');
        //#############################################################################
        // For Testing: reset player.r to 20 & player kills on game restart
        //#############################################################################
            player.death = false;
            player.r = 100;
            self.playerKills = 0;
            self.gameObjects = null;
            self.run();

        }
    });

    if (player.death == true) {

        ctxMain.clearRect(0, 0, canvas.width, canvas.height);
        ctxMain.fillStyle = '#FFF';
        ctxMain.textAlign = "center";
        ctxMain.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctxMain.fillText('YOU DIED!', canvas.width/2, canvas.height/2);
        ctxMain.font = "bold 20pt Sans-Serif";
        ctxMain.fillText('Hit space or Enter to Play Again!', canvas.width/2, canvas.height/2+30);
    }

    if (this.gameObjects.length == 1) {

        ctxMain.clearRect(0, 0, canvas.width, canvas.height);
        ctxMain.fillStyle = '#FFF';
        ctxMain.textAlign = "center";
        ctxMain.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctxMain.fillText('YOU WIN! YAY!', canvas.width/2, canvas.height/2);
        ctxMain.font = "bold 20pt Sans-Serif";
        ctxMain.fillText('Hit space or Enter to Play Again!', canvas.width/2, canvas.height/2+30);
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
    ctxMain.font = "bold italic 22pt Sans-Serif";
    ctxMain.fillStyle = '#00f';
    ctxMain.fillText('Hit enter or space to start', canvas.width/2, (canvas.height/2)+100);

    var self = this;
    
    $(window).keydown(function(evt) {

        if (evt.keyCode == 13 || evt.keyCode == 32) {
            $(window).off('keydown');
            self.run();
        }
    });
}

//instanciate new game object
var game = new Game();

Game.prototype.score = function(ctx) {

    //offset scoreboard according to game width height
    ctx.fillStyle = '#FFF';
    ctx.font = "bold 30pt Sans-Serif";
    ctx.textAlign = "start";
    ctx.fillText('Score Board', canvas.x+5, canvas.y+40);
    ctx.font = "22pt Sans-Serif";
    ctx.fillText('Enemies Killed: ' + this.playerKills, canvas.x+5, canvas.y+70);
    ctx.fillText('Your X velocity is ' + Math.floor(player.vX), canvas.x+5, canvas.y+100);
    ctx.fillText('Your Y velocity is ' + Math.floor(player.vY), canvas.x+5, canvas.y+130);
    ctx.fillText('Your mass is ' + Math.floor(player.r) + '.', canvas.x+5, canvas.y+160);

}

Game.prototype.mouseClick = function(){

    //mouseEvent listener
    $(window).click(function (evt) {
    
    //store mouse clicks
    //these coordinates are the click offset from the players game world position
    var xClick = evt.pageX - offsetX;
    var yClick = evt.pageY - offsetY;

    //console.log('Click Coordinates', xClick, yClick);

    return player.mouseClick = [xClick, yClick];

    });
}


//##################################################################
// Game Camera - Follows player around, translates Game Objects
//##################################################################


Object.defineProperty(Game.prototype, 'zoom', {get: function(){ 

    if (this.playerKills > 0) {
        return this.maxEnemies/this.playerKills;
    }

    else {
        return this.maxEnemies; }
    }});

//get offset values by calculating the player's current distance from translated origin
Object.defineProperty(Game.prototype, 'viewX', {get: function(){ return player.x - offsetX; }});
Object.defineProperty(Game.prototype, 'viewY', {get: function(){ return player.y - offsetY; }});


var bgCanvas = document.createElement('canvas');
var bgCtx = bgCanvas.getContext('2d');

bgCanvas.x = 0;
bgCanvas.y = 0;
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;

var Background = function() {
    this.x = 0;
    this.y = 0;
    this.w = game.w;
    this.h = game.h;
    this.stars = this.makeStars();
}

Object.defineProperty(Background.prototype, 'viewX', {get: function(){ return -(player.x - offsetX); }});
Object.defineProperty(Background.prototype, 'viewY', {get: function(){ return -(player.y - offsetY); }});
// Object.defineProperty(Background.prototype, 'w', {get: function(){ return game.w; }});
// Object.defineProperty(Background.prototype, 'h', {get: function(){ return game.h; }});

//Object.defineProperty(Background.prototype, 'stars' {get: function(){ return this.makeStars(); }});

Background.prototype.makeStars = function() {

    this.fill = 'blue';
    this.maxStars = 1000;
    var stars = [];

    for (var i=0; i<this.maxStars; i++) {
    stars.push({
        x: getRandomInteger(this.x, this.w),
        y: getRandomInteger(this.y, this.h),
        r: getRandomInteger(0, 2),
        draw: false,
        });
    }
    return stars;
}


Background.prototype.update = function() {

    //move stars in player direction of movement
    // for (var i=0; i < this.stars.length; i++){
    //     this.stars[i].x -= (-player.vX/player.vX);
    //     this.stars[i].y -= (-player.vY/player.vY);
    // }

    // function range(x, min, max) {
    //     return x > min && x < max;
    // }

    // for (var n=0; n < this.stars.length; n++){

    //     //check if stars are in game world
    //     if (range(this.stars[n].x, this.viewX, this.w) && range(this.stars[n].y, this.viewY, this.h)){
    //         this.stars[n].draw = true;     
    //     }
    // }
}

Background.prototype.draw = function(bgCtx) {

    //clear and then draw canvas & star objects       
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    //make a game world bounding rectangle
    bgCtx.strokeStyle = this.fill;
    bgCtx.lineWidth = 2;
    bgCtx.strokeRect(this.viewX, this.viewY, this.w, this.h);

    bgCtx.fillStyle = this.fill;
    bgCtx.beginPath();

        //draw the stars
        for (var i=0; i<this.stars.length; i++) {
        var star = this.stars[i];
        
        //if (star.draw) {
            bgCtx.moveTo(star.x, star.y);
            bgCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2, false);
            }
        //}

    bgCtx.fill();
    bgCtx.closePath();
}

Background.prototype.render = function(){

    //check for changes in x, y coordinate plane of player view
    this.update();
    //redraw stars on canvacs
    this.draw(bgCtx);
}

var background = new Background();
