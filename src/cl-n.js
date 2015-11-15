import Net from "./net";
import enlace from "./enlace";

let N = (opts = {}) => {
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

        newF.c = newF.append = (...y) => {
            for (let i = 0; i < y.length; i++) {
                let item = y[i];
                if (typeof item !== "function") {
                    throw new Error("Expect n function like n(()=>10)");
                }
                if(!item.getClassName || item.getClassName() !== "n"){
                    item = n(item);
                }
                item = item.getNode();
                fNode.append.call(fNode, item);
            }
            return newF;
        }

        newF.getNode = () => fNode;

        newF.next = (...y) => {
            let gen = enlace();
            let list = null;
            let box = gen.create(fNode, (res) => {
                list = res;
            });
            box.next.apply(box, y);
            return list;
        }

        newF.nextRecursive = (...y) => {
            let gen = enlace();
            let list = null;
            let box = gen.create(fNode, (res) => {
                list = res;
            });
            box.nextRecursive.apply(box, y);
            return list;
        }

        newF.getClassName = () => {
            return "n";
        }
        return newF;
    }

    return n;
}

export default N;