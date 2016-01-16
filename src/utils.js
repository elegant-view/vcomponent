import utils from 'vtpl/src/utils';

let exportObj = {
    getSuper(cls) {
        return cls.__proto__ || Object.getPrototypeOf(cls);
    }
};

export default utils.extend(utils, exportObj);
