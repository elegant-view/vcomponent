/**
 * @file 类型检测
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import {isClass, isFunction} from './utils';

const STRING = Symbol('string');
const NUMBER = Symbol('number');
const ARRAY = Symbol('array');
const BOOLEAN = Symbol('boolean');
const FUNCTION = Symbol('function');
const OBJECT = Symbol('object');
const DATE = Symbol('date');

const REQUIRED = Symbol('required');
const TYPE = Symbol('type');

export const PropTypes = {
    date: {
        [TYPE]: DATE,
        [REQUIRED]: false,
        required: {
            [TYPE]: DATE,
            [REQUIRED]: true
        }
    },
    object: {
        [TYPE]: OBJECT,
        [REQUIRED]: false,
        required: {
            [TYPE]: OBJECT,
            [REQUIRED]: true
        }
    },
    number: {
        [TYPE]: NUMBER,
        [REQUIRED]: false,
        required: {
            [TYPE]: NUMBER,
            [REQUIRED]: true
        }
    },
    func: {
        [TYPE]: FUNCTION,
        [REQUIRED]: false,
        required: {
            [TYPE]: FUNCTION,
            [REQUIRED]: true
        }
    },
    bool: {
        [TYPE]: BOOLEAN,
        [REQUIRED]: false,
        required: {
            [TYPE]: BOOLEAN,
            [REQUIRED]: true
        }
    },
    string: {
        [TYPE]: STRING,
        [REQUIRED]: false,
        required: {
            [TYPE]: STRING,
            [REQUIRED]: true
        }
    },
    array: {
        [TYPE]: ARRAY,
        [REQUIRED]: false,
        required: {
            [TYPE]: ARRAY,
            [REQUIRED]: true
        }
    },
    instanceOf(Class) {
        return {
            [TYPE]: type,
            [REQUIRED]: false,
            required: {
                [TYPE]: type,
                [REQUIRED]: true
            }
        };

        function type(value) {
            return value instanceof Class;
        }
    },
    oneOf(arr) {
        return {
            [TYPE]: type,
            [REQUIRED]: false,
            required: {
                [TYPE]: type,
                [REQUIRED]: true
            }
        };

        function type(value) {
            let isContain = false;
            for (let item of arr) {
                isContain = item === value;
                if (isContain) {
                    break;
                }
            }
            return isContain;
        }
    },
    oneOfType(typeList) {
        return {
            [TYPE]: type,
            [REQUIRED]: false,
            required: {
                [TYPE]: type,
                [REQUIRED]: true
            }
        };

        function type(value) {
            let isContain = false;
            for (let item of typeList) {
                isContain = check(item)(value);
                if (isContain) {
                    break;
                }
            }
            return isContain;
        }
    },
    arrayOf(itemType) {
        return {
            [TYPE]: type,
            [REQUIRED]: false,
            required: {
                [TYPE]: type,
                [REQUIRED]: true
            }
        };

        function type(value) {
            if (!isClass(value, 'Array')) {
                return false;
            }

            let ret = true;
            for (let item of value) {
                ret = check(itemType)(item);
                if (!ret) {
                    break;
                }
            }
            return ret;
        }
    },
    objectOf(valueType) {
        return {
            [TYPE]: type,
            [REQUIRED]: false,
            required: {
                [TYPE]: type,
                [REQUIRED]: true
            }
        };

        function type(value) {
            if (typeof value !== 'object' || isClass(value, 'Array')) {
                return false;
            }

            let ret = true;
            /* eslint-disable fecs-use-for-of */
            for (let key in value) {
                if (!value.hasOwnProperty(key)) {
                    continue;
                }
                ret = check(valueType)(value[key]);
                if (!ret) {
                    break;
                }
            }
            /* eslint-enable fecs-use-for-of */
            return ret;
        }
    },
    shape(typeObj) {
        return {
            [TYPE]: type,
            [REQUIRED]: false,
            required: {
                [TYPE]: type,
                [REQUIRED]: true
            }
        };

        function type(value) {
            if (typeof value !== 'object') {
                return false;
            }

            let ret = true;
            /* eslint-disable fecs-use-for-of */
            for (let key in typeObj) {
                if ((typeObj[key][REQUIRED] && !value.hasOwnProperty(key))
                    || (value.hasOwnProperty(key) && !check(typeObj[key])(value[key]))
                ) {
                    ret = false;
                    break;
                }
            }
            /* eslint-enable fecs-use-for-of */
            return ret;
        }
    }
};

const typeCheckFns = {
    [DATE](value) {
        return isClass(value, 'Date');
    },
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

export default function check(type) {
    // 允许使用自定义prop检查函数
    if (isFunction(type)) {
        return type;
    }

    // 接下来就是内置的检查函数了，如果type不具备内置类型的特征，就抛出异常
    if (!type || !(REQUIRED in type) || !(TYPE in type)) {
        throw new Error('wrong type');
    }

    return function (value) {
        if (value === undefined) {
            return !type[REQUIRED];
        }

        const checkFn = isFunction(type[TYPE]) ? type[TYPE] : typeCheckFns[type[TYPE]];
        return checkFn(value, type);
    };
}
