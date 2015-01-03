////////////        Animation Shim                /////////////
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
///////////////////////////////////////////////////////////////


(function() {
    var canvas = document.getElementById('main');
    canvas.width = 700;
    canvas.height = 700;
    canvas.x = 512;
    canvas.y = 100;

    ////////////        Mouse Movement      /////////////

    canvas.addEventListener("mousemove", function(e) {
        window.mX = e.pageX - canvas.x;
        window.mY = e.pageY - canvas.y;
    });

    /////////////////////////////////////////////////////


    var ctx = canvas.getContext('2d');

    function StellarObject(r, fill) {
        this.x = window.mX || 30;
        this.y = window.mY || 30;
        this.r = r || 10;
        this.fill = fill || 'blue';

        this.vX = null;
        this.vY = null;

    }

    StellarObject.prototype.draw = function(ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = this.fill;
        ctx.fill();
    };

    StellarObject.prototype.update = function() {
        this.x = window.mX;
        this.y = window.mY;
    };

    window.dist = 0;

    StellarObject.prototype.orbit = function() {

        //circular motion test
        satellite.x = stellarObj.x + Math.cos(window.angle) * (stellarObj.r * 2 - window.dist);
        satellite.y = stellarObj.y + Math.sin(window.angle) * (stellarObj.r * 2 - window.dist);

        window.angle += satellite.speed;
        window.dist += 10;

    };

    var testPlanet = new StellarObject(20, 'blue');

    var planet = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: 70,
        fill: 'red'
    };

    var moon = {
        x: 0,
        y: 0,
        r: 40,
        speed: 0.02,
        fill: 'yellow'
    };

    window.angle = 0;

    var drawUniverse = [planet, moon];

    window.draw = function(ctx, drawList) {

        this.updateRotation(planet, moon);

        for (var i = 0; i < drawList.length; i++) {

            ctx.beginPath();
            ctx.moveTo(drawList[i].x, drawList[i].y);
            ctx.arc(drawList[i].x, drawList[i].y, drawList[i].r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = drawList[i].fill;
            ctx.fill();
        }
    };

    window.updateRotation = function(stellarObj, satellite) {


        stellarObj.x = window.mX || canvas.width / 2;
        stellarObj.y = window.mY || canvas.height / 2;

        //circular motion test
        satellite.x = stellarObj.x + Math.cos(window.angle) * (stellarObj.r * 3 - window.dist);
        satellite.y = stellarObj.y + Math.sin(window.angle) * (stellarObj.r * 3 - window.dist);

        window.angle += satellite.speed;
        window.dist += 0.1;

        if (window.dist > stellarObj.r * 3 - (stellarObj.r + satellite.r)) {
            window.dist = 0;
        }
    };

    window.render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //make a game world bounding rectangle for reference
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        return window.draw(ctx, drawUniverse);
    };

})();

(function animationLoop() {
    requestAnimFrame(animationLoop);
    window.render();
})();