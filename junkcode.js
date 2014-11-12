
// ###############################
//  Get player position with Mouse
// ###############################

// function mousePosition() {

// 	//mouseEvent listener
// 	$("#canvas").click(function (evt) {
	
// 	//store mouse clicks
// 	for (var d = 0; d < gameElements.length; d++) {
// 		if (gameElements[a] instanceof Player === true) {
// 			gameElements[a].x = evt.clientX - 40;
// 			gameElements[a].y = evt.clientY - 40;

// 			updateBoard();

// 			console.log(gameElements[a].x);
// 			console.log(gameElements[a].y);
// 		}
// 	}


// 	});
// }


//#################### 

//old collisions

// ##############################################################
//collision detection needs to happen outside the keypress handler
//check ray length of next move
//collision = collsionDetect(nextX, nextY, gameElements[e]);

// move the player if no collision
// if (collision === false) {
// movePlayer(moveType, gameElements[e]);
// }
// else {
// 	attack(collision, gameElements[e]);
// }

=======================


//check if collision happened (player & enemy, or enemy & enemy)
//right now this funciton is called in the update board before redrawing enemies
//is this the right place?? it does need to check the position constantly since all objects are moving

// function checkCollision() {

// 	//check all game elements for collisions
//     for (var a = 0; a < gameElements.length; a++) {

//         if (gameElements[e] instanceof Enemy) { 
//          	//since everything is moving... WHY NOT JUST CHECK PLAYER AGAINST GAME X/Y??? AHHHHHH
// 			var collision = collsionSquareToCircle(player, gameElements[a]);
// 			console.log('Did a collision happen? '+collision);

// 			if (collision === false) {
// 				movePlayer(moveType);
// 			}

// 			else {
// 				attack(collision, gameElements[a]);
// 			}

//         }
//     }
// }

=========================

function attack(element) {

		$('#status').html("You were hit, OW! You lost some mass.");
		//logic: if element/enemy colided with an enemy.
			//if enemy1.mass > enemy2.mass
			//hurt enemy2
			//add mass to enemy 1
			//if enemy2.mass < enemy1.mass
			//hurt enemy1
			//add mass to enemy 2
			//if enemy1.mass == enemy2.mass
			//randomly hurt one of the objects

	    //if element collided with player
	    //if mass player (wxh) == zero, stop game run, begin end game state
	    //else, hurt player

	    //hurt player
	    //as the players mass decreases, the enemies attack strength increases
	    //to do this accurately, I need the direction of player movement
	    //and the player needs to gradually 'bounce' away from the enemy
	    //similar to the angle of insidence equation

	    player.w -= element.attack/player.mass;
	    player.h -= element.attack/player.mass;
	    player.x += element.attack/2;
	    player.y -= element.attack/2;
	    //add mass to the element
	    element.r += element.attack/player.mass;
	    //slow the player down
	    player.velocity -= .1;
}

================================

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
        	var eVY= (enemy.vY * (enemy.r - this.r) + (2 * this.r * this.vY)) / (this.r + enemy.r);

        	//instead of backing this up by the velocity, change the radius first then measure the displacement vector
        	//make it so they don't intersect anymore

        	// this.x += pVX * dt;
        	// this.y += pVY * dt;
        	// enemy.x += eVX * dt;
        	// enemy.y += eVY * dt;
