//##################################
// General Math & Utility Functions
//##################################

//Reminder: Both these functions are inclusive for both min & max
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}


//########################################################################
// Vector Math Functions
//########################################################################

function Vector(){};

Vector.prototype.distance = function(a, b){

    return [a.x - b.x, a.y - b.y];
};

//length of vector
Vector.prototype.magnitude = function(distance){

	return Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]);
};

Vector.prototype.angle = function(distance){

  	return Math.atan2(distance[1], distance[0]);
};

//returns the unit vector
Vector.prototype.normalize = function(v){

	var length = this.magnitude(v);

	return [ v[0]/length, v[1]/length ]; 
};

Vector.prototype.rotation = function(a, b, collisionAngle){

    //length of velocity vector
	var speedA = vector.magnitude([a.vX, a.vY]);
	var speedB = vector.magnitude([b.vX, b.vY]);

	var angleA = vector.angle([a.vX, a.vY]) - collisionAngle; 
	var angleB = vector.angle([b.vX, b.vY]) - collisionAngle;

	return [
		[speedA*Math.cos(angleA), speedA*Math.sin(angleA)],
		[speedB*Math.cos(angleB), speedB*Math.sin(angleB)]
		];
};

Vector.prototype.momentum = function(a, b, matrix){

    //Cofficient of Restitution - here an arbitrary scalar to make the collision less bouncy
    //Adapted from Wiki - Partially inelastic collision response
    var coefficientOfRestitution = .2; 
    
    var finalVxA = (a.r * matrix[0][0] +  b.r * matrix[1][0] + coefficientOfRestitution*b.r*(matrix[1][0] - matrix[0][0]))/ (a.r + b.r);
   	var finalVyA = matrix[0][1];
    var finalVxB = (a.r * matrix[0][0] +  b.r * matrix[1][0] + coefficientOfRestitution*a.r*(matrix[0][0] - matrix[1][0]))/ (a.r + b.r);
	var finalVyB = matrix[1][1];

	return [
		[finalVxA, finalVyA],
		[finalVxB, finalVyB]
	];

};

Vector.prototype.dotproduct = function(a, b){

	return a.x*b.x + a.y*b.y;
};

Vector.prototype.collision = function(a, b){

	//Make a matrix for rotation: http://gamedevelopment.tutsplus.com/tutorials/lets-build-a-3d-graphics-engine-linear-transformations--gamedev-7716
	
	var magA = this.magnitude([a.x, a.y]);
	var magB = this.magnitude([b.x, b.y]);
	var dot = this.dotproduct(a,b);

	return Math.acos(dot/(magA*magB));

};



//#### Global Vector Object ######
var vector = new Vector();
//################################


//stop right click menu from displaying
window.oncontextmenu = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
};


//########################################################################
// ISSUE: Window Resize is not scaled properly
//########################################################################

var windowH = $(window).height();
var windowW = $(window).width();

// var bgScalar = 3;

// window.addEventListener('resize', resizeGame, false);

//var aspectRatio = 1.75; 

// function resizeGame() {

// 	//load new height/width
// 	nH = window.screen.availHeight;
// 	nW = window.screen.availWidth;

// 	//change scale (Ternarys are cool!)
// 	(nW/nH > aspectRatio) ? 
// 	(nW = aspectRatio*nH,  canvas.style.height = nH + 'px', canvas.style.width = nW + 'px', console.log('window width is too wide')) : 
// 	(nH = nW / aspectRatio,  canvas.style.height = nH + 'px', canvas.style.width = nW + 'px', console.log('window height is too high'));

// 	windowH = nH;
// 	windowW = nW;
// }
// var wCenterX = windowW/bgScalar;
// var wCenterY = windowH/bgScalar;
