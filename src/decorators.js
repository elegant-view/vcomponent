/**
 * @file 装饰器
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import typ from './type';

export function propsType(types) {
    const checkFns = {};
    /* eslint-disable fecs-use-for-of */
    for (let propName in types) {
        if (!types.hasOwnProperty(propName)) {
            continue;
        }
        checkFns[propName] = typ(types[propName]);
    }
    /* eslint-enable fecs-use-for-of */

    return function (target) {
        const ParentClass = Object.getPrototypeOf(target.prototype).constructor;
        const allCheckFns = ParentClass.getPropsCheckFns();

        /* eslint-disable fecs-use-for-of,fecs-valid-map-set */
        for (let propName in checkFns) {
        /* eslint-enable fecs-use-for-of,fecs-valid-map-set */
            if (!checkFns.hasOwnProperty(propName)) {
                continue;
            }

            allCheckFns[propName] = checkFns[propName];
        }

        target.getPropsCheckFns = function () {
            return allCheckFns;
        };
    };
}
