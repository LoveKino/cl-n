'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var ListBox = function ListBox(insLen) {
    if (typeof insLen !== 'number') throw new TypeError('Expect number for ' + insLen);
    if (insLen < 0) throw new TypeError('insLen is less than 0');
    this.insLen = insLen;
    this.pMap = {};
};

ListBox.prototype = {
    constructor: ListBox,
    place: function place(values, index) {
        if (typeof index !== 'number') throw new TypeError('Expect number for ' + index);
        if (index < 0) throw new TypeError('index is less than 0');
        if (index >= this.insLen) throw new TypeError('index is not less than ' + this.insLen);
        if (!isArray(values)) throw new TypeError('Expect array like type for ' + values);
        this.pMap[index] = values;
    },
    isFull: function isFull() {
        var keys = getKeys(this.pMap);
        return keys.length >= this.insLen;
    },
    getList: function getList() {
        var pList = [];
        for (var index in this.pMap) {
            pList[index] = this.pMap[index];
        }

        var list = [];
        for (var i = 0; i < pList.length; i++) {
            var item = pList[i];
            if (isArray(item)) {
                list = list.concat(item);
            }
        }
        return list;
    }
};

var isArray = function isArray(v) {
    return v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && typeof v.length === 'number';
};

var getKeys = function getKeys(map) {
    if (Object.keys) return Object.keys(map);

    var names = [];
    for (var name in map) {
        names.push(name);
    }
    return names;
};

module.exports = ListBox;