import assert from "assert";
import N from "../index";

describe("next", () => {
    it("next", () => {
        let n = N();
        let f1 = n(function() {
            return this.next(4);
        });
        let f2 = n(x => x * 2);
        let f3 = n(x => x / 2);

        f1.c(f2, f3);

        assert.equal(f1().join(","), "8,2");
    });

    it("next more", () => {
        let n = N();
        let f1 = n(function() {
            return this.next(4);
        }).c(
            n(function(x) {
                return this.next(x - 3);
            }).c(
                x => 2 * x,
                x => x + 1
            ),

            n(function(x) {
                return this.next(x / 2);
            }).c(
                x => 2 * x,
                x => x + 1
            )
        );

        assert.equal(JSON.stringify(f1()), "[[2,2],[4,3]]");
    });

    it("next recursive", () => {
        let n = N();
        let paths = [];
        let n0 = n(function() {
            paths.push(0);
            return this.nextRecursive();
        });

        let n1 = n(function() {
            paths.push(1);
            return 1;
        });

        let n2 = n(function() {
            paths.push(2);
            return 2;
        });

        let n3 = n(function() {
            paths.push(3);
        });

        let n4 = n(function() {
            paths.push(4);
        });

        let n5 = n(function() {
            paths.push(5);
        });

        n0.c(n1, n2);
        n1.c(n3, n4);
        n2.c(n3, n4);

        n3.c(n5);
        n4.c(n5);

        let res = n0();

        assert.equal(paths.join(""), "012345");
        assert.equal(res.join(""), "12");
    });
});