import assert from "assert";
import N from "../index";
require("babel-polyfill");

let timePromise = (value, dur = 17) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(value);
    }, dur)
});

describe("async", () => {
    it("base", async () => {
        let n = N();
        let f1 = n(async function(x) {
            let res = await this.next(x);
            return res;
        });
        let f2 = n(x => timePromise(x + 1));
        let f3 = n(x => timePromise(x - 1));

        f1.c(f2, f3);

        let res = await f1(4);
        assert.equal(res[0], 5);
        assert.equal(res[1], 3);
    });
});