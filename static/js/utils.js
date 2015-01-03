//##############################
//  GLOBAL GAME NAMESPACE
//##############################

/* 

The global ENGINE object references to all the constructor 
functions for the game entities and utilties within its properties, 
listed below:

Math: 
randomInteger
randomFloat
Vector Class

Game Sprite Constructors:
GameObject Parent Sprite Class
Player Child
Enemy Child

Game Element Constructors:
HTML5 Canvas DOM element
Parallax Star Background (3 Layers)

Game Constructor:
Game Class

Class Instances:
Game: ENGINE.GAME
Vector: ENGINE.vector

*/

var ENGINE = {} || window.ENGINE;


//##################################
// Utility Functions
//##################################

/* 
    Mouse Menu Event Listener: prevents right click menu from displaying.
*/
window.oncontextmenu = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
};

/* 
    Mouse Wheel Event Listener: prevents mouse wheel from scrolling.
*/
window.onscroll = function(evt) {
    evt.preventDefault();
    return false;
};

//######################################
// Math Functions
//######################################

(function() {

    var getRandomInteger = ENGINE.randomInteger = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var randomFloat = ENGINE.randomFloat = function(min, max) {
        return Math.random() * (max - min + 1) + min;
    };


    function Vector() {}

    Vector.prototype.distance = function(a, b) {

        return [Math.floor(a.x - b.x), Math.floor(a.y - b.y)];
    };

    Vector.prototype.magnitude = function(distance) {

        return Math.floor(Math.sqrt(distance[0] * distance[0] + distance[1] * distance[1]));
    };

    Vector.prototype.angle = function(distance) {

        return Math.atan2(distance[1], distance[0]);
    };

    //returns the unit vector
    Vector.prototype.normalize = function(v) {

        var length = this.magnitude(v);
        return [v[0] / length, v[1] / length];
    };

    Vector.prototype.rotation = function(a, b, collisionAngle) {

        //length of velocity vector
        var speedA = this.magnitude([a.vX, a.vY]);
        var speedB = this.magnitude([b.vX, b.vY]);

        var angleA = this.angle([a.vX, a.vY]) - collisionAngle;
        var angleB = this.angle([b.vX, b.vY]) - collisionAngle;

        return [
            [speedA * Math.cos(angleA), speedA * Math.sin(angleA)],
            [speedB * Math.cos(angleB), speedB * Math.sin(angleB)]
        ];
    };

    Vector.prototype.momentum = function(a, b, matrix) {

        //Cofficient of Restitution - here an arbitrary scalar to make the collision less bouncy
        //Adapted from Wiki - Partially inelastic collision response
        var coefficientOfRestitution = 0.2;

        var finalVxA = (a.r * matrix[0][0] + b.r * matrix[1][0] + coefficientOfRestitution * b.r * (matrix[1][0] - matrix[0][0])) / (a.r + b.r);
        var finalVyA = matrix[0][1];
        var finalVxB = (a.r * matrix[0][0] + b.r * matrix[1][0] + coefficientOfRestitution * a.r * (matrix[0][0] - matrix[1][0])) / (a.r + b.r);
        var finalVyB = matrix[1][1];

        return [
            [finalVxA, finalVyA],
            [finalVxB, finalVyB]
        ];
    };

    ENGINE.vector = new Vector();

})();

// ######################################
//  HTML5 Canvas Constructor Function
// ######################################

(function() {

    var Canvas = ENGINE.canvasConstr = function(name, visable) {
        this.x = 0;
        this.y = 0;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.offsetX = this.w / 2;
        this.offsetY = this.h / 2;
        this.name = name;
        this.canvas = this.prepare(visable);
        this.ctx = this.context();
    };

    Canvas.prototype.prepare = function(visable) {

        if (visable) {
            //create a hidden canvas dom object
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.w;
            this.canvas.height = this.h;
            this.canvas.style = "display: hidden";
            this.canvas.setAttribute("id", "buffer");
            return document.body.appendChild(this.canvas);
        } else {
            //create a visable canvas dom object
            this.canvas = document.getElementById(this.name);
            this.canvas.width = this.w;
            this.canvas.height = this.h;
            return this.canvas;
        }
    };

    Canvas.prototype.context = function() {

        this.ctx = this.canvas.getContext('2d');

        return this.ctx;
    };

})();