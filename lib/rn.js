"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _enlace = require("./enlace");

var _enlace2 = _interopRequireDefault(_enlace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node = function Node(fNode) {
    this.fNode = fNode;
    var gen = (0, _enlace2.default)();
    this.rootBox = gen.root(this.fNode);
};

Node.prototype = {
    constructor: Node,

    run: function run(args) {
        var ctx = this.fNode.data.context;
        var f = this.fNode.data.source;

        var res = f.apply(ctx, args);
        return res;
    },

    followNext: function followNext(handler, y) {
        var list = null;
        this.rootBox.setFeedback(function (res) {
            list = res;
        });
        // pass value to sub nodes
        this.rootBox.curryNexts(y);
        handler && handler(this.rootBox);
        return list;
    },

    next: function next() {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        return this.followNext(function (box) {
            box.pass();
        }, y);
    },

    nextForce: function nextForce() {
        for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            y[_key2] = arguments[_key2];
        }

        return this.followNext(function (box) {
            box.passForce();
        }, y);
    },

    nextRecursive: function nextRecursive() {
        for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            y[_key3] = arguments[_key3];
        }

        return this.followNext(function (box) {
            box.pass(function (next) {
                next.passRecursive();
            });
        }, y);
    }
};

exports.default = Node;