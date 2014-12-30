//##############################
// Game Constructor Function
//##############################

var Game = function() {
    this.x = 0;
    this.y = 0;
    this.w = 1000;
    this.h = 1000;
    this.intervalHandle = null;
    this.canvas = null;
    this.bg = null;
    this.level = 0;
    this.startEnemies = null;
    this.gameObjects = null;
    this.win = null;
    //save score with local storage
    this.totalScore = 0;

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

    //primary key of enemy - used to optimize collision detection
    var enemyID = 1;

    while (enemiesAdded < this.startEnemies) {

        //accesses the nth element of the array
        var n = 0;

        // instanciate enemies in random places on the board 
        // note: bounds are restricted to account for max radius
        var enemyX = getRandomInteger(50, this.w-50);
        var enemyY = getRandomInteger(50, this.h-50);
        var enemyR = getRandomInteger(10, 20);

        var tempEnemy = new Enemy(enemyX, enemyY, enemyR, enemyID);

        //preform a collision test to make sure enemies are not drawn in the same spot
        var collision = tempEnemy.collisionDetect(gameElements[n]);

        if (!collision) {

            enemiesAdded++;
            
            //add enemy to the array
            gameElements.push(tempEnemy);
            
            //incriment unique id
            enemyID++;
            }
        n++;
        }

    return gameElements;
};

Game.prototype.draw = function() {
       
    if (this.playerDeath === true) {
        return;
    }

    var canvas = this.canvas;

    //clear and then draw canvas & game elements        
    canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);

    this.bg.render(canvas);
    
    for (var c = 0; c < this.gameObjects.length; c++) {

        this.gameObjects[c].draw(canvas.ctx);
    }
    this.score();
};

Game.prototype.update = function(dt) {

    //update score
    this.totalScore = this.playerKills*100;

    //check for changes in x, y coordinate plane of player view
    this.bg.update(this.bg.bgStars, 0);
    this.bg.update(this.bg.midStars, 3);
    this.bg.update(this.bg.fgStars, 1.5);
    this.bg.update(this.bg.twinkStars, 0);

    //update positions of game elements
    for (var d = 0; d < this.gameObjects.length; d++) {
        //check if element is dead or not
        if (this.gameObjects[d].death === true) {
            
            //if dead, remove enemy from array
            this.gameObjects.splice(d, 1);
            }
        
        else {
            this.gameObjects[d].update(dt);
            }
    }
};

//calls the buffer canvas when ready
Game.prototype.render = function(canvas) {

    var buffer = this.canvas.canvas;

    canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);

    return canvas.ctx.drawImage(buffer, 0, 0);
};

Game.prototype.run = function(canvas) {

    this.mouseClick();

    //######## Global - Frames Per Second ########
    FPS = 50;
    //############################################

    //####### Below code is for debugging ########
    // This incriments the game by 1 time step
    //this.step = function() {
    //      Game.prototype.update(1 / FPS);
    //      Game.prototype.draw();  }
    //############################################
    
    //inherted variable scope
    var self = this;

    this.intervalHandle = setInterval( function() {
            
            if (self.playerDeath === true) {
                clearInterval(self.intervalHandle);
                self.end(canvas);
            }

            else if (self.playerMass >= self.win) {
                
                clearInterval(self.intervalHandle);
                
                self.level++;
                
                canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
                canvas.ctx.fillStyle = '#FFF';
                canvas.ctx.font = "bold 50pt Sans-Serif";
                canvas.ctx.fillText('Cleared Level '+(self.level), canvas.w/2, canvas.h/2);
                var showScore = setTimeout(function(){ self.makeLevel(canvas);}, 3000);
            }
            
            else {
                
                self.update(1 / FPS);
                self.draw();
                self.render(canvas);
                return;
            }
        },
    1000 / FPS);
};


