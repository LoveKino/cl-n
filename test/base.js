import assert from "assert";
import N from "../index";
require("babel-polyfill");

describe("base", () => {
    it("base", () => {
        let n = N();
        let f1 = n(function(x, y) {
            return x + y;
        });
        assert.equal(f1(4, 2), 6);
    });

    it("append way", async () => {
        let n = N();
        let f1 = n(async function() {
            return await this.next(4);
        });
        let f2 = n(x => x * 2);
        let f3 = n(x => x / 2);

        f1.append(f2);
        f1.append(f3);

        let res = await f1();
        assert.equal(res.join(","), "8,2");
    });

    it("fname", async () => {
        let n = N();
        let f1 = n(async function() {
            return await f1.next(4);
        });
        let f2 = n(x => x * 2);
        let f3 = n(x => x / 2);

        f1.append(f2);
        f1.append(f3);

        let res = await f1();

        assert.equal(res.join(","), "8,2");
    });

    it("this", () => {
        let n = N();
        let f1 = n(function() {
            assert.equal(this, 10);
        }, 10);
        f1();
    });
});