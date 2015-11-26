import curry from "cl-curry";
import feedbackGen from "./feedbackGen";

let enlace = () => {
    let boxMap = {};

    let Box = function(node, feedback) {
        this.curry = curry(
            node.data.fun,
            node.ins.length,
            node.data.context
        );
        this.node = node;
        this.feedback = feedback;
        this.recieve = feedbackGen(this);
        boxMap[this.node.id] = this;
    }

    Box.prototype = {
        constructor: Box,
        find,
        next: function(...y) {
            curryNexts(this, y);
            pass(this);
        },
        nextRecursive: function(...y) {
            curryNexts(this, y);
            pass(this, (next) => {
                passRecursive(next);
            });
        },
        nextForce: function(...y) {
            curryNexts(this, y);
            passForce(this);
        },
        nextRecursiveForce: function(...y) {
            curryNexts(this, y);
            passForce(this, (next) => {
                passRecursive(next);
            });
        },
    }

    let find = (node) => {
        if (boxMap[node.id]) return boxMap[node.id];
        return new Box(node);
    }

    let passRecursive = (box) => {
        curryNexts(box);
        pass(box, (next) => {
            passRecursive(next);
        });
    }

    let pass = (box, finish) => {
        let outs = box.node.outs;
        // passing
        for (let i = 0; i < outs.length; i++) {
            let nextId = outs[i];
            let next = find(box.node.find(nextId));
            // judge finished or not
            if (curry.isFinished(next.curry)) {
                recieve(next, finish);
            }
        }
    }

    let passForce = (box, finish) => {
        let outs = box.node.outs;
        // passing
        for (let i = 0; i < outs.length; i++) {
            let nextId = outs[i];
            let next = find(box.node.find(nextId));
            // finish it
            if (!curry.isFinished(next.curry)) {
                next.curry = curry.finish(next.curry);
            }
            recieve(next, finish);
        }
    }

    let recieve = (next, finish) => {
        for (let i = 0; i < next.node.ins.length; i++) {
            let inId = next.node.ins[i];
            let item = find(next.node.find(inId));
            item.recieve(next);
        }

        finish && finish(next);
    }

    let curryNexts = (box, list) => {
        let outs = box.node.outs;
        let values = [];
        if (list) {
            if (!list.length) list = [undefined];
            values = list;
        } else {
            values.push(box.curry);
        }
        // passing
        for (let i = 0; i < outs.length; i++) {
            let nextId = outs[i];
            let next = find(box.node.find(nextId));
            let index = next.node.inMap[box.node.id];
            for (let j = 0; j < values.length; j++) {
                let value = values[j];
                next.curry = next.curry(value, index);
            }
        }
    }

    return {
        create: (node, feedback) => new Box(node, feedback)
    };
}

export default enlace;