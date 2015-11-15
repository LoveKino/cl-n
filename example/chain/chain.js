var N = require("../../index");

var n = N();

var r = n.series(
    function(v) {
        if (v === 0) {
            console.log("stage 0");
        } else {
            this.next(v);
        }
    },
    function(v) {
        if (v === 1) {
            console.log("stage 1");
        } else {
            this.next(v);
        }
    },
    function(v) {
        if (v === 2) {
            console.log("stage 2");
        } else {
            this.next(v);
        }
    },
    function(v) {
        console.log("stage n");
    }
);

r(0);
r(1);
r(2);
r(3);