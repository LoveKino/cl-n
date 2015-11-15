"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var feedbackGen = function feedbackGen(box) {
    var node = box.node;
    var resCount = node.outs.length;
    var resMap = {};
    var res = [];

    return function (next) {
        var v = next.curry;
        var index = node.outMap[next.node.id];

        if (index < 0) {
            throw new Error("index is less than 0");
        }

        if (index < 0 || index > resCount.length - 1) {
            throw new Error("index is more than resCount.length - 1");
        }

        res[index] = v;
        resMap[index] = true;

        if (getKeyLength(resMap) === resCount) {
            box.feedback && box.feedback(res);
        }
    };
};

var getKeyLength = function getKeyLength(map) {
    if (Object.keys) return Object.keys(map).length;
    var counter = 0;
    for (var name in map) {
        counter++;
    }
    return counter;
};

exports.default = feedbackGen;