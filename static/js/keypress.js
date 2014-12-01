
//#######################################
// Game Keypress Handler
//#######################################


//Put inside Game.prototype.run
    //get arrow key types
    this.keyPress(player);

Game.prototype.keyPress = function(player) {

    $(window).keyup(function(evt) {

        switch (true) {
                case (evt.keyCode == 38):
                    //player moves up, player -y 
                    player.moveType['up']= false;
                    break;
                case (evt.keyCode == 40):
                    //player moves down, player +y
                    player.moveType['down'] = false;
                    break;
                case (evt.keyCode == 39):
                    //player moves right, player +x
                    player.moveType['right']= false;
                    break;
                case (evt.keyCode == 37):
                    //player moves left, player -x
                    player.moveType['left'] = false;
                    break;
            }

    });

    // event listener for keys
    $(window).keydown(function(evt) {

            switch (true) {
                case (evt.keyCode == 38):
                    //player moves up, player -y 
                    player.moveType['up']= true;
                    break;
                case (evt.keyCode == 40):
                    //player moves down, player +y
                    player.moveType['down'] = true;
                    break;
                case (evt.keyCode == 39):
                    //player moves right, player +x
                    player.moveType['right']= true;
                    break;
                case (evt.keyCode == 37):
                    //player moves left, player -x
                    player.moveType['left'] = true;
                    break;
            }

        });
    }


//#######################################
// Player Keypress Object Property
//#######################################


    this.moveType = {

        'up': false,
        'down': false,
        'left': false,
        'right': false
    }