"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _clCurry = require("cl-curry");

var _clCurry2 = _interopRequireDefault(_clCurry);

var _feedbackGen = require("./feedbackGen");

var _feedbackGen2 = _interopRequireDefault(_feedbackGen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enlace = function enlace() {
    var boxMap = {};

    var Box = function Box(node, feedback) {
        this.curry = (0, _clCurry2.default)(node.data.fun, node.ins.length, node.data.context);
        this.node = node;
        this.feedback = feedback;
        this.recieve = (0, _feedbackGen2.default)(this);
        boxMap[this.node.id] = this;
    };

    Box.prototype = {
        constructor: Box,
        find: find,
        next: function next() {
            for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
                y[_key] = arguments[_key];
            }

            curryNexts(this, y);
            pass(this);
        },
        nextRecursive: function nextRecursive() {
            for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                y[_key2] = arguments[_key2];
            }

            curryNexts(this, y);
            pass(this, function (next) {
                passRecursive(next);
            });
        },
        nextForce: function nextForce() {
            for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                y[_key3] = arguments[_key3];
            }

            curryNexts(this, y);
            passForce(this);
        },
        nextRecursiveForce: function nextRecursiveForce() {
            for (var _len4 = arguments.length, y = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                y[_key4] = arguments[_key4];
            }

            curryNexts(this, y);
            passForce(this, function (next) {
                passRecursive(next);
            });
        }
    };

    var find = function find(node) {
        if (boxMap[node.id]) return boxMap[node.id];
        return new Box(node);
    };

    var passRecursive = function passRecursive(box) {
        curryNexts(box);
        pass(box, function (next) {
            passRecursive(next);
        });
    };

    var pass = function pass(box, finish) {
        var outs = box.node.outs;
        // passing
        for (var i = 0; i < outs.length; i++) {
            var nextId = outs[i];
            var next = find(box.node.find(nextId));
            // judge finished or not
            if (_clCurry2.default.isFinished(next.curry)) {
                recieve(next, finish);
            }
        }
    };

    var passForce = function passForce(box, finish) {
        var outs = box.node.outs;
        // passing
        for (var i = 0; i < outs.length; i++) {
            var nextId = outs[i];
            var next = find(box.node.find(nextId));
            // finish it
            if (!_clCurry2.default.isFinished(next.curry)) {
                next.curry = _clCurry2.default.finish(next.curry);
            }
            recieve(next, finish);
        }
    };

    var recieve = function recieve(next, finish) {
        for (var i = 0; i < next.node.ins.length; i++) {
            var inId = next.node.ins[i];
            var item = find(next.node.find(inId));
            item.recieve(next);
        }

        finish && finish(next);
    };

    var curryNexts = function curryNexts(box, list) {
        var outs = box.node.outs;
        var values = [];
        if (list) {
            if (!list.length) list = [undefined];
            values = list;
        } else {
            values.push(box.curry);
        }
        // passing
        for (var i = 0; i < outs.length; i++) {
            var nextId = outs[i];
            var next = find(box.node.find(nextId));
            var index = next.node.inMap[box.node.id];
            for (var j = 0; j < values.length; j++) {
                var value = values[j];
                next.curry = next.curry(value, index);
            }
        }
    };

    return {
        create: function create(node, feedback) {
            return new Box(node, feedback);
        }
    };
};

exports.default = enlace;