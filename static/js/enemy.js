function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    //enemy attributes
    this.x = x; 
    this.y = y; 
    this.r = r;
    this.strength = this.r/50;
    this.id = id;
    this.drag = .00001;
    this.maxV = 75;

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);

Enemy.prototype.update = function(dt) {

    //this.payment();

    var currentTime = Date.now();

    var self = this;

    // if (currentTime - self.lastPayment > 5000) {
        
    //     if (self.r > 10){
    //     self.matterLoss = true;
    //     }
    // }

    return GameObject.prototype.update.call(this, dt);
}

Enemy.prototype.direction = function() {

    var distArr = [this.x, this.y];

    var tail = this.r + this.r/2;

    var angle = Math.atan2(distArr[1], distArr[0]);

    //length of food - poop tail from enemy object
    var foodArr = [this.x - tail*Math.cos(angle), this.y - tail*Math.sin(angle)];
    
    console.log('Distance from Enemy butt: ', distArr);

    return foodArr;
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

        // if (player.r <= minMass || self.r >= maxMass) {
        //     //if player radius/mass lower than 10 pixels, death!
        //     player.death = true;
        //     return;
        // }

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

        if (this.r > 0) {

            ctx.beginPath();
            ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2, false);
            ctx.closePath();

            //##################################
            //Twinkle Effect
            //##################################
            var new_opacity = getRandomNum(.5, .6);

            var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR * .95);
            g.addColorStop(0.0, 'rgba(255,0,0,' + new_opacity + ')');
            g.addColorStop(.75, 'rgba(200,0,0,' + (new_opacity * .7) + ')');
            g.addColorStop(1.0, 'rgba(200,0,0,0)');
            ctx.fillStyle = g;
            ctx.fill();

        }
    }
