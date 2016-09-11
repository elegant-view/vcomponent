import Component from 'vcomponent/Component';
import VComponent from 'vcomponent/main';

describe('ComponentParserSpec', () => {
    let node;
    beforeEach(() => {
        node = document.createElement('div');
    });
    afterEach(() => {
        node = null;
    });

    it('base', done => {
        class Base extends Component {
            getTemplate() {
                return 'base';
            }
        }

        node.innerHTML = '<ev-base></ev-base>';
        const vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Base]);
        vc.render(() => {
            expect(node.textContent).toBe('base');
            vc.destroy();
            done();
        });
    });

    it('props', done => {
        class Test extends Component {
            getTemplate() {
                return '{props.name}';
            }
        }

        node.innerHTML = '<ev-test name="yibuyisheng"></ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render(() => {
            expect(node.textContent).toBe('yibuyisheng');
            vc.destroy();
            done();
        });
    });

    it('children', done => {
        class Test extends Component {
            getTemplate() {
                return '{props.children}';
            }
        }

        node.innerHTML = '<ev-test>yibuyisheng</ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render(() => {
            expect(node.textContent).toBe('yibuyisheng');
            vc.destroy();
            done();
        });
    });

    it('multiple children', done => {
        class Test extends Component {
            getTemplate() {
                return '<b>{props.children.child1}</b><b>{props.children.child2}</b>';
            }
        }

        node.innerHTML = `
            <ev-test>
                <!-- child: child1 -->
                    yibuyisheng
                <!-- /child -->
                <!-- child: child2 -->
                    1
                <!-- /child -->
            </ev-test>
        `;
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render(() => {
            expect(node.textContent.replace(/\s+/g, '')).toBe('yibuyisheng1');
            vc.destroy();
            done();
        });
    });

    it('css class', done => {
        class Test extends Component {
            getTemplate() {
                return '<div class="{props.class}"></div>';
            }
        }

        node.innerHTML = '<ev-test></ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render(() => {
            expect(node.firstElementChild.getAttribute('class')).toBe('test component');
            vc.destroy();
            done();
        });
    });

    it('out data', done => {
        class Test extends Component {
            getTemplate() {
                return '{props.name}';
            }
        }

        node.innerHTML = '<ev-test name="{outerName}"></ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render();

        vc.setData({
            outerName: 'yibuyisheng'
        }, {
            done() {
                expect(node.textContent).toBe('yibuyisheng');
                done();
                vc.destroy();
            }
        });
    });

    it('out function', done => {
        class Test extends Component {
            propsChange() {
                expect(this.props.function).toBe(fn);
                done();
            }
        }

        node.innerHTML = '<ev-test function="{outerFunction}"></ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render();

        vc.setData({
            outerFunction: fn
        });

        function fn() {}
    });

    it('rest props 1', done => {
        class Test extends Component {
            ready() {
                expect(this.props.name).toBe('zhangsan');
                done();
            }

            propsChange() {
                done(new Error('should not change props'));
            }
        }

        node.innerHTML = '<ev-test name="zhangsan" ev-rest="${restObj}"></ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render();

        vc.setData({
            restObj: {
                name: 'yibuyisheng'
            }
        });
    });

    it('rest props 2', done => {
        class Test extends Component {
            ready() {
                expect(this.props.name).toBe('zhangsan');
            }

            propsChange() {
                expect(this.props.name2).toBe('yibuyisheng');
                done();
            }
        }

        node.innerHTML = '<ev-test name="zhangsan" ev-rest="{restObj}"></ev-test>';
        let vc = new VComponent({startNode: node, endNode: node});
        vc.registerComponents([Test]);
        vc.render();

        vc.setData({
            restObj: {
                name2: 'yibuyisheng'
            }
        });
    });
});
