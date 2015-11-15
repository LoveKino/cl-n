import assert from "assert";
import N from "../index";

describe("series", () => {
    it("base", () => {
        let n = N();

        let r = n.series(
            n(function($) {
                $.v++;
                this.next($);
            }),
            function($) {
                $.v++;
                this.next($);
            },
            function($) {
                $.v++;
                // no next
            },
            function($) {
                $.v++;
            }
        );

        let $ = {
            v: 0
        }
        r($);
        assert.equal($.v, 3);
    });
});