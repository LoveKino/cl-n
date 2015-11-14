import curry from "cl-curry";

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
        pass: function(finish) {
            curryNexts(this);
            pass(this, finish);
        },
        next: function(...y) {
            curryNexts(this, y);
            pass(this);
        },
        nextRecursive: function(...y) {
            curryNexts(this, y);
            pass(this, (next) => {
                next.passRecursive();
            });
        },
        passRecursive: function() {
            curryNexts(this);
            pass(this, (next) => {
                next.passRecursive();
            });
        }
    }

    let find = (node) => {
        if (boxMap[node.id]) return boxMap[node.id];
        return new Box(node);
    }

    let pass = (box, finish) => {
        let outs = box.node.outs;
        // passing
        for (let i = 0; i < outs.length; i++) {
            let nextId = outs[i];
            let next = find(box.node.find(nextId));
            if (curry.isFinished(next.curry)) {
                for (let i = 0; i < next.node.ins.length; i++) {
                    let inId = next.node.ins[i];
                    let item = find(next.node.find(inId));
                    item.recieve(next);
                }

                finish && finish(next);
            }
        }
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

let feedbackGen = (box) => {
    let node = box.node;
    let resCount = node.outs.length;
    let resMap = {};
    let res = [];
    return (next) => {
        let v = next.curry;
        let index = node.outMap[next.node.id];

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
    }
}

let getKeyLength = (map) => {
    if (Object.keys) return Object.keys(map).length;
    let counter = 0;
    for (let name in map) {
        counter++;
    }
    return counter;
}

export default enlace;