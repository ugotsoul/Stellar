function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    //enemy attributes
    this.x = x; 
    this.y = y; 
    this.r = r;
    this.strength = Math.floor(this.r/5);
    this.id = id;
    this.drag = .00001*this.r;

    //death and win state criteria 
    this.minMass = 10;
    this.maxMass = 150;

    //max speed porportional to size of object
    //larger things move slower
    //smaller things move faster
    //make a max mass attribute
    this.maxV = Math.floor(1000/this.r);

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);


//Mood param identifies if an object is edible or not edible
Object.defineProperty(Enemy.prototype, 'mood', {get: function(){

    //find the difference between enemy and player radii

    if (this.r < Math.floor(player.r*.50)){
        return 200;
    }

    else if (this.r < Math.floor(player.r*.85)){
        return 100;
    }

    else {
        return 0;
    }

    //if larger, change the color to red - player is edible

}}); 

Enemy.prototype.interact = function(dt) {

    this.radar();

    //this.payment();

    // var currentTime = Date.now();

    // var self = this;

    // if (currentTime - self.lastPayment > 1000) {
        
    //     if (self.r > 10){
    //     self.matterLoss = true;
    //     }
    // }

    return GameObject.prototype.interact.call(this, dt);
}

Enemy.prototype.direction = function() {

    var distArr = [this.x, this.y];

    var tail = this.r + Math.floor(this.r/2);

    var angle = Math.atan2(distArr[1], distArr[0]);

    //length of food - poop tail from enemy object
    var foodArr = [this.x - tail*Math.cos(angle), this.y - tail*Math.sin(angle)];
    
    //console.log('Distance from Enemy butt: ', distArr);

    return foodArr;
}


Enemy.prototype.radar = function() {

    //check for neighbors within 5 times the radius

    for (var i = 0; i < game.gameObjects.length; i++) {
        
        var element = game.gameObjects[i];
            
        var self = this;
        
        if (element.id != self.id) {

            var neighboorLength = self.displacement(element);

            var displacement = self.displacementVector(element);

            var radarLength = Math.floor(self.r*self.r*Math.PI);

            var angle = Math.atan2(displacement[1], displacement[0]);

            //check if element falls within radar length
            if (neighboorLength < radarLength) {

                if (self.r > element.r) {

                    //console.log('Trying to eat stuff');
                    self.vX -= self.strength*Math.cos(angle);
                    self.vY -= self.strength *Math.sin(angle);
                    return;
                }

                else {
                    //console.log('Trying to move away');
                    self.vX += self.strength *Math.cos(angle);
                    self.vY += self.strength *Math.sin(angle);
                    return;
                }

            }

        }
    }

    return;
}

Enemy.prototype.attack = function (element) {

        //get the current this object to manipulate the instance
        var self = this;

        if (self.r < self.minMass && element instanceof Enemy) {
            element.r += self.strength;
            self.death = true;
            console.log('Enemy killed enemy');
            return;
        }

        else if (self.r < self.minMass && element instanceof Player)  {
                element.r += self.strength;
                self.death = true;
                element.kills++
                console.log('Player killed enemy');
                console.log('Player kill count: ',element.kills);
                return;
            }

        if (self.r > element.r) {
                console.log('enemy is gaining mass');
                self.r += self.strength;
                element.r -= self.strength;
                return;
        }

        //eat enemies smaller than yourself
        else if (self.r < element.r) {
            console.log('player is gaining mass');
            self.r -= self.strength;
            element.r += self.strength;
            return;
        }

        else if (self.r == element.r) {
            //randomly choose which one will be eaten
            var killArr = new Array();
            killArr.push(self.r);
            killArr.push(element.r);

            var i = Math.floor(Math.random()*killArr.length);

            //kill one of the game objects
            if (i == 0) {
                self.r -= self.strength;
                killArr[1] += self.strength;
                console.log('enemy1 gains mass');
                return;
            }
            else {
                self.r += self.strength;
                killArr[0] -= self.strength;
                console.log('enemy2 gains mass');
                return;
            }
        }
    }

Enemy.prototype.draw = function(ctx) {

    var drawX = this.x - game.viewX;
    var drawY = this.y - game.viewY;
    var drawR = this.r;

        if (this.r > 0 ) {

            ctx.beginPath();
            ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2, false);
            ctx.closePath();

            //##################################
            //Twinkle Effect
            //##################################

            var new_opacity = getRandomNum(.5, .6);

            var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR * .95);
            g.addColorStop(0.0, 'rgba(255,'+this.mood+',0,' + new_opacity + ')');
            g.addColorStop(.75, 'rgba(200,'+this.mood+',0,' + (new_opacity * .7) + ')');
            g.addColorStop(1.0, 'rgba(200,'+this.mood+',0,0)');
            ctx.fillStyle = g;
            ctx.fill();

        }
    }

