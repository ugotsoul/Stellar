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

    //death and win state criteria 
    this.minMass = 10;
    this.maxMass = 150;

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);

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
                $('#status').html('Random Attack: enemy1 is gaining mass');
                self.r -= self.strength;
                killArr[1] += self.strength;
            }
            else {
                $('#status').html('Random Attack: enemy2 is gaining mass');
                self.r += self.strength;
                killArr[0] -= self.strength;
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
            g.addColorStop(0.0, 'rgba(60,255,255,' + new_opacity + ')');
            g.addColorStop(.75, 'rgba(0,60,255,' + (new_opacity * .7) + ')');
            g.addColorStop(1.0, 'rgba(0,60,255,0)');
            ctx.fillStyle = g;
            ctx.fill();

        }
    }