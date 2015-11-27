var N = require("../../index");

var n = N();

var task = (handler, context) => {
    var nhandler = n(async function(...y) {
        await this.nextForce();
        handler && handler.apply(context, y);
    });
    return nhandler;
}

var simpleTask1 = task(() => {
    console.log('simpleTask1 done!\n')
})

var simpleTask2 = task(() => {
    console.log('simpleTask2 done!\n')
})

var simpleTask3 = task(() => {
    console.log('simpleTask3 done!\n')
})

var complexTask1 = task(() => {
    console.log('complexTask1 done!\n')
}).c(simpleTask1, simpleTask2);;

var complexTask2 = task(() => {
    console.log("complexTask2 done!\n");
}).c(simpleTask2, simpleTask3);

(async () => {
    try {
        await simpleTask1();

        await complexTask1();

        await complexTask2();
    } catch (err) {
        console.log(err);
    }
})();