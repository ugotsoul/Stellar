function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x;
    this.y = y;
    this.r = r || 50;
    this.id = 0;
    this.drag = .001;
    this.speed = 10;
    this.maxV = 250;

}

Player.prototype = Object.create(GameObject.prototype);

Player.prototype.move = function () {

        switch(moveType) {
            case 'up':      
            this.vY -= this.speed;
            break;

            case 'down': 
            this.vY += this.speed;              
            break;

            case 'left':
            this.vX -= this.speed;            
            break;

            case 'right':
            this.vX += this.speed;
            break;
        }
    }


Player.prototype.draw = function() {
    
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

            var new_opacity = getRandomNum(.7, .8);
            // var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR);
            // g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
            // g.addColorStop(.85, 'rgba(255,239,0,' + (new_opacity * .70) + ')');
            // g.addColorStop(1.0, 'rgba(255,239,0,0)');
            ctx.fillStyle = "green";
            ctx.fill();
       		}

            //center coordinates of player object
            ctx.fillStyle = '#000';
            ctx.font = "bold 8pt Sans-Serif";
            ctx.textAlign = 'center';
            ctx.fillText('Game World', drawX, drawY-10);
            ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), drawX, drawY);
            ctx.fillText('Draw World', drawX, drawY+10);
            ctx.fillText('X: ' + Math.floor(drawX) + ' Y: ' + Math.floor(drawY), drawX, drawY+20);
     
    }