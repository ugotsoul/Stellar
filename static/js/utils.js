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

//stop right click menu from displaying
window.oncontextmenu = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
};

//########################################################################
// Vector Math Functions
//########################################################################

function Vector(){};

Vector.prototype.distance = function(a, b){

    return [Math.floor(a.x - b.x), Math.floor(a.y - b.y)];
};

//length of vector
Vector.prototype.magnitude = function(distance){

	return Math.floor(Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1]));
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

	//Make a rotation matrix: http://gamedevelopment.tutsplus.com/tutorials/lets-build-a-3d-graphics-engine-linear-transformations--gamedev-7716
	
	var magA = this.magnitude([a.x, a.y]);
	var magB = this.magnitude([b.x, b.y]);
	var dot = this.dotproduct(a,b);

	return [];
};


//#### Global Vector Object ######
var vector = new Vector();
//################################


// ######################################
//  HTML5 Canvas Constructor Function
// ######################################

var Canvas = function(name, create){

    this.x = 0;
    this.y = 0;
    this.w = $(window).width();
    this.h = $(window).height();
    this.offsetX = this.w/2;
    this.offsetY = this.h/2;
    this.name = name;
    this.canvas = this.prepare(create);
    this.ctx = this.context();
};

Canvas.prototype.prepare = function(create){

    if (create){
        //create a hidden canvas dom object
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.w;
        this.canvas.height = this.h;   
        return document.body.appendChild(this.canvas), this.canvas;
    }

    else {
        //create a visable canvas dom object
        this.canvas = document.getElementById(this.name);
        this.canvas.width = this.w;
        this.canvas.height = this.h;   
        return this.canvas;
        }
};

Canvas.prototype.context = function(){

    this.ctx = this.canvas.getContext('2d');

    return this.ctx;
}

