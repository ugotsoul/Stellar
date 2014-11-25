//#######################################
// Arrow Key Event Handler
//#######################################
//var keylogger to pass to Player.move('type of move')
var moveType;

//movement handler for player
function keyPosition() {

    // event listener for keys
    $(window).keydown(function(evt) {

        $('#status').html('Use the Arrow Keys to Move & Eat The Other Stellar Bodies.');
            switch (true) {
                case (evt.keyCode == 40):
                    //player moves up, player -y   
                    moveType = 'down';
                    break;
                case (evt.keyCode == 38):
                    //player moves down, player +y
                    moveType = 'up';
                    break;
                case (evt.keyCode == 37):
                    //player moves right, player +x
                    moveType = 'left';
                    break;
                case (evt.keyCode == 39):
                    //player moves left, player -x
                    moveType = 'right';
                    break;
            }
    
    player.move(moveType);

    });
}


