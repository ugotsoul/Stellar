//##################################
// Utility Functions
//##################################

//stop right click menu from displaying
window.oncontextmenu = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
};

//stops mouse scroll wheel
window.onscroll = function(evt) {
    evt.preventDefault();
    return false;
};


//######################################
// Math Functions
//######################################
(function() {

    window.math = {

        //Reminder: this is inclusive.
        getRandomInteger: function(min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getRandomNum: function(min, max) {
            return Math.random() * (max - min + 1) + min;
        },

        vectorDistance: function(a, b) {

            return [Math.floor(a.x - b.x), Math.floor(a.y - b.y)];
        },

        vectorMagnitude: function(distance) {

            return Math.floor(Math.sqrt(distance[0] * distance[0] + distance[1] * distance[1]));
        },

        vectorAngle: function(distance) {

            return Math.atan2(distance[1], distance[0]);
        },

        vectorUnit: function(distance) {

            var length = this.magnitude(v);

            return [v[0] / length, v[1] / length];
        },

        rotationMatrix: function(a, b, collisionAngle) {

            //length of velocity vector
            var speedA = this.vectorMagnitude([a.vX, a.vY]);
            var speedB = this.vectorMagnitude([b.vX, b.vY]);

            var angleA = this.vectorAngle([a.vX, a.vY]) - collisionAngle;
            var angleB = this.vectorAngle([b.vX, b.vY]) - collisionAngle;

            return [
                [speedA * Math.cos(angleA), speedA * Math.sin(angleA)],
                [speedB * Math.cos(angleB), speedB * Math.sin(angleB)]
            ];
        },

        momentumMatrix: function(a, b, matrix) {

            //Cofficient of Restitution: defined as an arbitrary scalar to make the collision less bouncy
            //Adapted from Wikipedia's entry on Partially Inelastic Collision Response
            var coefficientOfRestitution = 0.2;

            var finalVxA = (a.r * matrix[0][0] + b.r * matrix[1][0] + coefficientOfRestitution * b.r * (matrix[1][0] - matrix[0][0])) / (a.r + b.r);
            var finalVyA = matrix[0][1];
            var finalVxB = (a.r * matrix[0][0] + b.r * matrix[1][0] + coefficientOfRestitution * a.r * (matrix[0][0] - matrix[1][0])) / (a.r + b.r);
            var finalVyB = matrix[1][1];

            return [
                [finalVxA, finalVyA],
                [finalVxB, finalVyB]
            ];
        }
    };
})();


// ######################################
//  HTML5 Canvas Constructor Function
// ######################################

var Canvas = function(name, create) {

    this.x = 0;
    this.y = 0;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.offsetX = this.w / 2;
    this.offsetY = this.h / 2;
    this.name = name;
    this.canvas = this.prepare(create);
    this.ctx = this.context();
};

Canvas.prototype.prepare = function(create) {

    if (create) {
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

// ######################################
//  High Score Table
// ######################################