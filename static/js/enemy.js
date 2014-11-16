function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments); 
    //enemy attributes
    this.x = x; 
    this.y = y; 
    this.r = r;
    this.fill = "blue";
    this.strength = 5;
    this.id = id;

    this.drag = .00001;

    //assign random directions/speeds to each enemy
    this.vX = getRandomInteger(-50, 50);
    this.vY = getRandomInteger(-50, 50);
}

Enemy.prototype = Object.create(GameObject.prototype);

Enemy.prototype.attack = function (element) {

        //define the maximum enemy mass allowed before player loses
        var maxMass = element.r * 7;
        var tick = 100;

        //get the current this object to manipulate the instance
        var self = this;

        if (self.r <= 6) {
            self.death = true;
            console.log('enemy died');
            return;
        }

        if (player.r <= 10 || self.r >= maxMass) {
            //if player radius/mass lower than 20 pixels, death!
            player.death = true;
            return;
        }

        if (self.r > element.r) {

            //#####################################################################################################################
            //Below code only alters current object - What if I want to alter all the enemy objects size in relation to the player?
            //#####################################################################################################################

            //slowly gain mass
            console.log('enemy is gaining mass');
            var timer1 = setInterval(function() {
                self.r += .1;
                element.r -= .1;
            }, tick);

            setTimeout(function() {
                //console.log('clearing interval');
                clearInterval(timer1);
            }, tick*10);
        }

        //eat enemies smaller than yourself
        else if (self.r < element.r) {

            console.log('player is gaining mass');
            var timer3 = setInterval(function() {
                self.r -= .1;
                element.r += .1;
            }, tick);

            setTimeout(function() {
                //console.log('clearing interval');
                clearInterval(timer3);
            }, tick*10);
        }

        else if (self.r == element.r) {
            //randomly choose which one will be eaten
            var killArr = new Array();
            killArr.push(self.r);
            killArr.push(element.r);

            var i = Math.floor(Math.random()*killArr.length);

            //kill one of the game objects
            var timer2 = setInterval(function() {
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
            }, tick);
            setTimeout(function() {
                //console.log('clearing interval');
                clearInterval(timer2);
            }, tick*10);
        }

    }

Enemy.prototype.draw = function() {

        if (this.r > 0) {
        //enemy size & style
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################
        var new_opacity = getRandomNum(.5, .6);

        g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * .95);
        g.addColorStop(0.0, 'rgba(60,255,255,' + new_opacity + ')');
        g.addColorStop(.75, 'rgba(0,60,255,' + (new_opacity * .7) + ')');
        g.addColorStop(1.0, 'rgba(0,60,255,0)');
        ctx.fillStyle = g;
        ctx.fill();

        //###############################################
        // Below code is to draw coordinates & check math
        //###############################################

        //center coordinates of enemy object
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 8pt Sans-Serif";
        ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), this.x - this.r, this.y + this.r + 10);
        }
    }
