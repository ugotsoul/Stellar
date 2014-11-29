//##################################
// General Math & Utility Functions
//##################################

//Reminder: Both these functions are inclusive for both min & max

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}

//########################################################################
// ISSUE: Window Resize is not scaled properly - test and change in week 4
//########################################################################

// var bgScalar = 3;

// window.addEventListener('resize', resizeGame, false);

var windowH = $(window).height();
var windowW = $(window).width();
var aspectRatio = 1.75; 

//stop right click menu from showing
window.oncontextmenu = function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
};

// function resizeGame() {

// 	//load new height/width
// 	nH = window.screen.availHeight;
// 	nW = window.screen.availWidth;

// 	//change scale (Ternarys are cool!)
// 	(nW/nH > aspectRatio) ? 
// 	(nW = aspectRatio*nH,  canvas.style.height = nH + 'px', canvas.style.width = nW + 'px', console.log('window width is too wide')) : 
// 	(nH = nW / aspectRatio,  canvas.style.height = nH + 'px', canvas.style.width = nW + 'px', console.log('window height is too high'));

// 	windowH = nH;
// 	windowW = nW;
// }
// var wCenterX = windowW/bgScalar;
// var wCenterY = windowH/bgScalar;
