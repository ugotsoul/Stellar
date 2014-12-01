
// ###############################
//  HTML5 Canvas Constructor
// ##############################

var Canvas = function(name, create){

    this.x = 0;
    this.y = 0;
    this.w = $(window).width();
    this.h = $(window).height();
    this.offsetX = this.w/2;
    this.offsetY = this.h/2;
    this.name = name;
    this.canvas = this.prepare(create);
    this.ctx = this.context();
};

Canvas.prototype.prepare = function(create){

    if (create){
        //create a hidden canvas dom object
        this.canvas = document.createElement('canvas');   
        return document.body.appendChild(this.canvas), this.canvas;
    }

    else {
        //create a visable canvas dom object
        this.canvas = document.getElementById(this.name);
        return this.canvas;
        }
};

Canvas.prototype.context = function(){

    this.ctx = this.canvas.getContext('2d');

    return this.ctx;
}

//##############################
// Game Constructor Function
//##############################

var Game = function() {
    this.x = 0;
    this.y = 0;
    this.w = 3000;
    this.h = 3000;
    this.intervalHandle = null;
    this.startEnemies = 50;
    this.gameObjects = this.getElements();
    //this.ctx refers to the buffer canvas
    this.canvas = null;

};

Game.prototype.getElements = function() {
    
    var gameElements = [];
    
    //######## Global Player Object ############
    var player = new Player(this.w/2, this.h/2);
    //##########################################
  
    //add player to game element array
    gameElements.push(player);
    
    var enemiesAdded = 0;

    //primary key of enemy
    var rID = 1;

    while (enemiesAdded < this.startEnemies) {

        var n = 0;

        // instanciate enemies in random places on the board 
        // note: bounds are restricted to account for max radius
        var rX = getRandomInteger(50, this.w-50);
        var rY = getRandomInteger(50, this.h-50);
        var rR = getRandomInteger(10, 15);

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

Game.prototype.draw = function() {
       
    if (player.death == true) {
        return;
    }

    //clear and then draw canvas & game elements        
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var c = 0; c < this.gameObjects.length; c++) {

        //draw enemy element on canvas
        this.gameObjects[c].draw(ctx);
    }

    //draw player status board
    this.score(player);
};

Game.prototype.update = function(dt) {

    //update positions of game elements
    for (var d = 0; d < this.gameObjects.length; d++) {
        //check if element is dead or not
        if (this.gameObjects[d].death == true) {
            //if dead, remove enemy from array
            this.gameObjects.splice(d, 1);
            }

        else if (this.gameObjects[d].death == true && this.gameObjects[d] instanceof Player){
            return;
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
Game.prototype.render = function(mainCanvas) {

    mainCanvas.ctx.clearRect(0, 0, mainCanvas.w, mainCanvas.h);

    background.render(); 
    
    this.draw();

    return mainCanvas.ctx.drawImage(bgCanvas, 0, 0), ctxMain.drawImage(this.canvas, 0, 0);

}

//runs the game (gets elements, draws game elements, updates game elements) @ 50 FPS
Game.prototype.run = function() {

    //get player position
    this.mouseClick();

    //frames per second
    FPS = 50;

    //####### Below code is for debugging ######################
    // This incriments the game by 1 time step to check for bugs
    //      game.step();
    //##########################################################
    //this.step = function() {
    //      Game.prototype.update(1 / FPS);
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
            $(window).off('keydown');
            
            //refresh the page to reload the game
            document.location.href = "";
        }
    });


    //
    if (player.death == true) {

        ctxMain.clearRect(0, 0, canvas.width, canvas.height);
        ctxMain.fillStyle = '#FFF';
        ctxMain.textAlign = "center";
        ctxMain.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        ctxMain.fillText('YOU DIED! Ow.', canvas.width/2, canvas.height/2);
        txMain.font = "bold 20pt Sans-Serif";
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

Game.prototype.start = function(canvas) {


    canvas.ctx.fillStyle = '#FFF';
    canvas.ctx.font = "bold 80pt Sans-Serif";
    canvas.ctx.textAlign = "center";
    //you need to clear the canvas for this instance of the Game object -- game -- not the Game object. 
    canvas.ctx.fillText('Stellar', canvas.w/2, canvas.h/2 - 150);
    canvas.ctx.font = "20pt Sans-Serif";
    canvas.ctx.fillText('Be a star. Consume the universe.', canvas.w/2, (canvas.h/2)-100);
    canvas.ctx.font = "bold 22pt Sans-Serif";
    canvas.ctx.fillStyle = '#FFF';
    canvas.ctx.fillText('Hit enter or space to start', canvas.w/2, (canvas.h/2)+100);

    var self = this;
    
    $(window).keydown(function(evt) {

        if (evt.keyCode == 13 || evt.keyCode == 32) {
            $(window).off('keydown');
            self.run();
        }
    });
}

Game.prototype.score = function(ctx, player) {

    //offset scoreboard according to game width height
    this.canvas.ctx.fillStyle = '#FFF';
    this.canvas.ctx.font = "bold 30pt Sans-Serif";
    this.canvas.ctx.textAlign = "start";
    this.canvas.ctx.fillText('Score Board', this.canvas.x+5, this.canvas.y+40);
    this.canvas.ctx.font = "22pt Sans-Serif";
    this.canvas.ctx.fillText('Enemies Killed: ' + player.kills, this.canvas.x+5, this.canvas.y+70);
    //this.canvas.ctx.fillText('Your X velocity is ' + Math.floor(player.vX), canvas.x+5, canvas.y+100);
    //this.canvas.ctx.fillText('Your Y velocity is ' + Math.floor(player.vY), canvas.x+5, canvas.y+130);
    this.canvas.ctx.fillText('Your mass is ' + Math.floor(player.r) + '.', this.canvas.x+5, this.canvas.y+90);
    this.canvas.ctx.fillText('Total Enemies '+(this.gameObjects.length-1)+ '.', this.canvas.x+5, this.canvas.y+120);

}

//monitors player movement
Game.prototype.mouseClick = function(){

    //mouse click event listener
    $(window).click(function (evt) {

    //these coordinates are the click offset from the players game world position
    var xClick = evt.pageX - this.canvas.offsetX;
    var yClick = evt.pageY - this.canvas.offsetY;

    //player is the first object in the game Objects array
    return this.gameObjects[0].mouseClick = [xClick, yClick];

    });
}

// Object.defineProperty(Game.prototype, 'zoom', {get: function(){ 

//     if (this.playerKills > 0) {
//         return this.startEnemies/this.playerKills;
//     }

//     else {
//         return this.maxEnemies; }
//     }});


//get offset values by calculating the player's current distance from translated origin
Object.defineProperty(Game.prototype, 'viewX', {get: function(){ return player.x - this.canvas.offsetX; }});
Object.defineProperty(Game.prototype, 'viewY', {get: function(){ return player.y - this.canvas.offsetY; }});


//prepares the canvases, loads game objects
Game.prototype.init = function(){

    this.canvas = new Canvas('buffer', true); 
    
    var mainCanvas = new Canvas('main', false);

    console.log(mainCanvas);

    this.start(mainCanvas);
};

//######## Global Game Object ##############
var game = new Game();
//##########################################


//##################################################################
// Parallax-y Background Constructor Function
//##################################################################

var Background = function() {
    this.x = 0;
    this.y = 0;
    this.w = game.w;
    this.h = game.h;
    this.bgStars = this.makeStars(400);
    this.fgStars = this.makeStars(300);
    this.topStars = this.makeStars(150);
    this.canvas = null;
}

Object.defineProperty(Background.prototype, 'viewX', {get: function(){ return -(player.x - offsetX); }});
Object.defineProperty(Background.prototype, 'viewY', {get: function(){ return -(player.y - offsetY); }});

Background.prototype.makeStars = function(numOfStars) {

    var stars = [];

    for (var i=0; i<numOfStars; i++) {
    
    stars.push({

        x: getRandomInteger(this.x, this.w),
        y: getRandomInteger(this.y, this.h),
        r: getRandomInteger(0, 2),
        drawX: 0,
        drawY: 0,
        vX: 0,
        vY: 0
        });
    }
    return stars;
}

Background.prototype.update = function(layer, speed) {

    //move stars in player direction of movemen
    for (var i=0; i < layer.length; i++){

        var targetX = layer[i].x + this.viewX;
        var targetY = layer[i].y + this.viewY;

        layer[i].drawX = targetX;
        layer[i].drawY = targetY;

        if (speed > 0){


            layer[i].drawX += targetX/speed;
            layer[i].drawY += targetY/speed;


            //never have stars draw off canvas
            if (layer[i].drawX - this.viewX < layer[i].x) {
                layer[i].drawX = targetX;
            }

            if (layer[i].drawY - this.viewY < layer[i].y) {
                layer[i].drawY = targetY;
            }
  
            if (layer[i].drawX - this.viewX >= this.w) {
                layer[i].drawX = this.viewX;
            }

            if (layer[i].drawY - this.viewY >= this.h) {
                layer[i].drawY = this.viewY;
            }
  
        }
    }
    return;
}


Background.prototype.draw = function(bgCtx, fill, layer) {

    bgCtx.fillStyle = fill;
    bgCtx.beginPath();

        //draw the stars
        for (var i=0; i<layer.length; i++) {

            bgCtx.moveTo(layer[i].drawX, layer[i].drawY);
            bgCtx.arc(layer[i].drawX, layer[i].drawY, layer[i].r, 0, Math.PI * 2, false);
            }

    bgCtx.fill();
    bgCtx.closePath();

    //make a game world bounding rectangle
    bgCtx.strokeStyle = 'blue';
    bgCtx.lineWidth = 2;
    bgCtx.strokeRect(this.viewX, this.viewY, game.w, game.h);

}

Background.prototype.render = function(){

    //clear and then draw canvas & star objects       
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    //check for changes in x, y coordinate plane of player view
    this.update(this.bgStars, 0);
    this.update(this.fgStars, 2);
    this.update(this.topStars, 1);

    //redraw stars on canvacs
    this.draw(bgCtx, 'blue', this.bgStars);
    this.draw(bgCtx, 'violet', this.fgStars);
    this.draw(bgCtx, 'red', this.topStars);
}

var background = new Background();
