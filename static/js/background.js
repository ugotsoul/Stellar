
//##################################################################
// Parallax-y Background Constructor Function
//##################################################################

var Background = function() {
    this.x = 0;
    this.y = 0;

    this.bgStars = null;
    this.midStars = null;
    this.fgStars = null;
}

Object.defineProperty(Background.prototype, 'viewX', {get: function(){ return -Math.floor(game.viewX); }});
Object.defineProperty(Background.prototype, 'viewY', {get: function(){ return -Math.floor(game.viewY); }});

Object.defineProperty(Background.prototype, 'w', {get: function(){ return game.w; }});
Object.defineProperty(Background.prototype, 'h', {get: function(){ return game.h; }});


Background.prototype.makeStars = function(numOfStars) {

    var stars = [];

    for (var i=0; i<numOfStars; i++) {
    
    stars.push({

        x: getRandomInteger(this.x, this.w),
        y: getRandomInteger(this.y, this.h),
        r: getRandomInteger(0, 3),
        drawX: 0,
        drawY: 0,
        on: true
        });
    }
    return stars;
}

Background.prototype.update = function(layer, speed, dt) {

    //move stars in player direction of movement
    for (var i=0; i < layer.length; i++){

        var targetX = layer[i].x + this.viewX;
        var targetY = layer[i].y + this.viewY;

        layer[i].drawX = targetX;
        layer[i].drawY = targetY;

        if (speed > 0){

            layer[i].drawX += this.viewX/speed;
            layer[i].drawY += this.viewY/speed;
            layer[i].on = true;

            if (layer[i].drawY < this.viewY + layer[i].r){
                layer[i].on = false;
            }

            if (layer[i].drawX < this.viewX + layer[i].r){
                layer[i].on = false;
            }


            if (layer[i].drawX > this.viewX + this.w - layer[i].r){
                layer[i].on = false;
            }


            if (layer[i].drawY > this.viewY + this.h - layer[i].r){
                layer[i].on = false;
            }
        }
    }
}

Background.prototype.draw = function(canvas, fill, layer) {

    canvas.ctx.fillStyle = fill;
    canvas.ctx.beginPath();

    for (var i=0; i<layer.length; i++) {
        if (layer[i].on === true){
            canvas.ctx.moveTo(layer[i].drawX, layer[i].drawY);
            canvas.ctx.arc(layer[i].drawX, layer[i].drawY, layer[i].r, 0, Math.PI * 2, false);
            }
        }

    canvas.ctx.fill();
    canvas.ctx.closePath();

            //center coordinates of player object
        // ctx.fillStyle = '#000';
        // ctx.font = "bold 8pt Sans-Serif";
        // ctx.textAlign = 'center';
        // ctx.fillText('Game World', drawX, drawY-10);
        // ctx.fillText('X: ' + Math.floor(this.x) + ' Y: ' + Math.floor(this.y), drawX, drawY);
        // ctx.fillText('Draw World', drawX, drawY+10);
        // ctx.fillText('X: ' + Math.floor(drawX) + ' Y: ' + Math.floor(drawY), drawX, drawY+20);

    //make a game world bounding rectangle for reference
    canvas.ctx.strokeStyle = 'blue';
    canvas.ctx.lineWidth = 4;
    canvas.ctx.strokeRect(this.viewX, this.viewY, this.w, this.h);

}

Background.prototype.render = function(canvas){
   
    this.draw(canvas, 'blue', this.bgStars);
    this.draw(canvas, 'red', this.midStars);
    //this.draw(canvas, 'green', this.fgStars);
}
