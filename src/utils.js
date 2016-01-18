/**
 * @file 扩展一下`vtpl/src/utils`
 * @author yibuyisheng(yibuyisheng@163.com)
 */

let utils = require('vtpl/src/utils');

module.exports = utils.extend(utils, {
    getSuper: Object.getPrototypeOf
        ? function (cls) {
            return Object.getPrototypeOf(cls);
        }
        : function (cls) {
            return cls.__proto__ || (
                cls.constructor
                    ? cls.constructor.prototype
                    : Object.prototype
            );
        }
});

// exports.getSuper = Object.getPrototypeOf
//     ? function (cls) {
//         return Object.getPrototypeOf(cls);
//     }
//     : function (cls) {
//         return cls.__proto__ || (
//             cls.constructor
//                 ? cls.constructor.prototype
//                 : Object.prototype
//         );
//     };

// export * from 'vtpl/src/utils';
