function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    //enemy attributes
    this.x = x; 
    this.y = y; 
    this.r = r;
    this.strength = 1;
    this.id = id;
    this.drag = .00001;

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);

Enemy.prototype.attack = function (element) {

        //define the maximum enemy mass allowed before player loses
        var maxMass = player.r * 7;
        var minMass = 10;

        //get the current this object to manipulate the instance
        var self = this;

        if (self.r <= minMass) {
            self.death = true;
            console.log('enemy died');
            return;
        }

        if (player.r <= minMass || self.r >= maxMass) {
            //if player radius/mass lower than 20 pixels, death!
            player.death = true;
            return;
        }

        if (self.r > element.r) {
                console.log('enemy is gaining mass');
                self.r += self.strength;
                element.r -= self.strength;
        }

        //eat enemies smaller than yourself
        else if (self.r < element.r) {
            console.log('player is gaining mass');
            self.r -= self.strength;
            element.r += self.strength;
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

Enemy.prototype.draw = function() {

    var drawX = this.x - game.viewX;
    var drawY = this.y - game.viewY;
    var drawR = this.r;

        if (this.r > 0) {

        ctx.beginPath();
        ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################
        var new_opacity = getRandomNum(.5, .6);

        var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR * .95);
        g.addColorStop(0.0, 'rgba(60,255,255,' + new_opacity + ')');
        g.addColorStop(.75, 'rgba(0,60,255,' + (new_opacity * .7) + ')');
        g.addColorStop(1.0, 'rgba(0,60,255,0)');
        ctx.fillStyle = g;
        ctx.fill();

        //center coordinates of enemy object
        ctx.fillStyle = '#0f0';
        ctx.fillRect(drawX, drawY,75,15);
        ctx.fillStyle = '#000';
        ctx.font = "bold 8pt Sans-Serif";
        ctx.textAlign = 'left';
        ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), drawX, drawY+10);
        }
    }
