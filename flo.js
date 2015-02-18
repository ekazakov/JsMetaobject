var flo = require('fb-flo');
var path = require('path');
var fs = require('fs');

var server = flo('./js', {
    port: 8888,
    host: 'localhost',
    verbose: false,
    glob: ['**/*.js']
}, resolver);

console.log('Flo server started');

function resolver (filepath, callback) {
    // console.log("-----------------");
    console.log(filepath);
    // console.log("-----------------");

    callback({
        resourceURL: 'js/index' + path.extname(filepath),
        contents: fs.readFileSync('./js/' + filepath),
        reload: true,
        update: function (win, resUrl) {
            // [].slice
            //     .call(document.querySelectorAll('#mocha > *'))
            //     .forEach(function (item) { item.remove(); })
            // ;
            // win.mocha.setup('tdd');
            // win.mocha.run();
            console.log('Resource ' + resUrl + ' updated!');
        }
    });
}
