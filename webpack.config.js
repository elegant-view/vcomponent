module.exports = {
    entry: {
        'main.js': ['./src/main.js'],
        'test/main.js': './test/main.js'
    },
    output: {
        path: __dirname,
        filename: './dist/[name]'
    }
};
