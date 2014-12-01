function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    
    //enemy attributes
    this.id = id;
    this.drag = .0000001*this.r;
    this.speed = 100/this.r;

    //death and win state criteria 
    this.minMass = 10;
    this.maxMass = 150;

    this.maxV =  50; //this.velocity();
    this.strength = Math.floor(this.r/10);

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);


//Mood param identifies if an object is edible or not edible
Object.defineProperty(Enemy.prototype, 'mood', {get: function(){

    //find the difference between enemy and player radii

    if (this.r < Math.floor(game.playerMass*.50)){
        return 200;
    }

    else if (this.r < Math.floor(game.playerMass*.85)){
        return 100;
    }

    else if (this.r < game.playerMass){
        return 50;
    }

    else {
        return 0;
    }
}}); 

//restrict enemy max velocity
// Enemy.prototype.velocity = function(){

//     if (this.r < 20){
//         return 1000/this.r; 
//     }

//     if (this.r > 50){
//         return 50;
//     }

//     else {
//         return 1000/this.r;
//     }

// }

Enemy.prototype.interact = function(dt) {

    this.radar();
    
    return GameObject.prototype.interact.call(this, dt);
}

Enemy.prototype.update = function(dt) {

    var currentPayment = Date.now();

    if (currentPayment - this.lastPayment > 5000 && self.r > 10){
        this.matterLoss = true;
        this.payment();
    }


    return GameObject.prototype.update.call(this, dt);
}


Enemy.prototype.radar = function() {

    //check for neighbors within 5 times the radius

    for (var i = 0; i < game.gameObjects.length; i++) {
        
        var element = game.gameObjects[i];
            
        var self = this;
        
        if (element.id != self.id) {

            //raw distance from other object
            var distance = vector.distance(self, element);

            var neighboorLength = vector.magnitude(distance);

            var radarLength = Math.floor(self.r*10);

            var angle = vector.angle(distance);

            //check if element falls within radar length
            if (neighboorLength < radarLength) {
                
                if (self.r > element.r) {
                    self.vX -= (self.speed+self.strength) *Math.cos(angle);
                    self.vY -= (self.speed+self.strength) *Math.sin(angle);
                    return;
                }

                else if (self.r < element.r) {
                    self.vX += self.speed *Math.cos(angle);
                    self.vY += self.speed *Math.sin(angle);
                    return;
                }

                else {
                    //console.log('Trying to move away');
                    self.vX += neighboorLength *Math.cos(angle);
                    self.vY += neighboorLength *Math.sin(angle);
                    return;
                }
            }
        }
    }
}

Enemy.prototype.attack = function (element) {

        //get the current this object to manipulate the instance
        var self = this;

        if (self.r < self.minMass && element instanceof Enemy) {
            element.r += self.strength;
            self.death = true;
            return;
        }

        else if (self.r < self.minMass && element instanceof Player)  {
                element.r += self.strength;
                self.death = true;
                element.kills++
                return;
            }

        if (self.r > element.r) {
                self.r += self.strength;
                element.r -= self.strength;
                return;
        }

        //eat enemies smaller than yourself
        else if (self.r < element.r) {
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
                return;
            }
            else {
                self.r += self.strength;
                killArr[0] -= self.strength;
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
        g.addColorStop(0.0, 'rgba(255,'+this.mood+','+this.mood+',' + new_opacity + ')');
        g.addColorStop(.75, 'rgba(200,'+this.mood+',0,' + (new_opacity * .7) + ')');
        g.addColorStop(1.0, 'rgba(200,'+this.mood+',0,0)');
        ctx.fillStyle = g;
        ctx.fill();
    }

    return;
}

