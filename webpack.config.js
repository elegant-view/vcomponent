var webpack = require("webpack");

module.exports = {
    entry: {
        'main.js': './src/main.js'
    },
    output: {
        path: __dirname,
        filename: './dist/[name]',
        libraryTarget: 'amd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
};
