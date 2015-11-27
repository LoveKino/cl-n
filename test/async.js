import assert from "assert";
import N from "../index";

describe("async", () => {
    it("base", (done) => {
        let n = N({
            asyncType: true
        });
        let f1 = n(function() {
            return this.next(4);
        });
        let f2 = n(x => x * 2);
        let f3 = n(x => x / 2);

        f1.c(f2, f3);

        let res = f1();
        res.then((list) => {
            assert.equal(list.join(","), "8,2");
            done();
        });
    });

    it("next", (done) => {
        let n = N({
            asyncType: true
        });
        let f1 = n(function() {
            return this.next(4);
        });
        let f2 = n((x) => new Promise(r => setTimeout(() => r(x * 2), 50)));
        let f3 = n((x) => new Promise(r => setTimeout(() => r(x / 2), 17)));

        f1.c(f2, f3);

        let res = f1();
        res.then((list) => {
            assert.equal(list.join(","), "8,2");
            done();
        });
    });


    //TODO bug reason: did not wait for recieve info
    // 1. no arguments
    // 2. quick feedback
    // 
    // new Mode: add wait type for feedback, only sub nodes finished then feedback 
    //
    // it("next recursive", (done) => {
    //     let n = N({
    //         asyncType: true
    //     });

    //     let paths = [];

    //     let n0 = n(function() {
    //         paths.push(0);
    //         let results = this.nextRecursive();
    //         return results;
    //     });

    //     let n1 = n(function() {
    //         paths.push(1);
    //         return 1;
    //     });

    //     let n2 = n(function() {
    //         paths.push(2);
    //         return 2;
    //     });

    //     let n3 = n(function() {
    //         paths.push(3);
    //     });

    //     let n4 = n(function() {
    //         paths.push(4);
    //     });

    //     let n5 = n(function() {
    //         paths.push(5);
    //     });

    //     let n6 = n(function() {
    //         paths.push(6);
    //     });

    //     n0.c(n1, n2);
    //     n1.c(n3, n4);
    //     n2.c(n3, n4);

    //     n3.c(n5);
    //     n4.c(n5);

    //     n5.c(n6);

    //     let res = n0();

    //     res.then((list) => {
    //         console.log('---------res----------');
    //         assert.equal(paths.join(""), "0123456");
    //         assert.equal(list.join(""), "12");
    //         done();
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // });
});