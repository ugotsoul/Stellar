//#######################################
// Arrow Key Event Handler
//#######################################

//movement handler for player
Game.prototype.keyPress = function() {

    // event listener for keys
    $(window).keydown(function(evt) {

            switch (true) {
                case (evt.keyCode == 40):
                    //player moves up, player -y   
                    return 'down';
                    break;
                case (evt.keyCode == 38):
                    //player moves down, player +y
                    return 'up';
                    break;
                case (evt.keyCode == 37):
                    //player moves right, player +x
                    return 'left';
                    break;
                case (evt.keyCode == 39):
                    //player moves left, player -x
                    return 'right';
                    break;
            }
        });
    }


