import curry from 'cl-curry';
import feedbackGen from './feedbackGen';

export default () => {
    let boxMap = {};

    let Box = function(node) {
        this.curry = curry(
            node.data.fun(enlace), // pass context
            node.ins.length,
            node.data.context
        );
        this.node = node;
        this.recieve = feedbackGen(this);
        boxMap[this.node.id] = this;
    }

    Box.prototype = {
        constructor: Box,
        find,
        setFeedback: function(feedback) {
            this.feedback = feedback;
        },
        curryNexts: function(y) {
            curryNexts(this, y)
        },
        pass: function(finish) {
            pass(this, finish);
        },
        passForce: function(finish) {
            passForce(this, finish);
        },
        passRecursive: function() {
            passRecursive(this);
        }
    }

    /**
     * when network is running, you may want to get a box which has not been created
     *
     * if box is not exist, then create one
     *
     */
    let find = (node) => {
        if (boxMap[node.id]) return boxMap[node.id];
        let nbox = new Box(node);
        return nbox;
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

        curryValues(box, values);
    }

    let curryValues = (box, values) => {
        let outs = box.node.outs;
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

    let enlace = {
        find
    }
    return enlace;
}