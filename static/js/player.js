(function() {
    var Player = ENGINE.playerConstr = function(x, y, r) {
        ENGINE.GameObjectConstr.apply(this, arguments);

        //player attributes
        this.r = r || 50;
        this.id = 0;
        this.drag = 0.0001;
        this.speed = 70;
        this.maxV = 150;
        this.mouseClick = null;

        //death and win state criteria 
        this.minMass = 20;
        this.maxMass = 150;
        this.kills = 0;
        this.strength = this.r / 5;
        this.points = 0;
    };

    Player.prototype = Object.create(ENGINE.GameObjectConstr.prototype);

    Object.defineProperty(Player.prototype, 'death', {
        get: function() {

            var self = this;

            if (self.r < self.minMass) {
                return self.death = true;
            } else {
                return self.death = false;
            }
        }
    });

    Player.prototype.update = function(dt) {

        if (this.mouseClick !== null) {

            this.move(dt);
        }

        return ENGINE.GameObjectConstr.prototype.update.call(this, dt);
    };


    Player.prototype.move = function(dt) {

        var angle = ENGINE.vector.angle(this.mouseClick);

        this.vX += Math.cos(angle) * this.speed;
        this.vY += Math.sin(angle) * this.speed;

        return this.matterLoss = true, this.payment();
    };


    Player.prototype.draw = function(ctx) {

        var drawX = this.x - ENGINE.GAME.viewX;
        var drawY = this.y - ENGINE.GAME.viewY;

        if (this.r > 0) {

            ctx.save();
            ctx.beginPath();
            ctx.arc(drawX, drawY, this.r, 0, Math.PI * 2, false);
            ctx.closePath();

            //######################################################
            //Twinkle effect - Change rgba to a fill param in player
            //######################################################

            var new_opacity = ENGINE.randomFloat(0.7, 0.8);
            var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.r);
            g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
            g.addColorStop(0.85, 'rgba(255,239,0,' + (new_opacity * 0.70) + ')');
            g.addColorStop(1.0, 'rgba(255,239,0,0)');
            ctx.fillStyle = g;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(drawX, drawY, this.r - 3, 0, Math.PI * 2, false);
            ctx.closePath();

            //ctx.setLineDash([3,2]);
            ctx.strokeStyle = '#2eff69';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#2eff69';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.stroke();

            ctx.restore();

            //#####################################################################
            // Test code below - Displays player coordinates in canvas & game world
            //#####################################################################

            //center coordinates of player object
            // ctx.fillStyle = '#000';
            // ctx.font = "bold 8pt Sans-Serif";
            // ctx.textAlign = 'center';
            // ctx.fillText('Game World', drawX, drawY-10);
            // ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), drawX, drawY);
            // ctx.fillText('Draw World', drawX, drawY+10);
            // ctx.fillText('X: ' + Math.floor(drawX) + ' Y: ' + Math.floor(drawY), drawX, drawY+20);
        }
    };

})();