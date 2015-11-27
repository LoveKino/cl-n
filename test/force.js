import assert from "assert";
import N from "../index";

describe("force", () => {
    it("nextForce", () => {
        let n = N();
        let f0 = n(function(){
            return this.nextForce(5);
        });

        let f1 = n(function(){
            
        });

        let f2 = n((x, y = 3) => x - y);

        f0.c(f2);
        f1.c(f2);

        assert.equal(f0()[0], 2);
    });
});