Game.prototype.makeLevel = function(canvas){
        
        var levels = {

            0 :
            {   gameW:1500,
                gameH:900,
                gameEnemies: 10,
                levelClear: 80,
                levelMessage: "Reach 80 Tonnes in mass."
            },

            1 :
            {   gameW:2000,
                gameH:1500,
                gameEnemies: 100,
                levelClear: 200,
                levelMessage: "Reach 200 Tonnes in mass."
            },

            2 :
            {   gameW:3000,
                gameH:3000,
                gameEnemies: 150,
                levelClear: 300,
                levelMessage: "Reach 300 Tonnes in mass."
            }
        };

        if (levels[this.level]){

            canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
            canvas.ctx.fillStyle = '#FFF';
            canvas.ctx.font = "bold 80pt Sans-Serif";
            canvas.ctx.fillText('Level '+(this.level+1), canvas.w/2, canvas.h/2);
            canvas.ctx.font = "bold 40pt Sans-Serif";
            canvas.ctx.fillText(levels[this.level]['levelMessage'], canvas.w/2, canvas.h/2 + 100);

            this.w = levels[this.level]['gameW'];
            this.h = levels[this.level]['gameH'];
            this.startEnemies = levels[this.level]['gameEnemies'];
               
            if (this.level > 0){
                //save score
                if (localStorage.score && localStorage.kills){
                    localStorage.score += this.totalScore;
                    localStorage.kills += this.playerKills;
                }

                else {
                    localStorage.score = this.totalScore;
                    localStorage.kills = this.playerKills;
                }

                //set score to prev level score
                this.totalScore = localStorage.score;
                this.gameObjects = this.getElements();
                this.gameObjects[0].kills = localStorage.kills;
            }

            else {
                this.gameObjects = this.getElements();
            }
                    
            this.win = levels[this.level]['levelClear'];

            this.bg.bgStars = this.bg.makeStars(Math.floor(game.w/20));
            this.bg.midStars = this.bg.makeStars(Math.floor(game.w/70));
            this.bg.fgStars = this.bg.makeStars(Math.floor(game.w/70));
            this.bg.twinkStars = this.bg.makeStars(Math.floor(game.w/20));

            var self = this;

            var startGame = setTimeout(function(){
             self.run(canvas);
                }, 1000);
            }

        else {
            //you beat the game, yay!
            this.end(canvas);
        }

};


Game.prototype.end = function(canvas) {

    var self = this;

    if (this.playerDeath === true) {

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.fillStyle = '#FFF';
        canvas.ctx.textAlign = "center";
        canvas.ctx.font = "bold 50pt Sans-Serif";
        canvas.ctx.fillText('YOU DIED!', canvas.w/2, canvas.h/2 - 50);
        canvas.ctx.font = "bold 40pt Sans-Serif";
        canvas.ctx.fillText('Total Score: '+this.totalScore, canvas.w/2, canvas.h/2 + 50);
    }

    //this needs to be game win state (last level cleared)
    if (this.playerMass > this.win) {

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.fillStyle = '#FFF';
        canvas.ctx.textAlign = "center";
        canvas.ctx.font = "bold 50pt Sans-Serif";
        canvas.ctx.fillText('YOU WON!', canvas.w/2, canvas.h/2 - 50);
        canvas.ctx.font = "bold 40pt Sans-Serif";
        canvas.ctx.fillText('Total Score: '+this.totalScore, canvas.w/2, canvas.h/2 + 50);
        }

    var replayGame = setTimeout(function(){
        //refresh the page to reload the game
        document.location.href = "";
    }, 5000);
};

