"use strict";

function Pet(name) {
    this.name = name;
    this.species = null;
}
Pet.prototype.speak = function() {
    return "I am " + this.name + ", a " + this.species;
};
Pet.prototype.constructor = Pet;


function Dog(name) {
    Pet.apply(this, arguments);
    this.species = 'Dog';
}
Dog.prototype = Object.create(Pet.prototype);
Dog.prototype.bark = function() {
    return "Woof";
};
Dog.prototype.constructor = Dog;


function TinyDog(name) {
    Dog.apply(this, arguments);
}
TinyDog.prototype = Object.create(Dog.prototype);
TinyDog.prototype.bark = function() {
    return "Meep!";
};

// Test

var snake = new Pet("Sammy");
console.log(snake.speak());

var fido = new Dog("Fido");
console.log(fido.speak());
console.log(fido.bark());

var tinyfido = new TinyDog("TinyFido");
console.log(tinyfido.speak());
console.log(tinyfido.bark());