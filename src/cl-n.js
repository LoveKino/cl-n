import Net from "./net";
import enlace from "./enlace";

module.exports = (opts = {}) => {
    let net = Net();

    let n = (f, context) => {
        if (typeof f !== "function") {
            throw new TypeError("Expect function");
        }
        let fNode = net.node({
            fun: f,
            context: context
        });

        let newF = (...args) => {
            let ctx = fNode.data.context;
            let fun = fNode.data.fun;
            let res = fun.apply(ctx, args);
            return res;
        };

        fNode.data.context = context || newF;

        let followNext = (name) => (...y) => {
            let gen = enlace();
            let list = null;
            let box = gen.create(fNode, (res) => {
                list = res;
            });
            box[name].apply(box, y);
            return list;
        }

        newF.c = newF.append = (...y) => {
            for (let i = 0; i < y.length; i++) {
                let item = getItem(y[i]);
                item = item.getNode();
                fNode.append.call(fNode, item);
            }
            return newF;
        }

        newF.getNode = () => fNode;

        newF.next = followNext('next');

        newF.nextForce = followNext('nextForce');

        newF.nextRecursive = followNext('nextRecursive');

        newF.nextRecursiveForce = followNext('nextRecursiveForce');

        newF.getClassName = () => {
            return "n";
        }
        return newF;
    }

    n.series = (...y) => {
        let tmp = null;
        for (let i = y.length - 1; i >= 0; i--) {
            let item = y[i];
            if (tmp === null) {
                tmp = getItem(item);
            } else {
                let prev = getItem(item);
                prev.append(tmp);
                tmp = prev;
            }
        }
        return tmp;
    }

    let getItem = (item) => {
        if (typeof item !== "function") {
            throw new Error("Expect n function like n(()=>10)");
        }
        if (!item.getClassName || item.getClassName() !== "n") {
            item = n(item);
        }
        return item;
    }

    return n;
}