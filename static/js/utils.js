//##################################
// General Math & Utility Functions
//##################################

//Reminder: Both these functions are inclusive for max

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}