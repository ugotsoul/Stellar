//##############################
// Game Constructor Function
//##############################

var Game = function() {
    this.x = 0;
    this.y = 0;
    this.w = 1000;
    this.h = 1000;
    this.intervalHandle = null;
    //this.ctx refers to the buffer canvas
    this.canvas = null;
    this.bg = null;
    this.level = 0;
    this.startEnemies = null;
    this.gameObjects = null;
    this.win = null;

};


Game.prototype.getElements = function() {
    
    var gameElements = [];
    
    //############# Player Object ##############
    var player = new Player(this.w/2, this.h/2);
    //##########################################
  
    //add player to game element array
    gameElements.push(player);
    
    //keeps track of how many enemies have been added to the game objects array
    var enemiesAdded = 0;

    //primary key of enemy - to optimize collision detection
    var enemyID = 1;

    while (enemiesAdded < this.startEnemies) {

        //accesses the nth element of the array
        var n = 0;

        // instanciate enemies in random places on the board 
        // note: bounds are restricted to account for max radius
        var enemyX = getRandomInteger(50, this.w-50);
        var enemyY = getRandomInteger(50, this.h-50);
        var enemyR = getRandomInteger(10, 15);

        var tempEnemy = new Enemy(enemyX, enemyY, enemyR, enemyID);

        //preform a collision test to make sure enemies don't appear in the same spot
        var collision = tempEnemy.collisionDetect(gameElements[n]);

        if (!collision) {

            enemiesAdded++
            
            //add enemy to the array
            gameElements.push(tempEnemy);
            
            //incriment unique id
            enemyID++
            }
        n++
        }

    return gameElements;
}

Game.prototype.draw = function() {
       
    if (this.playerDeath == true) {
        return;
    }

    //clear and then draw canvas & game elements        
    this.canvas.ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);

    this.bg.render(this.canvas);
    
    for (var c = 0; c < this.gameObjects.length; c++) {

        //draw game elements on canvas
        this.gameObjects[c].draw(this.canvas.ctx);
    }

    //draw player status board
    this.score();

    return;
};

Game.prototype.update = function(dt) {

    //update positions of game elements
    for (var d = 0; d < this.gameObjects.length; d++) {
        //check if element is dead or not
        if (this.gameObjects[d].death == true) {
            //if dead, remove enemy from array
            this.gameObjects.splice(d, 1);
            }

        else {
            this.gameObjects[d].update(dt);
            }
    }

    return;
}

//calls the buffer canvas when ready
Game.prototype.render = function(canvas) {

    canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
    
    this.draw();

    return  canvas.ctx.drawImage(this.canvas.canvas, 0, 0);
}

Game.prototype.run = function(canvas) {

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
            
            if (self.playerDeath == true) {
                clearInterval(self.intervalHandle);
                self.end(canvas);
                return;
            } 

            else if (self.win == self.playerMass) {
                
                clearInterval(self.intervalHandle);
                
                self.level +=1;
                
                //below is a cheap method to show the player score - store this in the session cookie or db session
                //save the score of the player, or save the player attributes
                canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
                canvas.ctx.fillStyle = '#FFF';
                canvas.ctx.font = "bold 50pt Sans-Serif";
                canvas.ctx.fillText('Cleared '+(self.playerKills/(self.gameObjects.length-1)).toFixed(2)+'%. of Level '+(self.level+1), canvas.w/2, canvas.h/2);
                
                var showScore = setTimeout(function(){self.makeLevel(canvas);}, 3000);  
                return; 
            }
            
            else {
                
                self.update(1 / FPS);              
                self.render(canvas);
                return;
            }
        },

    1000 / FPS);

    return;
}


Game.prototype.makeLevel = function(canvas){
        
        //3 levels
        var level = [
            //w, h, num of enemies, player win state
            [1000,1000, 15, 60],
            [1500,1500, 30, 100],
            [3000, 3000, 50, 150]
        ];
        
        if (level[this.level]){

            //console.log('trying to make level');
            canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
            canvas.ctx.fillStyle = '#FFF';
            canvas.ctx.font = "bold 80pt Sans-Serif";
            canvas.ctx.fillText('Level '+(this.level+1), canvas.w/2, canvas.h/2);
            this.w = level[this.level][0];
            this.h = level[this.level][1];
            this.startEnemies = level[this.level][2];
            this.win = level[this.level][3];

            this.bg.bgStars = this.bg.makeStars(Math.floor(this.w/6));
            this.bg.midStars = this.bg.makeStars(Math.floor(this.w/8));
            this.bg.fgStars = this.bg.makeStars(Math.floor(this.w/10));

            //save player score

            this.gameObjects = this.getElements();    
    
            var self = this;

            var startGame = setTimeout(function(){
                
                self.run(canvas);
                
                }, 3000);

        }

    return;

}

//#########################################################################
// Refactor: End should just check for player death & clear state, not draw
//#########################################################################

