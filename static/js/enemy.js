(function() {
    var Enemy = ENGINE.enemyConstr = function(x, y, r, id) {
        ENGINE.GameObjectConstr.apply(this, arguments);

        //enemy attributes
        this.id = id;
        this.drag = 0.01 * this.r;
        this.speed = ENGINE.randomInteger(5, 30);

        //death and win state criteria 
        this.minMass = 10;
        this.maxMass = 75;

        this.maxV = 75; //this.velocity();
        this.strength = this.r / 10;

        //player score
        this.points = this.r * 10;

        //assign random directions/speeds to each enemy
        this.vX = ENGINE.randomInteger(-50, 50);
        this.vY = ENGINE.randomInteger(-50, 50);
    };

    Enemy.prototype = Object.create(ENGINE.GameObjectConstr.prototype);

    //Mood param identifies if an object is edible or not edible
    Object.defineProperty(Enemy.prototype, 'mood', {
        get: function() {

            //find the difference between enemy and player radii

            if (this.r < Math.floor(ENGINE.GAME.playerMass * 0.50)) {
                return 200;
            } else if (this.r < ENGINE.GAME.playerMass) {
                return 120;
            } else {
                return 0;
            }
        }
    });


    Enemy.prototype.interact = function(dt) {

        var self = this;

        self.radar();

        self.checkMatterLoss();

        self.unhide();

        if (self.matterLoss === true) {
            self.payment();
        }

        return ENGINE.GameObjectConstr.prototype.interact.call(this, dt);
    };


    Enemy.prototype.checkMatterLoss = function() {

        //record x, y for distance calculation
        var currentPayment = Date.now();

        var self = this;

        if (currentPayment - self.lastPayment > 1000) {

            //check vX or vY is greater than 20:

            var speed = ENGINE.vector.magnitude([self.vX, self.vY]);
            var angleSpeed = ENGINE.vector.angle([self.x + self.vX * 60, self.y + self.vY * 60]) * (180 / Math.PI);
            var matterLossSpeed = 30;

            if (speed > matterLossSpeed) {
                //console.log('angle speed:' + angleSpeed);
                self.matterLoss = true;
            }
        }
    };

    Enemy.prototype.radar = function() {

        //check for neighbors within 5 times the radius of the current enemy object

        for (var i = 0; i < ENGINE.GAME.gameObjects.length; i++) {

            var element = ENGINE.GAME.gameObjects[i];

            var self = this;

            if ((element.id != self.id) && (element.hide === false)) {

                var distance = ENGINE.vector.distance(self, element);

                var neighboorLength = ENGINE.vector.magnitude(distance);

                var radarLength = Math.floor(self.r * 6);

                var angle = ENGINE.vector.angle(distance);

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
            var sprintSpeed = self.speed * 2;
            if (self.r < element.r) {
                self.vX += sprintSpeed * Math.cos(angle);
                self.vY += sprintSpeed * Math.sin(angle);
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
                element.r += self.r;
                self.death = true;

                if (element instanceof ENGINE.playerConstr) {
                    element.kills++;
                }
            } else {
                self.r -= element.strength;
                element.r += element.strength;

                if (element instanceof ENGINE.playerConstr) {
                    element.points++;
                }
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

        var drawX = this.x - ENGINE.GAME.viewX;
        var drawY = this.y - ENGINE.GAME.viewY;

        if (this.r > 0) {

            ctx.beginPath();
            ctx.arc(drawX, drawY, this.r, 0, Math.PI * 2, false);
            ctx.closePath();

            //##################################
            //Twinkle Effect
            //##################################

            var new_opacity = ENGINE.randomFloat(0.5, 0.6);

            var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.r);
            g.addColorStop(0.0, 'rgba(255,' + this.mood + ',' + this.mood + ',' + new_opacity + ')');
            g.addColorStop(0.75, 'rgba(200,' + this.mood + ',0,' + (new_opacity * 0.7) + ')');
            g.addColorStop(1.0, 'rgba(200,' + this.mood + ',0,0)');
            ctx.fillStyle = g;
            ctx.fill();
        }
    };

})();