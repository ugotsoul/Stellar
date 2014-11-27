function Player(x, y, r) {
    GameObject.apply(this, arguments);
    //player attributes
    this.x = x;
    this.y = y;
    this.r = r || 50;
    this.id = 0;
    this.drag = .001;
    this.speed = 10;
    this.maxV = 200;
    this.mouseClick = null;
    this.lastPayment = Date.now();
    this.matterLoss = false;
    this.moveType = {

        'up': false,
        'down': false,
        'left': false,
        'right': false
    }

}

Player.prototype = Object.create(GameObject.prototype);

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

    //console.log('Direction ', this.mouseClick);
   
    var distArr = this.mouseClick;
    
    var d = Math.atan2(distArr[1], distArr[0]);

    return d;
}

Player.prototype.playerDisplacement = function(){

    var distArr = this.mouseClick;

    var moveDist = [distArr[0], distArr[1]]

    var moveLength = Math.sqrt(moveDist[0]*moveDist[0] + moveDist[1]*moveDist[1]);
                
    return moveLength;
}

Player.prototype.move = function (dt) {

    //t
    var angle = this.direction() * 180/Math.PI;

    var displacement = this.playerDisplacement();

    //this.vX = Math.cos(angle) * displacement;
    //this.vY = Math.sin(angle) * displacement;

    this.x = this.x - this.mouseClick[0];
    this.y = this.y - this.mouseClick[1];
   console.log('Move Direction', this.x, this.y);


    this.matterLoss = true;
    this.mouseClick = null;
    //this.payment();
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