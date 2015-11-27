import assert from "assert";
import N from "../index";
require("babel-polyfill");

describe("next", () => {
    it("next", async () => {
        let n = N();
        let f1 = n(async function() {
            return await this.next(4);
        });
        let f2 = n(x => x * 2);
        let f3 = n(x => x / 2);

        f1.c(f2, f3);
        let res = await f1();

        assert.equal(res.join(","), "8,2");
    });

    it("next more", async () => {
        let n = N();
        let f1 = n(async function() {
            return await this.next(4);
        }).c(
            n(async function(x) {
                return await this.next(x - 3);
            }).c(
                x => 2 * x,
                x => x + 1
            ),

            n(async function(x) {
                return await this.next(x / 2);
            }).c(
                x => 2 * x,
                x => x + 1
            )
        );

        let res = await f1();

        assert.equal(JSON.stringify(res), "[[2,2],[4,3]]");
    });

    it("next rer", async () => {
        let n = N();

        let f1 = n(async (x, y) => {
            return await f1.next(x + y);
        });
        let f2 = n(async (x) => {
            return await f2.next(x - 1);
        });

        let f3 = n(async (x) => {
            return await f3.next(x + 1);
        });

        let f4 = n((x, y) => {
            return x - y;
        });

        f1.c(f2, f3);
        f2.c(f4);
        f3.c(f4);

        let res = await f1(1, 2);
        
        assert.equal(res[0][0], -2);
        assert.equal(res[1][0], -2);
    });
});