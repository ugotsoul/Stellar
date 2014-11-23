//######################################################
// Viewport // Camera
//######################################################

var viewX = 0;
var viewY = 0;

//make viewport an instance of game objects

var viewport = Object.create(GameObject.prototype);

var viewport = function(viewX, viewY) {

//get a img background object
var STARS_IMG = new Image();

STARS_IMG.src = "static/imgs/nebula.png";
    var sw = ctx.canvas.width;
    var sh = ctx.canvas.height;
    var dx = 0;
    var dy = 0;
    var dw = sw;
    var dh = sh;

//viewport redraws and clips the image to that part
ctx.drawImage(STARS_IMG, viewX, viewY, sw, sh, dx, dy, dw, dh);

}



