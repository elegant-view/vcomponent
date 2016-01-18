var path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: {
        'main.js': ['./src/main.js'],
        'test/main.js': './test/main.js'
    },
    output: {
        path: __dirname,
        filename: './dist/[name]'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            // include: [
            //     path.resolve(__dirname, 'src'),
            //     path.resolve(__dirname, 'test'),
            // ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }],
        resolve: {
            extensions: ['', '.js'],
            alias: {
                'vtpl/src/trees/Tree': path.resolve('../vtpl/src/trees/Tree.js'),
                '../trees/Tree': path.resolve('../vtpl/src/trees/Tree.js')
            }
        }
    }
};
