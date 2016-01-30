/**
 * @file 处理Number、Boolean、String、Date基本数据类型
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Data from 'vtpl/src/Data';

export default class BaseDataType extends Data {
    constructor(rawValue) {
        super();
        this.$$raw = rawValue;
    }

    clone() {
        return new BaseDataType(this.$$raw);
    }

    equals(target) {
        return this.$$raw === target.$$raw;
    }

    toString() {
        return String(this.$$raw);
    }
}
