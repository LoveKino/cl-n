let ListBox = function(insLen) {
    if (typeof insLen !== 'number')
        throw new TypeError('Expect number for ' + insLen);
    if (insLen < 0)
        throw new TypeError('insLen is less than 0');
    this.insLen = insLen;
    this.pMap = {};
}

ListBox.prototype = {
    constructor: ListBox,
    place: function(values, index) {
        if (typeof index !== 'number')
            throw new TypeError('Expect number for ' + index);
        if (index < 0)
            throw new TypeError('index is less than 0');
        if (index >= this.insLen)
            throw new TypeError('index is not less than ' + this.insLen);
        if (!isArray(values))
            throw new TypeError('Expect array like type for ' + values);
        this.pMap[index] = values;
    },
    isFull: function() {
        let keys = getKeys(this.pMap);
        return keys.length >= this.insLen;
    },
    getList: function() {
        let pList = [];
        for (let index in this.pMap) {
            pList[index] = this.pMap[index];
        }

        let list = [];
        for (let i = 0; i < pList.length; i++) {
            let item = pList[i];
            if (isArray(item)) {
                list = list.concat(item);
            }
        }
        return list;
    }
}

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let getKeys = (map) => {
    if (Object.keys) return Object.keys(map);

    let names = [];
    for (let name in map) {
        names.push(name);
    }
    return names;
}

module.exports = ListBox;