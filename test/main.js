var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

require.config({
    baseUrl: '/base',

    "packages": [
        {
            "name": "protectobject",
            "location": "node_modules/protectobject/src"
        },
        {
            "name": "event",
            "location": "node_modules/event/src"
        },
        {
            "name": "state",
            "location": "node_modules/state/src"
        },
        {
            "name": "vtpl",
            "location": "node_modules/vtpl/src"
        },
        {
            "name": "vcomponent",
            "location": "src"
        }
    ],

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
