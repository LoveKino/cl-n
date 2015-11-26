var N = require("../../index");

var n = N();

var simpleTask1 = n(function(){
    console.log("simpleTask1 done!");
});

var simpleTask2 = n(function(){
    console.log("simpleTask2 done!");
});

var simpleTask3 = n(function(){
    console.log("simpleTask3 done!");
});

var complexTask1 = n(function(){
    console.log("complexTask1 start!");
    this.nextRecursiveForce();
    console.log("complexTask1 done!\n");
}).append(simpleTask1, simpleTask2);

var complexTask2 = n(function(){
    console.log("complexTask2 start!");
    this.nextRecursiveForce();
    console.log("complexTask2 done!\n");
}).append(simpleTask2, simpleTask3);

simpleTask1();

console.log("\n");

complexTask1();

complexTask2();