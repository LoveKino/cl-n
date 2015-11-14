let net = () => {
    let counter = 1;
    let nodeMap = {};

    let Node = function(data) {
        this.data = data;
        this.id = counter;

        this.inMap = {};
        this.outMap = {};
        this.ins = [];
        this.outs = [];

        nodeMap[this.id] = this;
        //
        counter++;
    }

    Node.prototype = {
        constructor: Node,
        append: function(node) {
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
        find: function(id) {
            return nodeMap[id];
        }
    }

    return {
        node: (data) => new Node(data),
        find: (id) => nodeMap[id]
    }
}

export default net;