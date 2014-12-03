# Stellar - an HTML5 & JavaScript Game

Stellar is an arcade style game about becoming the biggest, baddest, stellar object in the universe. In this universe, there is one law: eat, or be eaten! Stellar is my adaption of an amazing physics based game called [Osmos](http://www.osmos-game.com/). Stellar currently has 3 levels of gameplay, with a strategic element of matter loss/matter aquisition.

![ScreenShot](https://raw.githubusercontent.com/ugotsoul/Stellar/master/static/imgs/gameplay.png 'ScreenShot') 

#### [Play The Game](http://ugotsoul.github.io/Stellar/)  
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

### Tech
 - HTML5 Canvas
 - JavaScript
 - JQuery
 - HTML5
 - CSS3

### Tests
- Extensive use of Chrome V8 Console for debugging, Memory Profiling, as well as the FPS meter in the Renderer.
- Google Developers PageSpeed Insights

### Research
 - 'HTML5 Canvas' By Steve Fulton, Jeff Fulton
 - 'How Physics Engines Work' - [Build Games With Us](http://buildnewgames.com/gamephysics/)
 - Flocking Algorithm [Link](http://harry.me/blog/2011/02/17/neat-algorithms-flocking/)
 
### Version
1.0

### Planned Features
- Arcade Style Scoreboard (Top 10 Players) using SQLITE3/Memcache.
- Matter Payment System for the Enemies.
- Refactoring of Physics Engine: Adding Transformation Matricies, Orbital Rotation, and Gravity Wells.
- Enhanced Level Design and Graphics: Different Types of Stars, Player Level Bonuses, Perlin Noise generation for Nebula Effect.
- Optimizing the game for other browsers & mobile devices.
- Sound - Classical Music, Eg. Debussy. 
