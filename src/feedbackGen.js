let feedbackGen = (box) => {
    let node = box.node;
    let resCount = node.outs.length;
    let resMap = {};
    let res = [];

    return (nextId, v) => {
        let index = node.outMap[nextId];

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

export default feedbackGen;