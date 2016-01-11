module.exports = {
    entry: {
        'main.js': ['./src/main.js'],
        'test/main.js': './test/main.js'
    },
    output: {
        path: __dirname,
        filename: './dist/[name]'
    },
    loaders: [{
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
            presets: ['es2015']
        }
    }]

};
