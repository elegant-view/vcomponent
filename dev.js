var server = require('dev-server');

server.start({
    rootPath: __dirname,
    port: 8004,
    babel: {
        include: [/\/(test|src)\/.*\.js$/],
        compileOptions: {
            presets: ['es2015', 'stage-0'],
            plugins: [
                'transform-class-properties',
                'babel-plugin-transform-decorators-legacy',
                'transform-es2015-modules-amd'
            ]
        }
    }
});
