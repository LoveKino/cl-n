import Net from './net';

import RN from './rn';

// TODO source, box can know which network it belongs to.
// split function and box
// add path

module.exports = () => {
    let net = Net();

    let createNewF = (f, context) => {
        if (typeof f !== 'function') {
            throw new TypeError('Expect function');
        }

        // node used to build static relationships

        let fNode = net.node({
            source: f
        });

        let out = (...args) => {
            let rn = new RN(fNode);
            // export functions at out runtime
            assign('next', out, rn);
            assign('nextForce', out, rn);
            assign('nextRecursive', out, rn);
            return rn.run(args);
        }

        // need pass context 
        let meddle = (enlace) => (...args) => {
            let rn = new RN(fNode, enlace);
            // export functions at out runtime
            assign('next', out, rn);
            assign('nextForce', out, rn);
            assign('nextRecursive', out, rn);
            return rn.run(args);
        }

        // 
        context = context || out;
        fNode.data.context = context;
        fNode.data.fun = meddle;

        out.getNode = () => fNode;
        return out;
    }

    let staticRelation = (out) => {
        out.c = out.append = (...y) => {
            for (let i = 0; i < y.length; i++) {
                let item = getItem(y[i]);
                item = item.getNode();
                let fNode = out.getNode();
                fNode.append.call(fNode, item);
            }
            return out;
        }
    }

    let n = (f, context) => {
        let out = createNewF(f, context);
        staticRelation(out);
        out.getClassName = () => 'n';
        return out;
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
        if (typeof item !== 'function') {
            throw new Error('Expect n function like n(()=>10)');
        }
        if (!item.getClassName || item.getClassName() !== 'n') {
            item = n(item);
        }
        return item;
    }

    return n;
}

let assign = (name, out, ctx) => {
    out[name] = (...y) => ctx[name].apply(ctx, y);
}