"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var net = function net() {
    var counter = 1;
    var nodeMap = {};

    var Node = function Node(data) {
        this.data = data;
        this.id = counter;

        this.inMap = {};
        this.outMap = {};
        this.ins = [];
        this.outs = [];

        nodeMap[this.id] = this;
        //
        counter++;
    };

    Node.prototype = {
        constructor: Node,
        append: function append(node) {
            if (!node && !node.id) {
                throw new TypeError("Expect Node Type");
            }
            if (!this.find(node.id)) {
                throw new TypeError("Node is not defined in the same network");
            }
            if (this.outMap[node.id] === undefined) {
                this.outs.push(node.id);
                this.outMap[node.id] = this.outs.length - 1;

                node.ins.push(this.id);
                node.inMap[this.id] = node.ins.length - 1;
            }
        },
        find: function find(id) {
            return nodeMap[id];
        }
    };

    return {
        node: function node(data) {
            return new Node(data);
        },
        find: function find(id) {
            return nodeMap[id];
        }
    };
};

exports.default = net;