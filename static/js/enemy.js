function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    //enemy attributes
    this.x = x; 
    this.y = y; 
    this.r = r;
    this.strength = 5;
    this.id = id;
    this.drag = .00001;

    //assign random directions/speeds to each enemy
    this.vX = 1; //getRandomInteger(-50, 50);
    this.vY = 1; //getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);

Enemy.prototype.attack = function (element) {

        //define the maximum enemy mass allowed before player loses
        var maxMass = player.r * 7;
        var minMass = 10;
        var tick = 100;

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
                self.r += .1;
                element.r -= .1;
        }

        //eat enemies smaller than yourself
        else if (self.r < element.r) {
            console.log('player is gaining mass');
            self.r -= .1;
            element.r += .1;
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
                self.r -= .05;
                killArr[1] += .05;
            }
            else {
                $('#status').html('Random Attack: enemy2 is gaining mass');
                self.r += .05;
                killArr[0] -= .05;
            }
        }
    }

Enemy.prototype.draw = function(nextX, nextY) {

    var drawX = this.x - nextX;
    var drawY = this.y - nextY;

        if (this.r > 0) {

        ctx.beginPath();
        ctx.arc(drawX, drawY, this.r, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################
        var new_opacity = getRandomNum(.5, .6);

        g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.r * .95);
        g.addColorStop(0.0, 'rgba(60,255,255,' + new_opacity + ')');
        g.addColorStop(.75, 'rgba(0,60,255,' + (new_opacity * .7) + ')');
        g.addColorStop(1.0, 'rgba(0,60,255,0)');
        ctx.fillStyle = g;
        ctx.fill();

        //center coordinates of player object
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x-this.r-nextX-5, this.y-nextY-10,75,15);
        ctx.fillStyle = '#000';
        ctx.font = "bold 8pt Sans-Serif";
        ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), this.x-nextX, this.y-nextY);
        }
    }
