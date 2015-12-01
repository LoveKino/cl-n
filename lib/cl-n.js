'use strict';

var _net = require('./net');

var _net2 = _interopRequireDefault(_net);

var _rn = require('./rn');

var _rn2 = _interopRequireDefault(_rn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    var net = (0, _net2.default)();

    var createNewF = function createNewF(f, context) {
        if (typeof f !== 'function') {
            throw new TypeError('Expect function');
        }

        // node used to build static relationships

        var fNode = net.node({
            source: f
        });

        var out = function out() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var rn = new _rn2.default(fNode);
            // export functions at out runtime
            assign('next', out, rn);
            assign('nextForce', out, rn);
            assign('nextRecursive', out, rn);
            return rn.run(args);
        };

        // need pass context
        var meddle = function meddle(enlace) {
            return function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                var rn = new _rn2.default(fNode, enlace);
                // export functions at out runtime
                assign('next', out, rn);
                assign('nextForce', out, rn);
                assign('nextRecursive', out, rn);
                return rn.run(args);
            };
        };

        //
        context = context || out;
        fNode.data.context = context;
        fNode.data.fun = meddle;

        out.getNode = function () {
            return fNode;
        };
        return out;
    };

    var staticRelation = function staticRelation(out) {
        out.c = out.append = function () {
            for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                y[_key3] = arguments[_key3];
            }

            for (var i = 0; i < y.length; i++) {
                var item = getItem(y[i]);
                item = item.getNode();
                var fNode = out.getNode();
                fNode.append.call(fNode, item);
            }
            return out;
        };
    };

    var n = function n(f, context) {
        var out = createNewF(f, context);
        staticRelation(out);
        out.getClassName = function () {
            return 'n';
        };
        return out;
    };

    n.series = function () {
        for (var _len4 = arguments.length, y = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            y[_key4] = arguments[_key4];
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
        if (typeof item !== 'function') {
            throw new Error('Expect n function like n(()=>10)');
        }
        if (!item.getClassName || item.getClassName() !== 'n') {
            item = n(item);
        }
        return item;
    };

    return n;
};

var assign = function assign(name, out, ctx) {
    out[name] = function () {
        for (var _len5 = arguments.length, y = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            y[_key5] = arguments[_key5];
        }

        return ctx[name].apply(ctx, y);
    };
};