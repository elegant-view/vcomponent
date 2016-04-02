/**
 * @file 扩展一下`vtpl/src/utils`
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import * as utils from 'vtpl/utils';

export default utils.extend(utils, {
    getSuper(cls) {
        return Object.getPrototypeOf(cls.prototype).constructor;
    }
});
