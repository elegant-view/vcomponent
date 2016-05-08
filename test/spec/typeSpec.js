/**
 * @file type spec
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import typeChecker, {PropTypes} from 'vcomponent/type';

describe('check type', () => {
    it('object', () => {
        expect(typeChecker(PropTypes.object)(undefined)).toBe(true);
        expect(typeChecker(PropTypes.object)(null)).toBe(true);
        expect(typeChecker(PropTypes.object)({})).toBe(true);
        expect(typeChecker(PropTypes.object)([])).toBe(true);

        expect(typeChecker(PropTypes.object.required)(undefined)).toBe(false);
        expect(typeChecker(PropTypes.object.required)(null)).toBe(true);
    });

    it('instanceOf', () => {
        expect(typeChecker(PropTypes.instanceOf(Array))([])).toBe(true);
        expect(typeChecker(PropTypes.instanceOf(Array).required)(undefined)).toBe(false);
    });

    it('oneOf', () => {
        expect(typeChecker(PropTypes.oneOf(['a', 'b']))(undefined)).toBe(true);
        expect(typeChecker(PropTypes.oneOf(['a', 'b']))('a')).toBe(true);
        expect(typeChecker(PropTypes.oneOf(['a', 'b']))('c')).toBe(false);
        expect(typeChecker(PropTypes.oneOf(['a', 'b']).required)(undefined)).toBe(false);
    });

    it('oneOfType', () => {
        expect(typeChecker(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))(undefined)).toBe(true);
        expect(typeChecker(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))('123')).toBe(true);
        expect(typeChecker(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))(['123'])).toBe(false);
        expect(typeChecker(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))(123)).toBe(true);
    });

    it('arrayOf', () => {
        expect(typeChecker(PropTypes.arrayOf(PropTypes.number))(undefined)).toBe(true);
        expect(typeChecker(PropTypes.arrayOf(PropTypes.number))([1, 2, 3])).toBe(true);
        expect(typeChecker(PropTypes.arrayOf(PropTypes.number))([1, 2, '3'])).toBe(false);
    });

    it('objectOf', () => {
        expect(typeChecker(PropTypes.objectOf(PropTypes.number))({})).toBe(true);
        expect(typeChecker(PropTypes.objectOf(PropTypes.number))([1, 2, 3])).toBe(false);
        expect(typeChecker(PropTypes.objectOf(PropTypes.number))({a: 1, b: 2})).toBe(true);
        expect(typeChecker(PropTypes.objectOf(PropTypes.number))({a: 1, b: '2'})).toBe(false);
    });

    it('shape', () => {
        expect(typeChecker(PropTypes.shape({name: PropTypes.string}))({name: 'yibuyisheng'})).toBe(true);
        expect(typeChecker(PropTypes.shape({name: PropTypes.string}))({name: false})).toBe(false);
    });
});
