## Stellar - an HTML5 Canvas JavaScript Game.

![ScreenShot](https://raw.githubusercontent.com/ugotsoul/Stellar/master/static/imgs/start.png 'ScreenShot') 

Stellar is an arcade style game about becoming the biggest, baddest, stellar object in the universe. In this universe, there is one law: eat, or be eaten! Stellar is my adaption of an amazing physics based game called [Osmos](http://www.osmos-game.com/). Stellar currently has 3 levels of gameplay, with a strategic element of matter loss/matter aquisition.

![GamePlay](https://raw.githubusercontent.com/ugotsoul/Stellar/master/static/imgs/s1.png 'GamePlay') 

### [Play The Game](http://ugotsoul.github.io/Stellar/)  
Tested on the latest version of Google Chrome 64 Bit (Version 38.0.2125.111).

### How to Play
![How To Play](https://raw.githubusercontent.com/ugotsoul/Stellar/master/static/imgs/help.png "How To Play")

### Features
 - Custom-Made 2D Physics Engine:
    - Collision Detection
    - Collision Response
    - Basic Vector Operations, Triginometry, and Linear Algebra. 
 - Modified Flocking Algorithm (Elements of Cohesion & Repulsion) for the Enemy AI.
 - Parallax Star Background.   
 - Double Buffering to rectify fickering with physics behavior. 

### Version 1.5
 - Matter Payment System for Player & Enemies.
 - Level Bonus for Player on Level UP.
 - Extensive refactoring and encapsulation of variables into a global namespace (window.ENGINE) and IIFEs. 

### Issues
 - Major slowdown of game when > 150 enemies exist in Level 3. 

### Tech
 - HTML5 Canvas
 - JavaScript
 - JQuery
 - HTML5
 - CSS3

### Tests
- Extensive use of Chrome V8 Console for debugging and memory profiling.
- Google Developers PageSpeed Insights

### Research
 - 'HTML5 Canvas' By Steve Fulton, Jeff Fulton
 - 'How Physics Engines Work' - [Build Games With Us](http://buildnewgames.com/gamephysics/)
 -  Flocking Algorithm [Link](http://harry.me/blog/2011/02/17/neat-algorithms-flocking/)
 
### Planned Features
- Version 1.75:
	- Arcade Style Scoreboard.
	- Implement Asynchronous Module Definition (AMD) of .js files with RequireJS.
	- Research data structures to solve game slowdown @ level 3 (eg., with QuadTrees) 


- Future Versions:
	- Refactoring of Physics Engine: Adding Transformation Matricies, Orbital Rotation, and Gravity Wells.
	- Enhanced Level Design and Graphics: Different Types of Enemies and Perlin Noise for a Nebula-like Effect.
	- Optimizing the game for other browsers & mobile devices.
