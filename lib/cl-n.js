"use strict";

var _net = require("./net");

var _net2 = _interopRequireDefault(_net);

var _enlace = require("./enlace");

var _enlace2 = _interopRequireDefault(_enlace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var asyncFunction = function asyncFunction(f, context) {
    return function () {
        for (var _len = arguments.length, pros = Array(_len), _key = 0; _key < _len; _key++) {
            pros[_key] = arguments[_key];
        }

        return new Promise(function (resolve, reject) {
            var argsPro = Promise.all(pros);
            argsPro.then(function (args) {
                var res = f.apply(context, args);
                getValue(res).then(function (v) {
                    return resolve(v);
                });
            }).catch(reject);
        });
    };
};

var getValue = function getValue(res) {
    if (res && (typeof res === "undefined" ? "undefined" : _typeof(res)) === 'object' && typeof res.then === 'function' && typeof res.catch === 'function') {
        return res;
    } else {
        return Promise.resolve(res);
    }
};

module.exports = function () {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var net = (0, _net2.default)();

    var asyncType = opts.asyncType || false;

    var n = function n(f, context) {
        if (typeof f !== "function") {
            throw new TypeError("Expect function");
        }

        var fNode = net.node({
            fun: f,
            context: context
        });

        var newF = function newF() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var ctx = fNode.data.context;
            var fun = fNode.data.fun;
            var res = fun.apply(ctx, args);
            return res;
        };

        //
        context = context || newF;
        fNode.data.context = context;

        if (asyncType === true) {
            f = asyncFunction(f, context);
            fNode.data.fun = f;
        }

        var followNext = function followNext(handler) {
            return function () {
                for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    y[_key3] = arguments[_key3];
                }

                var gen = (0, _enlace2.default)();
                var list = null;
                var box = gen.create(fNode, function (res) {
                    list = res;
                });
                // pass value to sub nodes
                box.curryNexts(y);
                handler && handler(box, y);
                if (asyncType === true) {
                    list = Promise.all(list);
                }
                return list;
            };
        };

        newF.c = newF.append = function () {
            for (var _len4 = arguments.length, y = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                y[_key4] = arguments[_key4];
            }

            for (var i = 0; i < y.length; i++) {
                var item = getItem(y[i]);
                item = item.getNode();
                fNode.append.call(fNode, item);
            }
            return newF;
        };

        newF.getNode = function () {
            return fNode;
        };

        newF.next = followNext(function (box, y) {
            box.pass();
        });

        newF.nextForce = followNext(function (box, y) {
            box.passForce();
        });

        newF.nextRecursive = followNext(function (box, y) {
            box.pass(function (next) {
                next.passRecursive();
            });
        });

        newF.nextRecursiveForce = followNext(function (box, y) {
            box.passForce(function (next) {
                next.passRecursiveForce();
            });
        });

        newF.getClassName = function () {
            return "n";
        };
        return newF;
    };

    n.series = function () {
        for (var _len5 = arguments.length, y = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            y[_key5] = arguments[_key5];
        }

        var tmp = null;
        for (var i = y.length - 1; i >= 0; i--) {
            var item = y[i];
            if (tmp === null) {
                tmp = getItem(item);
            } else {
                var prev = getItem(item);
                prev.append(tmp);
                tmp = prev;
            }
        }
        return tmp;
    };

    var getItem = function getItem(item) {
        if (typeof item !== "function") {
            throw new Error("Expect n function like n(()=>10)");
        }
        if (!item.getClassName || item.getClassName() !== "n") {
            item = n(item);
        }
        return item;
    };

    return n;
};