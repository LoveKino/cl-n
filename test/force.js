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

    it("nextRecursiveForce", () => {
        let n = N();
        let path = '';
        let f0 = n(function(){
            return this.nextRecursiveForce(5);
        });

        let f1 = n(function(){
            path += '1';
        });

        let f2 = n((x, y = 2) => {
            path += '2';
            return x - y;
        });

        let f3 = n((x, y = 2) => {
            path += '3';
            return x + y;
        });

        let f4 = n((x, y = 2) => {
            path += '4';
            return x * y;
        });

        f0.c(f2, f3);
        f1.c(f2, f3);

        f2.c(f4);
        f3.c(f4);

        let res = f0()[0];

        assert.equal(res, 3);
        assert.equal(path, '234');
    });
});