function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x;
    this.y = y;
    this.r = r || 20;
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
   		}
    }