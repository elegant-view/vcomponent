/**
 * @file 扩展一下`vtpl/src/utils`
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import {isArray, line2camel, camel2line, distinctArr, bind, forEach, isClass, type} from 'vtpl/src/utils';

let getSuper;
if (Object.getPrototypeOf) {
    getSuper = function (cls) {
        return Object.getPrototypeOf(cls);
    };
}
else {
    getSuper = function (cls) {
        return cls.__proto__ || (
            cls.constructor
                ? cls.constructor.prototype
                : Object.prototype
        );
    };
}

export {getSuper, isArray, line2camel, camel2line, distinctArr, bind, forEach, isClass, type};