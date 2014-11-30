
//####################################
//Game Object Constructor Function
//####################################

function GameObject(x, y, r) {

    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = null;
    this.lastPayment = Date.now();
    this.matterLoss = false;

    //death and win state criteria 
    this.minMass = null;
    this.maxMass = null;

    this.viewX = this.x;
    this.viewY = this.y;

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

GameObject.prototype.displacementVector = function (element) {
            //get the distance between centers of player and enemy object
            var distance = new Array();

            //eX & eY are for the elements X, Y
            distance[0] = this.x - element.x;
            distance[1] = this.y - element.y;

            return distance;
        }

GameObject.prototype.displacement = function(element) {
            //get distance array object
            var distance = this.displacementVector(element);

            //get the hypotenuse 
            var moveLength = Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]);
            
            return moveLength;
        }

GameObject.prototype.collisionDetect = function (element) {
        	//get the length of the distance from center of player to element
        	return this.displacement(element) <= (this.r+element.r);
        }

GameObject.prototype.reboundDirection = function(element, dt) {

        	//###############################################################################################
        	//Modified HTML5 Canvas code for Multiple Collisions w/ the equation for conservation of momentum
        	//###############################################################################################

        	//displacement vector (x,y) array
			var displacement = this.displacementVector(element);

            //note: atan2 calculates the right handed coordinate system using (y, x) - canvas world is left handed coordinate system
        	var collisionAngle = Math.atan2(displacement[1], displacement[0]);
        	
            //speed - length of velocity vector
        	var speedThis = Math.sqrt(this.vX*this.vX + this.vY*this.vY);
        	var speedElement = Math.sqrt(element.vX*element.vX + element.vY*element.vY);
        	
        	//angles at current velocities
        	var directionThis = Math.atan2(this.vY, this.vX); 
        	var directionElement =  Math.atan2(element.vY, element.vX); 

        	//rotate vectors counter clockwise - make the angle of collision flat
        	var vRotationTx = speedThis * Math.cos(directionThis - collisionAngle);        	
        	var vRotationTy = speedThis * Math.sin(directionThis - collisionAngle);
        	var vRotationEx = speedElement * Math.cos(directionElement - collisionAngle);
        	var vRotationEy = speedElement * Math.sin(directionElement - collisionAngle);

            //Change Cofficient of Resitution 
            //Adapted from wiki entry on partially inelastic collision response
            var coefficientOfRestitution = .2; 
            var finalVx1 = (this.r * vRotationTx +  element.r * vRotationEx + coefficientOfRestitution*element.r*(vRotationEx- vRotationTx))/ (this.r + element.r);
            var finalVx2 = (this.r * vRotationTx +  element.r * vRotationEx + coefficientOfRestitution*this.r*(vRotationTx- vRotationEx))/ (this.r + element.r);
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

                collisionCount++
                
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


var collisionCount = 1;
//##############################################
// Payment System - Object Pooling & Creation
//##############################################

//this is a unique id to identify objects during collision response // attack
//so objects do not colide with themselves or hurt themselves
var foodID = 100;


GameObject.prototype.payment = function() {

    var self = this;
    
    var currentPayment = Date.now();

    if (self.matterLoss && (currentPayment - self.lastPayment > 500)){

        var maxFood = 1;
        var foodPool = [];

        var foodVector = self.direction();
        
        var foodX = foodVector[0];
        var foodY = foodVector[1];

        console.log('Food Vector Coordinates: ',foodX, foodY);
        // console.log('Displacement Vector: ', this.displacement());

        var foodR = 10;

        console.log('Food ID: ', foodID);

        //console.log(foodID);
        var tempFood = new Enemy(foodX, foodY, foodR, foodID);

        tempFood.vX = (self.vX*-1)* getRandomInteger(1,10);
        tempFood.vY = (self.vY*-1)* getRandomInteger(1,10);

        //add the food to the array of game objects
        game.gameObjects.push(tempFood);

        self.r -= 1;
        self.matterLoss = false;

        self.lastPayment = Date.now();
        self.mouseClick = null;
        
        foodID++;
    }

}