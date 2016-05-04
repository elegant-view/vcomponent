import Component from 'vcomponent/Component';
import VComponent from 'vcomponent/main';

export default function () {
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

            node.innerHTML = '<ui-base></ui-base>';
            const vc = new VComponent({startNode: node, endNode: node});
            vc.registerComponents([Base]);
            vc.render(() => {
                expect(node.textContent).toBe('base');
                done();
            });
        });

        it('props', done => {
            class Test extends Component {
                getTemplate() {
                    return '${props.name}';
                }
            }

            node.innerHTML = '<ui-test name="yibuyisheng"></ui-test>';
            let vc = new VComponent({startNode: node, endNode: node});
            vc.registerComponents([Test]);
            vc.render(() => {
                expect(node.textContent).toBe('yibuyisheng');
                done();
            });
        });

        it('children', done => {
            class Test extends Component {
                getTemplate() {
                    return '${props.children}';
                }
            }

            node.innerHTML = '<ui-test>yibuyisheng</ui-test>';
            let vc = new VComponent({startNode: node, endNode: node});
            vc.registerComponents([Test]);
            vc.render(() => {
                expect(node.textContent).toBe('yibuyisheng');
                done();
            });
        });

        it('css class', done => {
            class Test extends Component {
                getTemplate() {
                    return '<div class="${props.class}"></div>';
                }
            }

            node.innerHTML = '<ui-test></ui-test>';
            let vc = new VComponent({startNode: node, endNode: node});
            vc.registerComponents([Test]);
            vc.render(() => {
                expect(node.firstElementChild.getAttribute('class')).toBe('test component');
                done();
            });
        });

        it('out data', done => {
            class Test extends Component {
                getTemplate() {
                    return '${props.name}';
                }
            }

            node.innerHTML = '<ui-test name="${outerName}"></ui-test>';
            let vc = new VComponent({startNode: node, endNode: node});
            vc.registerComponents([Test]);
            vc.render();

            vc.setData({
                outerName: 'yibuyisheng'
            }, {
                done() {
                    expect(node.textContent).toBe('yibuyisheng');
                    done();
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

            node.innerHTML = '<ui-test function="${outerFunction}"></ui-test>';
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

            node.innerHTML = '<ui-test name="zhangsan" d-rest="${restObj}"></ui-test>';
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

            node.innerHTML = '<ui-test name="zhangsan" d-rest="${restObj}"></ui-test>';
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
}
