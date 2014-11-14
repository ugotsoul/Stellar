
// ##########################################################################
//  Get player position with Mouse - need to change the moveplayer function
// ##########################################################################

function mousePosition() {

	//mouseEvent listener
	$("#canvas").click(function (evt) {
	
	//store mouse clicks
	for (var d = 0; d < gameElements.length; d++) {
		if (gameElements[a] instanceof Player === true) {
			gameElements[a].x = evt.clientX - 40;
			gameElements[a].y = evt.clientY - 40;

			updateBoard();

			console.log(gameElements[a].x);
			console.log(gameElements[a].y);
		}
	}


	});
}


