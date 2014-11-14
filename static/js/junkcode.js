// return a velocity vector in a array of new velocityX new velocityY of player 

// var distance = this.centerDistance(enemy.x, enemy.y);

// var vHat = this.vectorDifference(enemy.x, enemy.y);

// var dHat =[distance[0]/vHat, distance[1]/vHat];

// var vDotd = this.vX * distance[0] + this.vY * distance[1];

// var vector = [2*vDotd*dHat[0], 2*vDotd*dHat[1]]; 

//return[this.vX - vector[0], this.vY- vector[1]];
// need to store these values in temporary variables so they do not alter the game object state before final calculations are made
var pVX = (this.vX * (this.r - enemy.r) + (2 * enemy.r * enemy.vX)) / (this.r + enemy.r);
var pVY = (this.vY * (this.r - enemy.r) + (2 * enemy.r * enemy.vY)) / (this.r + enemy.r);
var eVX = (enemy.vX * (enemy.r - this.r) + (2 * this.r * this.vX)) / (this.r + enemy.r);
var eVY = (enemy.vY * (enemy.r - this.r) + (2 * this.r * this.vY)) / (this.r + enemy.r);

//instead of backing this up by the velocity, change the radius first then measure the displacement vector
//make it so they don't intersect anymore

// this.x += pVX * dt;
// this.y += pVY * dt;
// enemy.x += eVX * dt;
// enemy.y += eVY * dt;