function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    
    //enemy attributes
    this.id = id;
    this.drag = .001*this.r;
    this.speed = 100/this.r;

    //death and win state criteria 
    this.minMass = 10;
    this.maxMass = 75;

    this.maxV =  100; //this.velocity();
    this.strength = this.r/5;

    //player score
    this.points = this.r*10;

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-20, 20);
    this.vY = getRandomInteger(-20, 20);
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


Enemy.prototype.interact = function(dt) {

    this.radar();
    
    return GameObject.prototype.interact.call(this, dt);
}


Enemy.prototype.radar = function() {

    //check for neighbors within 5 times the radius of the current enemy object

    for (var i = 0; i < game.gameObjects.length; i++) {
        
        var element = game.gameObjects[i];
            
        var self = this;
        
        if (element.id != self.id) {

            var distance = vector.distance(self, element);

            var neighboorLength = vector.magnitude(distance);

            var radarLength = Math.floor(self.r*5);

            var angle = vector.angle(distance);

            //check if element falls within radar length
            if (neighboorLength < radarLength) {
                
                if (self.r > element.r) {
                    self.vX -= self.speed *Math.cos(angle);
                    self.vY -= self.speed *Math.sin(angle);

                }

                else if (self.r < element.r) {
                    self.vX += self.speed *Math.cos(angle);
                    self.vY += self.speed *Math.sin(angle);
                }

                else {
                    self.vX += neighboorLength + self.speed *Math.cos(angle);
                    self.vY += neighboorLength + self.speed *Math.sin(angle);
                }
            }
        }
    }
}

Enemy.prototype.attack = function (element) {

        var self = this;

        if (self.r > element.r) {
            
            if (self.r < self.maxMass){
                self.r += self.strength;
                element.r -= self.strength;
            }

            else {
                element.r -= self.strength;
            }
        }

        else if (self.r < element.r) {
            
            if (self.r <= self.minMass){
                element.r += self.strength;
                self.death = true;
                
                if (element instanceof Player){
                    element.kills++;
                }
            }

            else {
                self.r -= element.strength;
                element.r += element.strength;
            }
        }

        //fight! randomly choose between two objects of the same size
        else if (self.r == element.r) {
        
            var killArr = new Array();
            
            killArr.push(self.r);
            killArr.push(element.r);

            var i = Math.floor(Math.random()*killArr.length);

            if (i == 0) {
                self.r -= self.strength;
                killArr[1] += self.strength;
            }
            else {
                self.r += self.strength;
                killArr[0] -= self.strength;
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

        var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR);
        g.addColorStop(0.0, 'rgba(255,'+this.mood+','+this.mood+',' + new_opacity + ')');
        g.addColorStop(.75, 'rgba(200,'+this.mood+',0,' + (new_opacity * .7) + ')');
        g.addColorStop(1.0, 'rgba(200,'+this.mood+',0,0)');
        ctx.fillStyle = g;
        ctx.fill();
    }
}

