    $(document).ready(function() {
    	
    	//run game
    	game.run();

    	//get arrow key type
    	keyPosition();
    	
    });

    //draw the canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');


    // ###############################
    //  Constructer Objects
    // ###############################

    //global player object 
    var player = new Player();

    //# of enemies
    e = 1;

    //creates an array of length player + enemy objects
    var gameElements = new Array();

    //get random integer
    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //add game objects
    function getElements() {
        //add player to game element array
        gameElements.push(player);

        //add e# of enemy to game element array
        for (var b = 0; b < (e); b++) {

    	   	var rX;
        	var rY;

            // instanciate enemies in random places on the board
            rX = getRandomInteger(75, 1700);
            rY = getRandomInteger(75, 600);
            gameElements.push(new Enemy(rX, rY));
        }
    }

    //##############################
    // Game constructor
    //##############################
    
    //game world boundries - swap out h & w when you decided on a world size
   	var Game =  function (x, y, h, w) {
        this.x = x || 0;
        this.y =  y || 0;
        this.h =  h || 700;
        this.w =  w || 1800;
    };

    Game.prototype.draw = function() {
    	//clear and then draw canvas & game elements     	
    	ctx.clearRect(0, 0, canvas.width, canvas.height);

	    for (var c = 0; c < gameElements.length; c++) {
	        //draw element on canvas
	        getGameElementsPos();
	        gameElements[c].draw();
    	}
    };

    Game.prototype.update = function (dt) {
    //update positions of game elements
        for (var d = 0; d < gameElements.length; d++) {
   		    gameElements[d].update(dt);
        }
    }

    //runs the game (gets elements, draws game elements, updates game elements) @ 50 FPS
    Game.prototype.run = function () {
    	//get game objects
    	getElements();
    	
    	//frames per second
    	FPS = 50;
    	this.step = function() {
    			Game.prototype.update(1/FPS);
    			Game.prototype.draw();
    		}
    	this.intervalHandle = setInterval(this.step, 1000/FPS); 
    }

    Game.prototype.end = function () {
    		
    		//stop game.
    		//clear interval.

    		//if (player.mass <= 10)
    		clearInterval(this.intervalHandle);
    		ctx.clearRect(0, 0, canvas.width, canvas.height);
    		ctx.fillStyle = '#000';
            ctx.font = "bold 80pt Sans-Serif";
            ctx.fillText('YOU DIED!', this.w/3, this.h/2);
    }

    //instanciate new game object
    var game = new Game();

    // #################################
    //  GAME STUFF: POSITION & KEYPRESS
    // #################################
 
    function getGameElementsPos() {
        //get player cordinates

        for (var f = 0; f < gameElements.length; f++) {

            //get player cordinates
            if (gameElements[f] instanceof Player) {
                //need to get center of box, html5 canvas draws from top left
                playerX = (gameElements[f].x + (gameElements[f].w / 2));
                playerY = (gameElements[f].y + (gameElements[f].h / 2));
                playerH = gameElements[f].h;
                playerW = gameElements[f].w;
            }
            //get enemy cordinates
            else if (gameElements[f] instanceof Enemy) {
                enemyX = gameElements[f].x;
                enemyY = gameElements[f].y;
                enemyR = gameElements[f].r;

                distX = playerX - enemyX;
                distY = playerY - enemyY;

                hypotenuse = Math.floor(Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)));

            }
        }
    }

  //track player movements
	var moveType;

    //movement handler for player
	function keyPosition() {

        // event listener for keys
        $(window).keydown(function(evt) {

            $('#status').html('WEEEeeeee!');

            //log key movements in moveArr
            for (var e = 0; e < gameElements.length; e++) {

                if (gameElements[e] instanceof Enemy) {

                  switch(true) {
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

		console.log('Moving in this direction '+moveType);

        //cap the player at a max velocity
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


    // constructor objects -- game elements 
    function Player(x, y, r, fill) {

        //player attributes
        this.x = x || 500;
        this.y = y || 350; //350
        this.r = r || 20;
        this.fill = fill || "red";
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

        this.update = function(dt) {

       		//calculate angle of movement along a vector
		    this.dx = (this.vX*dt);
		    this.dy = (this.vY*dt);
		    //move player along vector
        	this.x += this.dx;
        	this.y += this.dy;

			//check game board restricts, adjust angle of vector accordingly
        	this.interact(dt);
        }


        //########################################
        // AABB check - overlapping bounding boxes
        //########################################

        this.displacementVector = function (enemy) {
        	//get the distance between centers of player and enemy object
        	var distance = new Array();

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
        	var moveLength = Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]);
        	
        	return moveLength;
        }

        this.collisionDetect = function (enemy) {
        	//get the length of the distance from center of player to enemy
        	return this.displacement(enemy) <= (this.r+enemy.r);
        }

        this.reboundDirection = function(enemy, dt) {

        	//######################################################################################
        	//HTML5 Canvas guide - Multiple Collisions w/ the equation for conservation of momentum
        	//######################################################################################

        	//displacement vector (x,y) array
			var displacement = this.displacementVector(enemy);
        	var collisionAngle = Math.atan2(displacement[0], displacement[1]);
        	//velocity vectors
        	var speedPlayer = Math.sqrt(this.vX*this.vX + this.vY*this.vY);
        	var speedEnemy = Math.sqrt(enemy.vX*enemy.vX + enemy.vY*enemy.vY);
        	
        	//angles at current velocities
        	var directionPlayer = Math.atan2(this.vX, this.vY); 
        	var directionEnemy =  Math.atan2(enemy.vX, enemy.vY); 

        	//rotate vectors counter clockwise - make the angle of collision flat
        	var vRotationPx = speedPlayer * Math.cos(directionPlayer - collisionAngle);        	
        	var vRotationPy = speedPlayer * Math.sin(directionPlayer - collisionAngle);
        	var vRotationEx = speedEnemy * Math.cos(directionEnemy - collisionAngle);
        	var vRotationEy = speedEnemy * Math.sin(directionEnemy - collisionAngle);

        	//update velocities of player and enemy - note the y velocity remains constant
        	var finalVx1 = ((this.r - enemy.r) * vRotationPx + (2 * enemy.r) * vRotationEx)/(this.r + enemy.r);
        	var finalVx2 = ((this.r * 2) * vRotationPx + (enemy.r - this.r) * vRotationEx)/(this.r + enemy.r);

        	var finalVy1 = vRotationPy;
        	var finalVy2 = vRotationEy;

        	//rotate the angles back again so the collision angle is preserved

        	this.vX = Math.cos(collisionAngle) * finalVx1 + Math.cos(collisionAngle + Math.PI/2) * finalVy1; 	
        	this.vY = Math.sin(collisionAngle) * finalVx1 + Math.sin(collisionAngle + Math.PI/2) * finalVy1;
        	
        	enemy.vX = Math.cos(collisionAngle) * finalVx2 + Math.cos(collisionAngle + Math.PI/2) * finalVy2;
        	enemy.vY = Math.sin(collisionAngle) * finalVx2 + Math.sin(collisionAngle + Math.PI/2) * finalVy2;

        	//update objects position @ x,y

        	this.x = (this.x += this.vX * dt);
        	this.y = (this.y += this.vY * dt);
        	enemy.x = (enemy.x += enemy.vX * dt);
        	enemy.y = (enemy.y += enemy.vY * dt);

        	console.log('Rebounded!');   
        }


        //check if player hits game boundries
        this.interact = function (dt) {

        	if ((this.x+this.r) >= game.w ) {
        		this.vX = -this.vX;
        		this.x = game.w - this.r;
        		} 
        	else if ((this.x-this.r) <= game.x) {
        		this.vX = -this.vX;
        		this.x = this.r; 
        		} 
        	else if ((this.y-this.r) <= game.y) {
        		this.vY = -this.vY;	
        		this.y = this.r; 
        		}
        	else if (this.y+this.r >= game.h) {
        		this.vY = -this.vY;
        		this.y = game.h - this.r;
        		}

    		for (var i = 0; i < gameElements.length; i++) {
    			var element = gameElements[i];
    			if (element instanceof Enemy) { 
    				console.log('checking enemy');
		    		if (this.collisionDetect(element)) {
		    			//clearInterval(game.intervalHandle);
		    			//clear interval. see where the collision is.
		    			console.log('Colliding');
		    			//rebound direction will return a velocity vector
		    			this.reboundDirection(element, dt);
		    			element.attack(player);
	    			} 
	    		}
    		}
    	}


        //draw player method
        this.draw = function() {

        	//player size & style
            ctx.fillStyle = this.fill;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();

            //center coordinates of enemy object
            ctx.fillStyle = '#000';
            ctx.font = "bold 8pt Sans-Serif";
            ctx.fillText('X: ' + this.x + ' Y: ' + this.y, this.x - 40, this.y + 20);

            //player center distance from enemy center
            //change this to a div
            ctx.fillStyle = '#000';
            ctx.font = "bold 12pt Sans-Serif";
            ctx.fillText('Your X velocity is '+ Math.abs(this.vX), 50, 25);
            ctx.fillText('Your Y velocity is '+ Math.abs(this.vY), 50, 50);
            ctx.fillText('You are ' +  this.displacement(gameElements[1])  + ' px from the enemy.', 50, 75);
            ctx.fillText('You mass is ' + (this.mass) + '.', 50, 100);

        }
    }


    function Enemy(x, y, r, fill) {

        //enemy attributes
        this.x = x || 650; // x || 1400;
        this.y = y || 380; // y || 200;
        this.r = r || 60;
        this.fill = fill || "blue";
        this.mass = (Math.PI * this.r * 2);
        this.strength = 5;
        this.drag = this.maxV * .1;

        //enemy physics
        this.dx = 0;
        this.dy = 0;
        this.vX = 1;
        this.vY = 1;
        this.maxV = 20;


        //get length of vector from center of enemy to center of player

        //check if enemy hits game boundries
        this.interact = function (dt) {
        	
        	if (this.r > 0) {
		    	if ((this.x+this.r) >= game.w) {
		    		this.vX = -this.vX;
		    		this.x = game.w - this.r; 
		    		}
		    	else if ((this.x-this.r) <= game.x) {
		    		this.vX = -this.vX;
		    		this.x = this.r; 
		    		} 
		    	else if ((this.y-this.r) <= game.y) {
		    		this.vY = -this.vY;	
		    		this.y = this.r; 
		    		}
		    	else if (this.y+this.r >= game.h) {
		    		this.vY = -this.vY;
		    		this.y = game.h - this.r;
		    		}
        		}
        	}


        //attack the player

        this.attack = function(element) {
		    
		    //check if bigger or smaller

		    //if bigger, subtract
		    if (this.r > element.r) {

		   	//decriment player mass
		    element.r -= element.r/this.strength;

		    //push object away from collision
		    //check what magnitude these vectors are (x, y)
		    //element.vX += element.r;

		   	//add mass to the enemy
		   	this.r += this.strength;

		    //slow the player down
		   	element.vX -= element.speed;

		   }

        }


        //update enemy position
        this.update = function(dt) {
		   	
		   	//calculate angle of movement along a vector
		    this.dx = (this.vX*dt);
		    this.dy = (this.vY*dt);
		    //move enemy along vector
        	this.x += this.dx;
        	this.y += this.dy;
			//check game board restricts, adjust angle of vector accordingly
        	this.interact(dt);

        }

        //draw enemy method
        this.draw = function() {

        	//enemy size & style
            ctx.fillStyle = this.fill;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();

            //###############################################
            // Below code is to draw coordinates & check math
            //###############################################

            //center coordinates of enemy object
            ctx.fillStyle = '#000';
            ctx.font = "bold 8pt Sans-Serif";
            ctx.fillText('X: ' + this.x + ' Y: ' + this.y, this.x - 40, this.y + 20);

            //draw line from center of enemy to center of player
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(player.x, player.y); 
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            //draw collision box for reference
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.moveTo(this.x, this.y - this.r); //top line is (this.x, this.y-this.r) & (this.x, this.y+this.r)
            ctx.lineTo(this.x + this.r, this.y - this.r);
            ctx.lineTo(this.x + this.r, this.y + this.r);
            ctx.lineTo(this.x - this.r, this.y + this.r);
            ctx.lineTo(this.x - this.r, this.y - this.r);
            ctx.lineTo(this.x, this.y - this.r);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();


        }

    }