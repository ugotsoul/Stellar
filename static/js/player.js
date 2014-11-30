function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x;
    this.y = y;
    this.r = r || 50;
    this.id = 0;
    this.drag = .0005;
    this.speed = this.r/2;
    this.maxV = 200;
    this.mouseClick = null;
    
    //death and win state criteria 
    this.minMass = 20;
    this.maxMass = 150;
    this.kills = 0;
    
    // this.moveType = {

    //     'up': false,
    //     'down': false,
    //     'left': false,
    //     'right': false
    // }

}

Player.prototype = Object.create(GameObject.prototype);

Object.defineProperty(Player.prototype, 'death', {get: function(){ 

    var self = this;

    if (self.r < self.minMass) {
        return self.death = true;
    }

    else {
        return self.death = false;
    }
}});

Player.prototype.update = function(dt) {

    if (this.mouseClick != null) {
        
        this.move(dt);
    }

    return GameObject.prototype.update.call(this, dt);
}

// Player.prototype.move = function () {

//     for (var direction in this.moveType) {

//         if (this.moveType[direction]) { 

//             switch(direction) {           
//                 case 'up':    
//                 this.vY -= this.speed;
//                 break;

//                 case 'down': 
//                 this.vY += this.speed;              
//                 break;

//                 case 'left':
//                 this.vX -= this.speed;            
//                 break;

//                 case 'right':
//                 this.vX += this.speed;
//                 break;
//             }

//         this.matterLoss = true;
//         }
//     }
    
//     this.payment();
// }



Player.prototype.move = function (dt) {

    var angle = vector.angle(this.mouseClick);

    this.vX += Math.cos(angle) * this.speed;
    this.vY += Math.sin(angle) * this.speed;

    this.matterLoss = true;
    this.payment();
}


Player.prototype.draw = function(ctx) {
    
    var drawX = this.x - game.viewX;
    var drawY = this.y - game.viewY;
    var drawR = this.r;

        if (this.r > 0) {

            ctx.beginPath();
            ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2, false);
            ctx.closePath();

            //######################################################
            //Twinkle effect - Change rgba to a fill param in player
            //######################################################

            var new_opacity = getRandomNum(.7, .8);
            var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR);
            g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
            g.addColorStop(.85, 'rgba(255,239,0,' + (new_opacity * .70) + ')');
            g.addColorStop(1.0, 'rgba(255,239,0,0)');
            ctx.fillStyle = g;
            ctx.fill();
            
       		}


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