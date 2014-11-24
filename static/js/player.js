function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x;
    this.y = y;
    this.r = r || 100;
    this.id = 0;
    this.drag = .001;
    this.speed = 10;
}

Player.prototype = Object.create(GameObject.prototype);

Player.prototype.move = function (moveType) {

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
    
    var drawX = this.x/2 - game.viewX;
    var drawY = this.y/2 - game.viewY;
    var drawR = this.r/2;

        if (this.r > 0) {

//check if player is in the game world bounds

        ctx.beginPath();
        ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################

        var new_opacity = getRandomNum(.7, .8);
        g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR);
        g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
        g.addColorStop(.85, 'rgba(255,239,0,' + (new_opacity * .70) + ')');
        g.addColorStop(1.0, 'rgba(255,239,0,0)');
        ctx.fillStyle = g;
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