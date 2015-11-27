'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _clCurry = require('cl-curry');

var _clCurry2 = _interopRequireDefault(_clCurry);

var _feedbackGen = require('./feedbackGen');

var _feedbackGen2 = _interopRequireDefault(_feedbackGen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enlace = function enlace() {
    var boxMap = {};

    var Box = function Box(node) {
        this.curry = (0, _clCurry2.default)(node.data.fun, node.ins.length, node.data.context);
        this.node = node;
        this.recieve = (0, _feedbackGen2.default)(this);
        boxMap[this.node.id] = this;
    };

    Box.prototype = {
        constructor: Box,
        find: find,
        setFeedback: function setFeedback(feedback) {
            this.feedback = feedback;
        },
        curryNexts: function curryNexts(y) {
            _curryNexts(this, y);
        },
        pass: function pass(finish) {
            _pass(this, finish);
        },
        passForce: function passForce(finish) {
            _passForce(this, finish);
        },
        passRecursive: function passRecursive() {
            _passRecursive(this);
        }
    };

    /**
     * when network is running, you may want to get a box which has not been created
     *
     * if box is not exist, then create one
     *
     */
    var find = function find(node) {
        if (boxMap[node.id]) return boxMap[node.id];
        var nbox = new Box(node);
        return nbox;
    };

    var _passRecursive = function _passRecursive(box) {
        _curryNexts(box);
        _pass(box, function (next) {
            _passRecursive(next);
        });
    };

    var _pass = function _pass(box, finish) {
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

    var _passForce = function _passForce(box, finish) {
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

    var _curryNexts = function _curryNexts(box, list) {
        var outs = box.node.outs;
        var values = [];
        if (list) {
            if (!list.length) list = [undefined];
            values = list;
        } else {
            values.push(box.curry);
        }

        curryValues(box, values);
    };

    var curryValues = function curryValues(box, values) {
        var outs = box.node.outs;
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
        root: function root(node) {
            return new Box(node);
        }
    };
};

exports.default = enlace;