function Enemy(x, y, r, id) {
    GameObject.apply(this, arguments);

    //enemy attributes
    this.id = id;
    this.drag = 0.001 * this.r;
    this.speed = 100 / this.r;

    //death and win state criteria 
    this.minMass = 10;
    this.maxMass = 75;

    this.maxV = 75; //this.velocity();
    this.strength = this.r / 5;

    //player score
    this.points = this.r * 10;

    //assign random directions/speeds to each enemy
    this.vX = window.math.getRandomInteger(-20, 20);
    this.vY = window.math.getRandomInteger(-20, 20);
}

Enemy.prototype = Object.create(GameObject.prototype);

//Mood param identifies if an object is edible or not edible
Object.defineProperty(Enemy.prototype, 'mood', {
    get: function() {

        //find the difference between enemy and player radii

        if (this.r < Math.floor(game.playerMass * 0.50)) {
            return 200;
        } else if (this.r < Math.floor(game.playerMass * 0.85)) {
            return 120;
        } else {
            return 0;
        }
    }
});


Enemy.prototype.interact = function(dt) {

    this.radar();

    var self = this;

    self.checkMatterLoss();

    self.unhide();

    if (self.matterLoss === true) {
        self.payment();
    }

    return GameObject.prototype.interact.call(this, dt);
};


Enemy.prototype.checkMatterLoss = function() {

    //record x, y for distance calculation
    var currentPayment = Date.now();

    var self = this;

    if (currentPayment - self.lastPayment > 1000) {

        //check vX or vY is greater than 20:

        var speed = window.math.vectorMagnitude([self.vX, self.vY]);
        var angleSpeed = window.math.vectorAngle([self.x + self.vX * 60, self.y + self.vY * 60]) * (180 / Math.PI);
        var matterLossSpeed = 30;

        if (speed > matterLossSpeed) {
            //console.log('angle speed:' + angleSpeed);
            self.matterLoss = true;
        }
    }
};

Enemy.prototype.radar = function() {

    //check for neighbors within 5 times the radius of the current enemy object

    for (var i = 0; i < game.gameObjects.length; i++) {

        var element = game.gameObjects[i];

        var self = this;

        if ((element.id != self.id) && (element.hide === false)) {

            var distance = window.math.vectorDistance(self, element);

            var neighboorLength = window.math.vectorMagnitude(distance);

            var radarLength = Math.floor(self.r * 8);

            var angle = window.math.vectorAngle(distance);

            //check if element falls within radar length
            if (radarLength > neighboorLength) {

                self.move(element, neighboorLength, angle);
            }
        }
    }
};

Enemy.prototype.move = function(element, length, angle) {

    var self = this;

    if (length > element.r + self.r) {
        if (self.r > element.r) {
            self.vX -= self.speed * Math.cos(angle);
            self.vY -= self.speed * Math.sin(angle);
        } else if (self.r < element.r) {
            self.vX += self.speed * Math.cos(angle);
            self.vY += self.speed * Math.sin(angle);
        } else {
            self.vX += length + self.speed * Math.cos(angle);
            self.vY += length + self.speed * Math.sin(angle);
        }
    } else {

        //enemy and element are close by: enemy will madly dart to or from element and try to save itself
        var sprintSpeed = self.speed * 10;

        if (self.r > element.r) {
            self.vX -= sprintSpeed * Math.cos(angle);
            self.vY -= sprintSpeed * Math.sin(angle);
        } else if (self.r < element.r) {
            self.vX += sprintSpeed * Math.cos(angle);
            self.vY += sprintSpeed * Math.sin(angle);
        } else {
            self.vX += length + sprintSpeed * Math.cos(angle);
            self.vY += length + sprintSpeed * Math.sin(angle);
        }
    }

};

Enemy.prototype.unhide = function() {

    var self = this;

    if (self.hide) {

        var visable = setInterval(function() {
            self.hide = false;
        }, 2000);
    }
};

Enemy.prototype.attack = function(element) {

    var self = this;

    if (self.r > element.r) {

        if (self.r < self.maxMass) {
            self.r += self.strength;
            element.r -= self.strength;
        } else {
            element.r -= self.strength;
        }
    } else if (self.r < element.r) {

        if (self.r <= self.minMass) {
            element.r += self.strength;
            self.death = true;

            if (element instanceof Player) {
                element.kills++;
            }
        } else {
            self.r -= element.strength;
            element.r += element.strength;
        }
    }

    //fight! randomly choose between two objects of the same size
    else if (self.r == element.r) {

        var killArr = [];

        killArr.push(self.r);
        killArr.push(element.r);

        var i = Math.floor(Math.random() * killArr.length);

        if (i === 0) {
            self.r -= self.strength;
            killArr[1] += self.strength;
        } else {
            self.r += self.strength;
            killArr[0] -= self.strength;
        }
    }
};

Enemy.prototype.draw = function(ctx) {

    var drawX = this.x - game.viewX;
    var drawY = this.y - game.viewY;

    if (this.r > 0) {

        ctx.beginPath();
        ctx.arc(drawX, drawY, this.r, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Twinkle Effect
        //##################################

        var new_opacity = window.math.getRandomNum(0.5, 0.6);

        var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.r);
        g.addColorStop(0.0, 'rgba(255,' + this.mood + ',' + this.mood + ',' + new_opacity + ')');
        g.addColorStop(0.75, 'rgba(200,' + this.mood + ',0,' + (new_opacity * 0.7) + ')');
        g.addColorStop(1.0, 'rgba(200,' + this.mood + ',0,0)');
        ctx.fillStyle = g;
        ctx.fill();
    }
};