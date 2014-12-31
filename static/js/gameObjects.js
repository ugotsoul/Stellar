//####################################
//Game Object Constructor Function
//####################################

function GameObject(x, y, r) {

    this.x = Math.floor(x);
    this.y = Math.floor(y);
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

    this.hide = false;

    //Animation attributes - glowing orb effect
    this.stop = Math.random() * 0.2 + 0.4;

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
    } else if (this.vX < -this.maxV) {
        this.vX = -this.maxV;
    }

    if (this.vY > this.maxV) {
        this.vY = this.maxV;
    } else if (this.vY < -this.maxV) {
        this.vY = -this.maxV;
    }

    //decriment speed the vectors of X & Y
    this.vX -= this.vX * this.drag;
    this.vY -= this.vY * this.drag;

    //interact handles collision detection and response
    this.interact(dt);

};

GameObject.prototype.collisionDetect = function(element) {
    //get the length of the distance from center of player to element
    var distance = window.math.vectorDistance(this, element);

    return window.math.vectorMagnitude(distance) <= (this.r + element.r);
};

GameObject.prototype.reboundDirection = function(element, dt) {

    //###############################################################################################
    //Modified HTML5 Canvas Book code for Multiple Collisions
    //###############################################################################################

    //displacement window.math.vector(x,y) array
    var displacement = window.math.vectorDistance(this, element);

    //note: atan2 calculates the right handed coordinate system using (y, x) - canvas world is left handed coordinate system
    var collisionAngle = window.math.vectorAngle(displacement);

    //get the rotation matrix
    var rotation = window.math.rotationMatrix(this, element, collisionAngle);

    var finalV = window.math.momentumMatrix(this, element, rotation);

    //rotate the angles back again so the collision angle is preserved
    this.vX = Math.cos(collisionAngle) * finalV[0][0] + Math.cos(collisionAngle + Math.PI / 2) * finalV[0][1];
    this.vY = Math.sin(collisionAngle) * finalV[0][0] + Math.sin(collisionAngle + Math.PI / 2) * finalV[0][1];

    element.vX = Math.cos(collisionAngle) * finalV[1][0] + Math.cos(collisionAngle + Math.PI / 2) * finalV[1][1];
    element.vY = Math.sin(collisionAngle) * finalV[1][0] + Math.sin(collisionAngle + Math.PI / 2) * finalV[1][1];

    //update objects position @ x,y
    this.x = (this.x += this.vX * dt);
    this.y = (this.y += this.vY * dt);
    element.x = (element.x += element.vX * dt);
    element.y = (element.y += element.vY * dt);

};

GameObject.prototype.interact = function(dt) {

    if ((this.x + this.r) >= game.w) {
        this.vX = -this.vX;
        this.x = game.w - this.r;
    } else if ((this.x - this.r) <= game.x) {
        this.vX = -this.vX;
        this.x = this.r;
    } else if ((this.y - this.r) <= game.y) {
        this.vY = -this.vY;
        this.y = this.r;
    } else if (this.y + this.r >= game.h) {
        this.vY = -this.vY;
        this.y = game.h - this.r;
    }

    for (var i = 0; i < game.gameObjects.length; i++) {
        var element = game.gameObjects[i];

        if (element.id != this.id) {

            if (this.collisionDetect(element)) {

                this.reboundDirection(element, dt);

                //Note: enemy handles all attack behavior
                if (element instanceof Enemy) {
                    element.attack(this);
                }
            }
        }
    }
};


//##############################################
// Matter Payment System 
//##############################################

GameObject.prototype.poop = function() {

    //the scalar below is trival distance away from player, so the player does not immediately consume the matter lost.
    var tail = Math.floor(this.r * 1.5);

    if (this instanceof Player) {

        var angle = window.math.vectorAngle(this.mouseClick);
        var foodArr = [this.x - tail * Math.cos(angle), this.y - tail * Math.sin(angle)];
        return foodArr;

    }

    if (this instanceof Enemy) {

        var angleEnemy = window.math.vectorAngle([this.x + this.vX * 60, this.y + this.vY * 60]);
        var foodArrEnemy = [this.x - tail * Math.cos(angleEnemy), this.y - tail * Math.sin(angleEnemy)];
        return foodArrEnemy;
    }
};


GameObject.prototype.payment = function() {

    var self = this;

    var currentPayment = Date.now();

    if (self.matterLoss && (currentPayment - self.lastPayment > 500) && self.r > 10) {

        var foodVector = self.poop();
        var deathState = 10;

        if (foodVector) {

            var foodX = foodVector[0];
            var foodY = foodVector[1];

            //restrict size of poop to greater than radius = 5
            var foodR = Math.floor(self.r / 5);

            if (foodR < 10) {
                foodR = 5;
            }

            var tempFood = new Enemy(foodX, foodY, foodR, localStorage.foodID);

            tempFood.hide = true;

            tempFood.vX = (self.vX * -1);
            tempFood.vY = (self.vY * -1);

            //add the food to the array of game objects
            game.gameObjects.push(tempFood);


            if (self.r < self.minMass) {
                self.death = true;
            } else {

                self.r -= foodR / 2;
                self.matterLoss = false;
                self.lastPayment = Date.now();

                if (self instanceof Player) {
                    self.mouseClick = null;
                }
            }
            localStorage.foodID++;
        }
    }
};