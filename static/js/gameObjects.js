
//####################################
//Game Object Constructor Function
//####################################

function GameObject(x, y, r) {

    this.x = x;
    this.y = y;
    this.r = r;

    this.lastPayment = Date.now();
    this.matterLoss = false;
    this.id = null;
    this.death = null;

    //death and win state criteria 
    this.minMass = null;
    this.maxMass = null;

    this.speed = null;
    this.vX = 1;
    this.vY = 1;

    //Distance traveled in 1 timestep: this is the incriment of vX & vY divided by the timestep (x pixels per 1/FPS)
    this.dx = 0;
    this.dy = 0;

    //restrict the speed of game object movement
    this.maxV = null;
    this.drag = null;

    //Animation attributes - glowing orb effect
    this.stop = Math.random() * .2 + .4;

}



GameObject.prototype.update = function(dt) {

        //calculate angle of movement along a vector
        this.dx = (this.vX * dt);
        this.dy = (this.vY * dt);
        
        //move element along vector
        this.x += this.dx;
        this.y += this.dy;

        //limit speed of vectors
        if (this.vX > this.maxV) {
            this.vX = this.maxV;
        }

        else if (this.vX < -this.maxV) {
            this.vX = -this.maxV;
        } 

        if (this.vY > this.maxV) {
            this.vY = this.maxV;
        }

        else if (this.vY < -this.maxV) {
            this.vY = -this.maxV;
        }

        //decriment speed the vectors of X & Y
        this.vX -= this.vX * this.drag;
        this.vY -= this.vY * this.drag;

        //interact handles collision detection and response
        this.interact(dt);
        
}

// GameObject.prototype.displacementVector = function (element) {
//             //get the distance between centers of player and enemy object
//             var distance = new Array();

//             //eX & eY are for the elements X, Y
//             distance[0] = this.x - element.x;
//             distance[1] = this.y - element.y;

//             return distance;
//         }

// GameObject.prototype.displacement = function(element) {
//             //get distance array object
//             var distance = this.displacementVector(element);

//             //get the hypotenuse 
//             var moveLength = Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]);
            
//             return moveLength;
//         }

GameObject.prototype.collisionDetect = function (element) {
        	//get the length of the distance from center of player to element
            var distance = vector.distance(this, element);

        	return vector.magnitude(distance) <= (this.r+element.r);
        }

GameObject.prototype.reboundDirection = function(element, dt) {

        	//###############################################################################################
        	//Modified HTML5 Canvas code for Multiple Collisions w/ the equation for conservation of momentum
        	//###############################################################################################

            //displacement vector (x,y) array
            var displacement = vector.distance(this, element);

            //note: atan2 calculates the right handed coordinate system using (y, x) - canvas world is left handed coordinate system
            var collisionAngle = vector.angle(displacement);

            //get the rotation matrix
            var rotation = vector.rotation(this, element, collisionAngle);

            var finalV = vector.momentum(this, element, rotation);

        	//rotate the angles back again so the collision angle is preserved
        	this.vX = Math.cos(collisionAngle) * finalV[0][0]+ Math.cos(collisionAngle + Math.PI/2) * finalV[0][1]; 	
        	this.vY = Math.sin(collisionAngle) * finalV[0][0]+ Math.sin(collisionAngle + Math.PI/2) * finalV[0][1];
        	
        	element.vX = Math.cos(collisionAngle) * finalV[1][0] + Math.cos(collisionAngle + Math.PI/2) * finalV[1][1];
        	element.vY = Math.sin(collisionAngle) * finalV[1][0] + Math.sin(collisionAngle + Math.PI/2) * finalV[1][1];

        	//update objects position @ x,y
        	this.x = (this.x += this.vX * dt);
        	this.y = (this.y += this.vY * dt);
        	element.x = (element.x += element.vX * dt);
        	element.y = (element.y += element.vY * dt);

        }

GameObject.prototype.interact = function (dt) {

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

		for (var i = 0; i < game.gameObjects.length; i++) {
			var element = game.gameObjects[i];
			
            if (element.id != this.id) {
		    	
                if (this.collisionDetect(element)) {
                
                    //console.log('trying to rebound');
		    		this.reboundDirection(element, dt);

                    //Note: enemy handles all attack behavior
                    if (element instanceof Enemy) {
                        element.attack(this);
                    }
	    		}
		    }
        }   
	}


//##############################################
// Payment System - Object Pooling & Creation
//##############################################


GameObject.prototype.poop = function() {

    //the scalar below is trival distance away from player
    var tail = Math.floor(this.r * 1.5);

        if (this instanceof Player){
            var angle = vector.angle(this.mouseClick);
        }

        else {
            //need the unit vector of enemy several steps in the future
            var angle = vector.angle([(this.x*this.x*this.vX), (this.y*this.y*this.vY)]);
            //console.log('Enemy trying to poop');
        }

    //length of food - poop tail from game object
    var foodArr = [this.x - tail*Math.cos(angle), this.y - tail*Math.sin(angle)];
    
    return foodArr;
}


//this is a unique id to identify objects during collision response // attack
//so objects do not colide with themselves or hurt themselves
var foodID = 100;


GameObject.prototype.payment = function() {

    var self = this;
    
    var currentPayment = Date.now();

    var maxEnemies = 150;

    if (self.matterLoss && (currentPayment - self.lastPayment > 500)){

        var foodVector = self.poop();
        
        var foodX = foodVector[0];
        var foodY = foodVector[1];

        var foodR = Math.floor(self.r/5);

        console.log('Food ID: ', foodID);

        //console.log(foodID);
        var tempFood = new Enemy(foodX, foodY, foodR, foodID);

        tempFood.vX = (self.vX*-1);
        tempFood.vY = (self.vY*-1);

        //add the food to the array of game objects
        game.gameObjects.push(tempFood);

        self.r -= 2;
        self.matterLoss = false;

        if (self instanceof Player){
            self.mouseClick = null;
            self.lastPayment = Date.now();
        }

        else {
            self.lastPayment = Date.now();
        }
        
        foodID++;
        return;
    }

}