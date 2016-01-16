var path = require('path');

module.exports = {
    entry: {
        'main.js': ['./src/main.js'],
        'test/main.js': './test/main.js'
    },
    output: {
        path: __dirname,
        filename: './dist/[name]',
        // library: 'vcomponent/main',
        // libraryTarget: 'amd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test')
            ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }],
        resolve: {
            extensions: ['', '.js']
        }
    }
};