Game.prototype.end = function(canvas) {

    var self = this;
    //loss state
    if (this.playerDeath == true) {

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.fillStyle = '#FFF';
        canvas.ctx.textAlign = "center";
        canvas.ctx.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        canvas.ctx.fillText('YOU DIED! Ow.', canvas.w/2, canvas.h/2 - 50);
        canvas.ctx.font = "bold 30pt Sans-Serif";
        canvas.ctx.fillStyle = '#92daf2';
        canvas.ctx.fillText('You killed '+(this.playerKills/(this.gameObjects.length-1)).toFixed(2)+'% enemies.', canvas.w/2, canvas.h/2+50);
        canvas.ctx.fillStyle = '#FFF';
        //canvas.ctx.fillText('Hit space or Enter to Play Again!', canvas.w/2, canvas.h/2+150);
    }

    //win state
    if (this.gameObjects.length == 1 || this.playerMass > 150) {

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.fillStyle = '#FFF';
        canvas.ctx.textAlign = "center";
        canvas.ctx.font = "bold 50pt Sans-Serif";
        //you need to clear the canvas for this instance of the Game object -- game -- not the Game object/class. 
        canvas.ctx.fillText('YOU WIN! YAY!', canvas.w/2, canvas.h/2 - 50);
        canvas.ctx.font = "bold 30pt Sans-Serif";
        canvas.ctx.fillStyle = '#92daf2';
        canvas.ctx.fillText('You killed '+(this.playerKills/(this.gameObjects.length-1)).toFixed(2)+'% enemies.', canvas.w/2, canvas.h/2+50);
        canvas.ctx.fillStyle = '#FFF';
        //canvas.ctx.fillText('Hit space or Enter to Play Again!', canvas.w/2, canvas.h/2+150);
        } 

    var replayGame = setTimeout(function(){
        //refresh the page to reload the game
        document.location.href = "";
    }, 5000);

    return;   
}

Game.prototype.start = function(canvas) {

    //drawn on main canvas, not buffer canvas (this.canvas)
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

    //start in the begining level
    this.level = 0;

    var self = this;
    
    $(window).keydown(function(evt) {

        if (evt.keyCode == 13 || evt.keyCode == 32) {
            $(window).off('keydown');
            self.makeLevel(canvas);
            return;
        }
    });
}

//make this a div - draw operations are expensive
Game.prototype.score = function() {

    //offset scoreboard according to game width height
    this.canvas.ctx.fillStyle = '#FFF';
    this.canvas.ctx.font = "bold 40pt Sans-Serif";
    this.canvas.ctx.textAlign = "start";
    this.canvas.ctx.fillText('Score Board', this.canvas.x+10, this.canvas.y+50);
    this.canvas.ctx.font = "bold 26pt Sans-Serif";
    this.canvas.ctx.fillText('Enemies Killed: ' + this.playerKills, this.canvas.x+10, this.canvas.y+100);
    this.canvas.ctx.fillText('Your mass is ' + Math.floor(this.playerMass) + '.', this.canvas.x+10, this.canvas.y+150);
    this.canvas.ctx.fillText('Total Enemies '+(this.gameObjects.length-1)+ '.', this.canvas.x+10, this.canvas.y+200);

    return;
}


// Object.defineProperty(Game.prototype, 'zoom', {get: function(){ 

//     if (this.playerKills > 0) {
//         return this.startEnemies/this.playerKills;
//     }

//     else {
//         return this.maxEnemies; }
//     }});


//get offset values by calculating the player's current distance from translated origin
Object.defineProperty(Game.prototype, 'viewX', {get: function(){ return Math.floor(this.gameObjects[0].x - this.canvas.offsetX); }});
Object.defineProperty(Game.prototype, 'viewY', {get: function(){ return Math.floor(this.gameObjects[0].y - this.canvas.offsetY); }});
Object.defineProperty(Game.prototype, 'playerDeath', {get: function(){ return this.gameObjects[0].death; }});
Object.defineProperty(Game.prototype, 'playerMass', {get: function(){ return this.gameObjects[0].r; }});
Object.defineProperty(Game.prototype, 'playerKills', {get: function(){ return this.gameObjects[0].kills; }});

//monitors player movement
Game.prototype.mouseClick = function(){

    var self = this;

    //mouse click event listener
    $(window).click(function (evt) {

    //these coordinates are the click offset from the players game world position
    var xClick = evt.pageX - self.canvas.offsetX;
    var yClick = evt.pageY - self.canvas.offsetY;

    //player is the first object in the game Objects array
    return self.gameObjects[0].mouseClick = [xClick, yClick];

    });
}

Game.prototype.init = function(){

    var background = new Background();
    
    this.bg = background;
    
    // ####### Invisable canvases ############
    this.canvas = new Canvas('buffer', true); 
    //this.bg = new Canvas('bg', true);
    //########################################
    
    //######## Visible canvases ############## 
    var mainCanvas = new Canvas('main', false);
    //########################################

    return this.start(mainCanvas);
};


//######### Global Game Object #############
var game = new Game();
//##########################################
