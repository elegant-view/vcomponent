/**
 * @file 类型检测
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import {isClass} from './utils';

const STRING = Symbol('string');
const NUMBER = Symbol('number');
const ARRAY = Symbol('array');
const BOOLEAN = Symbol('boolean');
const FUNCTION = Symbol('function');
const OBJECT = Symbol('object');

const REQUIRED = Symbol('required');
const TYPE = Symbol('type');

export const PropTypes = {
    object: {
        [TYPE]: OBJECT,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: OBJECT,
            [REQUIRED]: true
        }
    },
    number: {
        [TYPE]: NUMBER,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: NUMBER,
            [REQUIRED]: true
        }
    },
    func: {
        [TYPE]: FUNCTION,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: FUNCTION,
            [REQUIRED]: true
        }
    },
    bool: {
        [TYPE]: BOOLEAN,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: BOOLEAN,
            [REQUIRED]: true
        }
    },
    string: {
        [TYPE]: STRING,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: STRING,
            [REQUIRED]: true
        }
    },
    array: {
        [TYPE]: ARRAY,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: ARRAY,
            [REQUIRED]: true
        }
    }
};

const typeCheckFns = {
    [OBJECT](value) {
        return typeof value === 'object';
    },
    [NUMBER](value) {
        return isClass(value, 'Number');
    },
    [FUNCTION](value) {
        return isClass(value, 'Function');
    },
    [BOOLEAN](value) {
        return isClass(value, 'Boolean');
    },
    [ARRAY](value) {
        return isClass(value, 'Array');
    },
    [STRING](value) {
        return isClass(value, 'String');
    }
};

export default function (type) {
    if (!type || !(REQUIRED in type) || !(TYPE in type)) {
        throw new Error('wrong type');
    }

    return function (value) {
        return (type[REQUIRED] && value && typeCheckFns[type[TYPE]](value))
            || (!type[REQUIRED] && typeCheckFns[type[TYPE]](value));
    };
}
