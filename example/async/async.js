var N = require("../../index");

let asyncFunction = (f, context) => (...pros) => new Promise((resolve, reject) => {
    let argsPro = Promise.all(pros);
    argsPro.then((args) => {
        let res = f.apply(context, args);
        getValue(res).then((v) => resolve(v));
    }).catch(reject);
});

let getValue = (res) => {
    if (res && typeof res === 'object' &&
        typeof res.then === 'function' &&
        typeof res.catch === 'function') {
        return res;
    } else {
        return Promise.resolve(res);
    }
}

let n = N();

let asyncn = (handler, context) => {
    let asy = n(asyncFunction(handler, context));
    return asy;
}

let h1 = asyncn(() => new Promise((r) => {
    setTimeout(() => {
        console.log('h1');
        let afters = h1.next();
        Promise.all(afters).then((list) => {
            r(list);
        });
    }, 17);
}));

let h2 = asyncn(() => new Promise((r) => {
    setTimeout(() => {
        console.log('h2');
        r(2);
    }, 17);
}));

let h3 = asyncn(() => new Promise((r) => {
    setTimeout(() => {
        console.log('h3');
        r(3);
    }, 17);
}));

h1.c(h2, h3);

h1().then((res) => console.log(res))