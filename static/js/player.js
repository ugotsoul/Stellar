function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x;
    this.y = y;
    this.r = r || 50;
    this.id = 0;
    this.drag = .01;
    this.speed = this.r/2;
    this.maxV = 200;
    this.mouseClick = null;
    this.matterLoss = false;
    this.minMass = 20;
    this.kills = 0;
    this.moveType = {

        'up': false,
        'down': false,
        'left': false,
        'right': false
    }

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



Player.prototype.direction = function() {

    var distArr = [-this.mouseClick[0], -this.mouseClick[1]];

    var tail = this.r + this.r/2;

    var angle = Math.atan2(distArr[1], distArr[0]);

    //length of food - poop tail from player object
    var foodArr = [this.x - tail*Math.cos(angle), this.y - tail*Math.sin(angle)];
    
    console.log('Distance from Player butt: ', distArr);

    return foodArr;
}

Player.prototype.playerDisplacement = function(){

    var distArr = this.mouseClick;

    var moveLength = Math.sqrt(distArr[0]*distArr[0] + distArr[1]*distArr[1]);
                
    return moveLength;
}

Player.prototype.move = function (dt) {

    //calculate magnitudes of both vectors
    var distArr = [-this.mouseClick[0], -this.mouseClick[1]];

    //console.log('Player direction: ', distArr);

    var angle = Math.atan2(distArr[1], distArr[0]);

    //console.log('Test angle: ', angle);

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

            //##################################
            //Star effect - pretty stuff
            //##################################

            var new_opacity = getRandomNum(.7, .8);
            var g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawR);
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