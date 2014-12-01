
//##################################################################
// Parallax-y Background Constructor Function
//##################################################################

var Background = function() {
    this.x = 0;
    this.y = 0;
    this.w = 3000;
    this.h = 3000;
    this.bgStars = this.makeStars(400);
    this.fgStars = this.makeStars(300);
    this.topStars = this.makeStars(150);
}

Object.defineProperty(Background.prototype, 'viewX', {get: function(){ return -(game.viewX); }});
Object.defineProperty(Background.prototype, 'viewY', {get: function(){ return -(game.viewY); }});

Background.prototype.makeStars = function(numOfStars) {

    var stars = [];

    for (var i=0; i<numOfStars; i++) {
    
    stars.push({

        x: getRandomInteger(this.x, this.w),
        y: getRandomInteger(this.y, this.h),
        r: getRandomInteger(0, 2),
        drawX: 0,
        drawY: 0,
        vX: 0,
        vY: 0
        });
    }
    return stars;
}

Background.prototype.update = function(layer, speed) {

    //move stars in player direction of movement
    for (var i=0; i < layer.length; i++){

        var targetX = layer[i].x + this.viewX;
        var targetY = layer[i].y + this.viewY;

        layer[i].drawX = targetX;
        layer[i].drawY = targetY;

        if (speed > 0){

            //note: speed of 1 == player movement
            layer[i].drawX += targetX/speed;
            layer[i].drawY += targetY/speed;


            //never have stars draw off canvas
            if (layer[i].drawX - this.viewX < layer[i].x) {
                layer[i].drawX = targetX;
            }

            if (layer[i].drawY - this.viewY < layer[i].y) {
                layer[i].drawY = targetY;
            }
  
            if (layer[i].drawX - this.viewX >= this.w) {
                layer[i].drawX = this.viewX;
            }

            if (layer[i].drawY - this.viewY >= this.h) {
                layer[i].drawY = this.viewY;
            }
  
        }
    }
    return;
}

Background.prototype.draw = function(canvas, fill, layer) {

    canvas.ctx.fillStyle = fill;
    canvas.ctx.beginPath();

        //draw the stars
        for (var i=0; i<layer.length; i++) {

            canvas.ctx.moveTo(layer[i].drawX, layer[i].drawY);
            canvas.ctx.arc(layer[i].drawX, layer[i].drawY, layer[i].r, 0, Math.PI * 2, false);
            }

    canvas.ctx.fill();
    canvas.ctx.closePath();

    //make a game world bounding rectangle
    canvas.ctx.strokeStyle = 'blue';
    canvas.ctx.lineWidth = 2;
    canvas.ctx.strokeRect(this.viewX, this.viewY, this.w, this.h);

}

Background.prototype.render = function(canvas){
   
    //check for changes in x, y coordinate plane of player view
    this.update(this.bgStars, 0);
    this.update(this.fgStars, 2);
    this.update(this.topStars, 1);

    //redraw stars on canvas
    this.draw(canvas, 'blue', this.bgStars);
    this.draw(canvas, 'violet', this.fgStars);
    this.draw(canvas, 'red', this.topStars);
}
