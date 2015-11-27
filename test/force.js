import assert from "assert";
import N from "../index";
require("babel-polyfill");

describe("force", () => {
    it("zero", async () => {
        let n = N();
        let f0 = n(async function() {
            let res = await this.nextForce();
            return 1;
        });

        let res = await f0();

        assert.equal(res, 1);
    });

    it("base", async () => {
        let n = N();
        let f0 = n(async function() {
            return await this.nextForce();
        });

        let f1 = n(function() {});

        let f2 = n((x = 5, y = 3) => x - y);

        f0.c(f2);
        f1.c(f2);

        let res = await f0();

        assert.equal(res[0], 2);
    });

    it("nextForce", async () => {
        let n = N();
        let f0 = n(async function() {
            return await this.nextForce(5);
        });

        let f1 = n(function() {});

        let f2 = n((x, y = 3) => x - y);

        f0.c(f2);
        f1.c(f2);

        let res = await f0();

        assert.equal(res[0], 2);
    });
});