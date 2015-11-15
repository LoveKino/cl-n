"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _net = require("./net");

var _net2 = _interopRequireDefault(_net);

var _enlace = require("./enlace");

var _enlace2 = _interopRequireDefault(_enlace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var N = function N() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var net = (0, _net2.default)();

    var n = function n(f, context) {
        if (typeof f !== "function") {
            throw new TypeError("Expect function");
        }
        var fNode = net.node({
            fun: f,
            context: context
        });

        var newF = function newF() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var ctx = fNode.data.context;
            var fun = fNode.data.fun;
            var res = fun.apply(ctx, args);
            return res;
        };

        fNode.data.context = context || newF;

        newF.c = newF.append = function () {
            for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                y[_key2] = arguments[_key2];
            }

            for (var i = 0; i < y.length; i++) {
                var item = y[i];
                if (typeof item !== "function") {
                    throw new Error("Expect n function like n(()=>10)");
                }
                if (!item.getClassName || item.getClassName() !== "n") {
                    item = n(item);
                }
                item = item.getNode();
                fNode.append.call(fNode, item);
            }
            return newF;
        };

        newF.getNode = function () {
            return fNode;
        };

        newF.next = function () {
            for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                y[_key3] = arguments[_key3];
            }

            var gen = (0, _enlace2.default)();
            var list = null;
            var box = gen.create(fNode, function (res) {
                list = res;
            });
            box.next.apply(box, y);
            return list;
        };

        newF.nextRecursive = function () {
            for (var _len4 = arguments.length, y = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                y[_key4] = arguments[_key4];
            }

            var gen = (0, _enlace2.default)();
            var list = null;
            var box = gen.create(fNode, function (res) {
                list = res;
            });
            box.nextRecursive.apply(box, y);
            return list;
        };

        newF.getClassName = function () {
            return "n";
        };
        return newF;
    };

    return n;
};

exports.default = N;