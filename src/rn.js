import enlace from "./enlace";

let Node = function(fNode) {
    this.fNode = fNode;
    let gen = enlace();
    this.rootBox = gen.root(this.fNode);
}

Node.prototype = {
    constructor: Node,
    
    run: function(args) {
        let ctx = this.fNode.data.context;
        let f = this.fNode.data.source;

        let res = f.apply(ctx, args);
        return res;
    },

    followNext: function(handler, y) {
        let list = null;
        this.rootBox.setFeedback((res) => {
            list = res;
        });
        // pass value to sub nodes
        this.rootBox.curryNexts(y);
        handler && handler(this.rootBox);
        return list;
    },

    next: function(...y) {
        return this.followNext((box) => {
            box.pass();
        }, y);
    },

    nextForce: function(...y) {
        return this.followNext((box) => {
            box.passForce();
        }, y);
    },

    nextRecursive: function(...y) {
        return this.followNext((box) => {
            box.pass((next) => {
                next.passRecursive();
            });
        }, y)
    }
}

export default Node;