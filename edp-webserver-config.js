/* eslint-disable */
exports.port = 7000;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
exports.getLocations = function () {
    return [
        {
            location: /(src|test)\/.+\.js$/,
            handler: babel({
                "stage": 0,
                "modules": "amd",
                "compact": false,
                "ast": false,
                "blacklist": ["strict"],
                "externalHelpers": false
            })
        },
        {
            location: /\/$/,
            handler: home( 'test/main.html' )
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
/* eslint-enable */
