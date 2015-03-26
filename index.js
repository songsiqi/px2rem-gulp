var path = require('path');
var extend = require('extend');
var through = require('through2');
var gutil = require('gulp-util');
var Px2rem = require('px2rem');
var chalk = require('chalk');
var fs = require('fs-extra');

// Vinyl is a very simple metadata object that describes a file，
// see https://medium.com/@contrahacks/gulp-3828e8126466
// We use it to output multiple files from a single input file while using gulp.
// see https://gist.github.com/cecilemuller/40880002c340edaa7e4a
var File = require('vinyl');

var PluginError = gutil.PluginError;
var pluginName = 'gulp-px3rem';


module.exports = function(options) {

    var config = {
        baseDpr: 2,             // base device pixel ratio (default: 2)
        threeVersion: true,     // whether to generate 3x version (default: true)
        remVersion: true,       // whether to generate rem version (default: true)
        remUnit: 64,            // rem unit value (default: 64)
        remPrecision: 6,        // rem precision (default: 6)
        forcePxComment: 'px',   // force px comment (default: `px`)
        keepComment: 'no'       // not change value comment (default: `no`)
    };

    extend(config, options);

    function transformFunction(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(new PluginError(pluginName, 'Streaming not supported'));
        }

        if (file.isBuffer()) {
            var px2remIns = new Px2rem(config);
            var cssText = file.contents.toString('utf8');
            var pathName = file.path;
            var fileName = path.basename(file.path);
            var base = path.join(file.path, '..');

            // generate @1x, @2x and @3x version
            if (config.threeVersion) {
                for (var dpr = 1; dpr <= 3; dpr++) {
                    var newCssText = px2remIns.generateThree(cssText, dpr);
                    var newFileName = fileName.replace(/(.debug)?.css/, dpr + 'x.debug.css');
                    var vfile = new File({
                        base: base,
                        path: path.join(base, newFileName),
                        contents: new Buffer(newCssText)
                    });
                    this.push(vfile);
                }
            }

            // generate rem version
            if (config.remVersion) {
                var newCssText = px2remIns.generateRem(cssText);
                var newFileName = fileName.replace(/(.debug)?.css/, '.debug.css');
                var vfile = new File({
                    base: base,
                    path: path.join(base, newFileName),
                    contents: new Buffer(newCssText)
                });
                this.push(vfile);
            }
        }

        return callback(); // indicate that the file has been processed
    }

    return through.obj(transformFunction); // returning the file stream
};
