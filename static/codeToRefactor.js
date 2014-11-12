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



function Player.prototype.move = function (moveType) {

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


function GameObject(x, y, r, fill) {

    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;

    //physics attributes here
    this.speed = 10;
    //pixels per second
    this.vX = 1;
    this.vY = 1;
    //this is the incriment of vX & vY divided by the timestep (x pixels per 1/FPS)
    this.dx = 0;
    this.dy = 0;

}

GameObject.prototype.update = function(dt) {

            //calculate angle of movement along a vector
            this.dx = (this.vX*dt);
            this.dy = (this.vY*dt);
            //move player along vector
            this.x += this.dx;
            this.y += this.dy;

            //check game board restricts, adjust angle of vector accordingly
            this.interact(dt);
        }



GameObject.prototype.displacementVector = function (element) {
            //get the distance between centers of player and enemy object
            var distance = new Array();

            //eX & eY are for the elements X, Y
            distance[0] = this.x - element.x;
            distance[1] = this.y - element.y;

            return distance;
        }

GameObject.prototype.displacement = function(enemy) {
            //vector subtraction yields the hypotenuse of the triangle law

            //get distance array object
            var distance = this.displacementVector(enemy);

            //get the hypotenuse 
            var moveLength = Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]);
            
            return moveLength;
        }

        //########################################
        // AABB check - overlapping bounding boxes
        //########################################



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
            ctx.fillText('You mass is ' + player.mass + '.', 50, 100);

        }
    }


    function Enemy(x, y, r, fill) {

        //enemy attributes
        this.x = x || 650; // x || 1400;
        this.y = y || 380; // y || 200;
        this.r = r || 60;
        this.fill = fill || "blue";
        this.mass = (Math.PI * this.r * 2);
        this.attack = 5;
        this.drag = .01;

        //enemy physics
        this.dx = 0;
        this.dy = 0;
        this.vX = 1;
        this.vY = 1;
        this.maxV = 20;


        //get length of vector from center of enemy to center of player

        //check if enemy hits game boundries
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

            //        console.log('I was hit! OW!');
					
					// //hurt player
				 //    player.mass -= this.attack;
				 //    player.w -= this.attack/2;
				 //    player.h -= this.attack/2;
				 //    player.x += this.attack;
				 //    player.y -= this.attack;
				 //    //add mass to the enemy
				  //  this.r += this.attack/player.mass;

				    //slow the player down
				//    player.velocity -= .5;
				//	this.velocity += .1;

				    //##########################################################################
				    ////switch the angle of player - below code is wrong -HOW DO I DU THISSSSS
				    //##########################################################################
				//    player.angle -= this.angle;

			//	    $('#status').html("You were hit, OW! You lost " + this.attack + " health points.");		
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