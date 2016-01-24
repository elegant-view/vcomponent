import ComponentParser from './ComponentParser';
import ExprParserEnhance from './ExprParserEnhance';
import ComponentParser from 'vcomponent/src/ComponentParser';
import Tree from 'vtpl/src/trees/Tree';
import vtpl from 'vtpl/src/main';
import NodesManager from 'vtpl/src/nodes/NodesManager';
import DomUpdater from 'vtpl/src/DomUpdater';
import ExprCalculater from 'vtpl/src/ExprCalculater';
import Config from 'vtpl/src/Config';

export default function () {
    describe('ComponentParserSpec', () => {
        let nodesManager;
        let domUpdater;
        let node;
        let config = new Config();
        let exprCalculater;

        beforeEach(() => {
            nodesManager = new NodesManager();
            domUpdater = new DomUpdater();
            domUpdater.start();
            node = nodesManager.createElement('div');
            exprCalculater = new ExprCalculater();
        });

        afterEach(() => {
            nodesManager.destroy();
            domUpdater.destroy();
            exprCalculater.destroy();
            exprCalculater.destroy();
        });

        it('simple list', done => {
            node.setInnerHTML('<!-- for: students as student -->${student.name}<!-- /for -->');
            let tree = new Tree({startNode: node, endNode: node});
            setTreeVar(tree);
            tree.compile();
            tree.rootScope.set({students: [
                {
                    name: 'yibuyisheng1'
                },
                {
                    name: 'yibuyisheng2'
                }
            ]});
            tree.link();
            setTimeout(() => {
                expect(node.$node.innerText.replace(/\s*/g, '')).toBe('yibuyisheng1yibuyisheng2');

                tree.rootScope.set({students: [
                    {
                        name: 'yibuyisheng3'
                    }
                ]});
                setTimeout(() => {
                    expect(node.$node.innerText.replace(/\s*/g, '')).toBe('yibuyisheng3');
                    done();
                }, 70);
            }, 70);
        });

        function setTreeVar(tree) {
            tree.setTreeVar('nodesManager', nodesManager);
            tree.setTreeVar('config', config);
            tree.setTreeVar('exprCalculater', exprCalculater);
            tree.setTreeVar('domUpdater', domUpdater);
        }
    });
}
