
//##################################################################
// Parallax-y Background Constructor Function
//##################################################################

var Background = function() {
    this.x = 0;
    this.y = 0;

    this.bgStars = null;
    this.midStars = null;
    this.fgStars = null;
    this.twinkStars = null;
};

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
        r: getRandomInteger(1, 3),
        drawX: 0,
        drawY: 0,
        on: true,
        waitTime: Date.now()
        });
    }
    return stars;
};

Background.prototype.update = function(layer, speed) {

    for (var i=0; i < layer.length; i++){

        var targetX = layer[i].x + this.viewX;
        var targetY = layer[i].y + this.viewY;

        layer[i].drawX = targetX;
        layer[i].drawY = targetY;

        //move stars in player direction of movement
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

    if (layer == this.twinkStars){

            var randomStar = getRandomInteger(1,this.twinkStars.length-1);
            var currentTime = Date.now();

            for (var n = 1; n < this.twinkStars.length; n++){
                    if (n == randomStar){
                        if (currentTime - layer[n].waitTime  > 1000){
                            if (layer[n].r > 0){
                                layer[n].r -= 1;
                                layer[n].waitTime = Date.now();
                                currentTime = Date.now();
                            }
                            else {
                                layer[n].r += 1;
                                layer[n].waitTime = Date.now();

                            }
                        }
                    }
                }
              
    }
};

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

    //make a game world bounding rectangle for reference
    canvas.ctx.strokeStyle = 'blue';
    canvas.ctx.lineWidth = 4;
    canvas.ctx.strokeRect(this.viewX, this.viewY, this.w, this.h);

};

Background.prototype.render = function(canvas){
   
    this.draw(canvas, '#570386', this.bgStars);
    this.draw(canvas, '#FF0090', this.midStars);
    this.draw(canvas, '#FF78FF', this.fgStars);
    this.draw(canvas, 'aqua', this.twinkStars);
};