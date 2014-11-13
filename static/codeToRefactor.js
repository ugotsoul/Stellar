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

//####################################
//Create Player and Enemy Objects
//####################################

Player.prototype = Object.create(GameObject.prototype);
Enemy.prototype = Object.create(GameObject.prototype);

Player.prototype.move = function (moveType) {

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

GameObject.prototype.displacement = function(element) {
            //vector subtraction yields the hypotenuse of the triangle law

            //get distance array object
            var distance = this.displacementVector(element);

            //get the hypotenuse 
            var moveLength = Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]);
            
            return moveLength;
        }

        //########################################
        // AABB check - overlapping bounding boxes
        //########################################


GameObject.prototype.collisionDetect = function (element) {
        	//get the length of the distance from center of player to element
        	return this.displacement(element) <= (this.r+element.r);
        }

GameObject.prototype.reboundDirection = function(element, dt) {

        	//######################################################################################
        	//HTML5 Canvas guide - Multiple Collisions w/ the equation for conservation of momentum
        	//######################################################################################

        	//displacement vector (x,y) array
			var displacement = this.displacementVector(element);
        	var collisionAngle = Math.atan2(displacement[0], displacement[1]);
        	//velocity vectors
        	var speedThis = Math.sqrt(this.vX*this.vX + this.vY*this.vY);
        	var speedElement = Math.sqrt(element.vX*element.vX + element.vY*element.vY);
        	
        	//angles at current velocities
        	var directionThis = Math.atan2(this.vX, this.vY); 
        	var directionElement =  Math.atan2(element.vX, element.vY); 

        	//rotate vectors counter clockwise - make the angle of collision flat
        	var vRotationTx = speedThis * Math.cos(directionThis - collisionAngle);        	
        	var vRotationTy = speedThis * Math.sin(directionThis - collisionAngle);
        	var vRotationEx = speedElement * Math.cos(directionElement - collisionAngle);
        	var vRotationEy = speedElement * Math.sin(directionElement - collisionAngle);

        	//update velocities of this game object and other game object (element) - note the y velocity remains constant
        	var finalVx1 = ((this.r - element.r) * vRotationTx + (2 * element.r) * vRotationEx)/(this.r + element.r);
        	var finalVx2 = ((this.r * 2) * vRotationTx + (element.r - this.r) * vRotationEx)/(this.r + element.r);

        	var finalVy1 = vRotationTy;
        	var finalVy2 = vRotationEy;

        	//rotate the angles back again so the collision angle is preserved

        	this.vX = Math.cos(collisionAngle) * finalVx1 + Math.cos(collisionAngle + Math.PI/2) * finalVy1; 	
        	this.vY = Math.sin(collisionAngle) * finalVx1 + Math.sin(collisionAngle + Math.PI/2) * finalVy1;
        	
        	element.vX = Math.cos(collisionAngle) * finalVx2 + Math.cos(collisionAngle + Math.PI/2) * finalVy2;
        	element.vY = Math.sin(collisionAngle) * finalVx2 + Math.sin(collisionAngle + Math.PI/2) * finalVy2;

        	//update objects position @ x,y

        	this.x = (this.x += this.vX * dt);
        	this.y = (this.y += this.vY * dt);
        	element.x = (element.x += element.vX * dt);
        	element.y = (element.y += element.vY * dt);

        	console.log('Rebounded!');   
        }


        //check if player hits game boundries
    GameObject.prototype.interact = function (dt) {

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
    				//console.log('checking for other game elements');
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


        //draw method
        GameObject.prototype.draw = function() {

        	//player size & style
            ctx.fillStyle = this.fill;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();

            //center coordinates of game element object
            ctx.fillStyle = '#000';
            ctx.font = "bold 8pt Sans-Serif";
            ctx.fillText('X: ' + this.x + ' Y: ' + this.y, this.x - 40, this.y + 20);

            //below is player status info
            ctx.fillStyle = '#000';
            ctx.font = "bold 12pt Sans-Serif";
            ctx.fillText('Your X velocity is '+ Math.abs(this.vX), 50, 25);
            ctx.fillText('Your Y velocity is '+ Math.abs(this.vY), 50, 50);
            ctx.fillText('You mass is ' + this.mass + '.', 50, 100);

        }
    }


    