Game.prototype.start = function(canvas) {

    //clear localstorage
    localStorage.clear();

    //drawn on main canvas, not buffer canvas (this.canvas)
    var bgImage = new Image(1800,1000);
    bgImage.style = "z-index: -1";
    bgImage.onload = function(){
    canvas.ctx.drawImage(bgImage, -100 ,0, 1800, 1000);
    canvas.ctx.fillStyle = '#FFF';
    canvas.ctx.font = "bold 100pt Sans-Serif";
    canvas.ctx.textAlign = "center";
    canvas.ctx.save();
    canvas.ctx.shadowColor = 'black';
    canvas.ctx.shadowBlur = 4;
    canvas.ctx.shadowOffsetX = 2;
    canvas.ctx.shadowOffsetY = 2;
    canvas.ctx.fillText('Stellar', canvas.w/2, canvas.h/2 - 150);
    canvas.ctx.font = "20pt Sans-Serif";
    canvas.ctx.fillText('Be a star. Consume the universe.', canvas.w/2, (canvas.h/2)-100);
    canvas.ctx.font = "bold 30pt Sans-Serif";
    canvas.ctx.fillStyle = '#FFF';
    canvas.ctx.fillText('Click to Start', canvas.w/2, (canvas.h/2)+100);
    canvas.ctx.restore();
    };
    
    bgImage.src = 'static/imgs/bg.png';
    
    //start in the begining level
    this.level = 0;

    var self = this;
    
    $(window).click(function (evt) {
        
        $(window).off('click');
            
            if (self.level === 0) {
                
                canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
                var helpImg = new Image(1024,768);
                helpImg.onload = function(){canvas.ctx.drawImage(helpImg, (canvas.w/2 - 1024/2), (canvas.h/2 - 768/2), 1024, 768);};
                helpImg.src = 'static/imgs/help.png';
                
                $(window).click(function (evt) {
                    $(window).off('click');
                    self.makeLevel(canvas); });
                }
        
    });
};

Game.prototype.score = function() {

    this.canvas.ctx.save();
    this.canvas.ctx.shadowColor = '#00F';
    this.canvas.ctx.shadowBlur = 2;
    this.canvas.ctx.shadowOffsetX = 2;
    this.canvas.ctx.shadowOffsetY = 2;
    this.canvas.ctx.fillStyle = '#FFF';
    this.canvas.ctx.font = "bold 40pt Sans-Serif";
    this.canvas.ctx.textAlign = "start";
    this.canvas.ctx.fillText('Score Board', this.canvas.x+10, this.canvas.y+50);
    this.canvas.ctx.font = "bold 26pt Sans-Serif";
    this.canvas.ctx.fillStyle = '#0FF';
    this.canvas.ctx.fillText('Points: ' + this.totalScore, this.canvas.x+10, this.canvas.y+100);
    this.canvas.ctx.fillText('Your mass is ' + Math.floor(this.playerMass) + ' Tonnes.', this.canvas.x+10, this.canvas.y+150);
    this.canvas.ctx.fillText('Total Enemies '+(this.gameObjects.length-1)+ '.', this.canvas.x+10, this.canvas.y+200);
    this.canvas.ctx.restore();
};


//get offset values by calculating the player's current distance from translated origin
Object.defineProperty(Game.prototype, 'viewX', {get: function(){ return Math.floor(this.gameObjects[0].x - this.canvas.offsetX); }});
Object.defineProperty(Game.prototype, 'viewY', {get: function(){ return Math.floor(this.gameObjects[0].y - this.canvas.offsetY); }});
Object.defineProperty(Game.prototype, 'playerDeath', {get: function(){ return this.gameObjects[0].death; }});
Object.defineProperty(Game.prototype, 'playerMass', {get: function(){ return this.gameObjects[0].r; }});
Object.defineProperty(Game.prototype, 'playerKills', {get: function(){ return this.gameObjects[0].kills; }});


Game.prototype.mouseClick = function(){

    var self = this;

    //mouse click event listener
    $(window).click(function (evt) {

    //these coordinates are the click offset from the players game world position
    var xClick = evt.pageX - self.canvas.offsetX;
    var yClick = evt.pageY - self.canvas.offsetY;

    //Note: player is the first object in the gameObjects array
    return self.gameObjects[0].mouseClick = [xClick, yClick];
    });
};

Game.prototype.init = function(){

    var background = new Background();
    
    this.bg = background;
    
    // ####### Invisible canvas ############
    this.canvas = new Canvas('buffer', true);
    //########################################
    
    //######## Visible canvas ############## 
    var mainCanvas = new Canvas('main', false);
    //########################################

    this.start(mainCanvas);
};


//######### Global Game Object #############
var game = new Game();
//##########################################
