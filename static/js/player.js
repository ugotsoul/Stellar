function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x || 500;
    this.y = y || 300;
    this.r = r || 20;
    this.fill = 'red';
    this.id = 0;
    this.drag = .005;
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

        if (this.r > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();

        //##################################
        //Star effect - pretty stuff
        //##################################

        var new_opacity = getRandomNum(.7, .8);
        g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
        g.addColorStop(.85, 'rgba(255,239,0,' + (new_opacity * .70) + ')');
        g.addColorStop(1.0, 'rgba(255,239,0,0)');
        ctx.fillStyle = g;
        ctx.fill();

        //###############################################
        // Below code is to draw coordinates & check math
        //###############################################

        //center coordinates of enemy object
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 8pt Sans-Serif";
        ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), this.x - this.r - 10, this.y + this.r + 10);

        //player center distance from enemy center
        //change this to a div
        ctx.fillStyle = '#FFF';
        ctx.font = "bold 12pt Sans-Serif";
        ctx.textAlign = "start";
        ctx.fillText('Kill Count: ' + playerKills, 50, 25);
        ctx.fillText('Your X velocity is ' + Math.floor(this.vX), 50, 50);
        ctx.fillText('Your Y velocity is ' + Math.floor(this.vY), 50, 75);
        ctx.fillText('Your mass is ' + Math.floor(this.r) + '.', 50, 100);
   		}
    }