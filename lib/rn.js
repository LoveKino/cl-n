"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _enlace = require("./enlace");

var _enlace2 = _interopRequireDefault(_enlace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node = function Node(fNode, enlace) {
    this.fNode = fNode;
    enlace = enlace || (0, _enlace2.default)();
    this.box = enlace.find(this.fNode);

    var me = this;
    this.resultPromise = new Promise(function (resolve) {
        me.box.setFeedback(function (res) {
            Promise.all(res).then(function (list) {
                resolve(list);
            });
        });
    });
};

Node.prototype = {
    constructor: Node,

    run: function run(args) {
        var ctx = this.fNode.data.context;
        var f = this.fNode.data.source;
        var res = f.apply(ctx, args);
        return res;
    },

    next: function next() {
        for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
            y[_key] = arguments[_key];
        }

        // pass value to sub nodes
        this.box.curryNexts(y);
        this.box.pass();

        return this.resultPromise;
    },

    nextForce: function nextForce() {
        for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            y[_key2] = arguments[_key2];
        }

        // pass value to sub nodes
        this.box.curryNexts(y);
        this.box.passForce();
        return this.resultPromise;
    }
};

exports.default = Node;