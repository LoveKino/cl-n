import Enlace from "./enlace";

let Node = function(fNode, enlace) {
    this.fNode = fNode;
    enlace = enlace || Enlace();
    this.box = enlace.find(this.fNode);

    let me = this;
    this.resultPromise = new Promise((resolve) => {
        if (fNode.outs.length === 0) {
            resolve(undefined);
        } else {
            me.box.setFeedback((res) => {
                Promise.all(res).then((list) => {
                    resolve(list);
                });
            });
        }
    });
}

Node.prototype = {
    constructor: Node,

    run: function(args) {
        let ctx = this.fNode.data.context;
        let f = this.fNode.data.source;
        let res = f.apply(ctx, args);
        return res;
    },

    next: function(...y) {
        // pass value to sub nodes
        this.box.curryNexts(y);
        this.box.pass();

        return this.resultPromise;
    },

    nextForce: function(...y) {
        // pass value to sub nodes
        this.box.curryNexts(y);
        this.box.passForce();

        return this.resultPromise;
    }
}

export default Node;