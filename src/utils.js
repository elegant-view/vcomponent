/**
 * @file 扩展一下`vtpl/src/utils`
 * @author yibuyisheng(yibuyisheng@163.com)
 */

export * from 'vtpl/utils';

export function getSuper(cls) {
    return Object.getPrototypeOf(cls.prototype).constructor;
}
