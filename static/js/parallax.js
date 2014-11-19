//test parallax movement
$(document).ready(function() {

});


function run() {

	keyPosition();

	var FPS = 50;

	game.intervalHandle = setInterval(function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.draw();
		player.draw();
	}, 1000/FPS);
}

//draw the game canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width=1280;
canvas.height=800;

//instanciate new game object
var game = new Game();

var player = new Player(game.w/2, game.h/2);

//get a star background object
var STARS_IMG = new Image();

STARS_IMG.src = "static/bg/stars.png";

function Game() {
	this.x= 0;
	this.y= 0;
	this.w= 2560;
	this.h= 1600;
	this.intervalHandle = null;

	this.draw  = function(){
		// draw star bg
		ctx.strokeStyle  = '#0f0';
		ctx.lineWidth = 2;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.drawImage(STARS_IMG, this.x, this.y, this.w, this.h); 
	}
}

function Player (x,y) {
	this.x = x;
	this.y = y;
	this.w = 40;
	this.h = 40;

	this.speed = 10;

	this.draw  = function(){
	// draw player
	ctx.fillStyle = '#f00';
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.fillStyle = '#fff';
	ctx.font = "bold 30pt Sans-Serif";
	ctx.textAlign = "start";
	ctx.fillText('game X: ' + game.x + ' game Y:'+ game.y , this.x+50, this.y+50);
	}
}

//#######################################
// Arrow Key Event Handler
//#######################################

//movement handler for player
function keyPosition() {

    // event listener for keys
    $(window).keydown(function(evt) {

            switch (true) {
                case (evt.keyCode == 40):
                    //player moves up, player -y   
                    game.y-=player.speed;
                    break;
                case (evt.keyCode == 38):
                    //player moves down, player +y
                    game.y+=player.speed;
                    break;
                case (evt.keyCode == 37):
                    //player moves right, player +x
                    game.x-=player.speed;
                    break;
                case (evt.keyCode == 39):
                    //player moves left, player -x
                    game.x+=player.speed;
                    break;
            }
    });
}