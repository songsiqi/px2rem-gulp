var path = require('path');
var extend = require('extend');
var through = require('through2');
var gutil = require('gulp-util');
var Px2rem = require('px2rem');
var chalk = require('chalk');
var fs = require('fs-extra');

var PluginError = gutil.PluginError;
var pluginName = 'gulp-px3rem';

// 保存文件内容
function saveFile(filePath, content) {
    fs.createFileSync(filePath);
    fs.writeFileSync(filePath, content, {encoding: 'utf8'});
    console.log(chalk.cyan.bold('[Success]: ') + filePath);
}


module.exports = function(options) {

    var config = {
        baseDpr: 2,             // 基准devicePixelRatio，默认为2
        threeVersion: true,     // 是否生成1x、2x、3x版本，默认为true
        remVersion: true,       // 是否生成rem版本，默认为true
        remUnit: 64,            // rem基准像素，默认为64
        remPrecision: 6,        // rem计算精度，默认为6，即保留小数点后6位
        forcePxComment: 'px',   // 不转换为rem的注释，默认为"px"
        keepComment: 'no',      // 不参与转换的注释，默认为"no"，如1px的边框
        output: '.'             // 输出路径，默认为当前路径
    };

    extend(config, options);

    function transformFunction(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(new PluginError(pluginName, 'Streaming not supported'));
        }

        if (file.isBuffer()) { // FIXME: 这样无法链式操作
            var px2remIns = new Px2rem(config);
            var cssText = file.contents.toString();
            var pathName = file.path;
            var fileName = path.basename(file.path);

            // 生成3份版本
            if (config.threeVersion) {
                for (var dpr = 1; dpr <= 3; dpr++) {
                    var newCssText = px2remIns.generateThree(cssText, dpr);
                    var newFileName = fileName.replace(/(.debug)?.css/, dpr + 'x.debug.css');
                    var newFilepath = path.join(config.output, newFileName);
                    saveFile(newFilepath, newCssText);
                    // file.path = newFileName;
                    // file.contents = new Buffer(newCssText);
                    // callback(null, file);
                }
            }

            // 生成rem版本
            if (config.remVersion) {
                var newCssText = px2remIns.generateRem(cssText);
                var newFileName = fileName.replace(/(.debug)?.css/, '.debug.css');
                var newFilepath = path.join(config.output, newFileName);
                saveFile(newFilepath, newCssText);
            }
        }

        return callback();
    }

    function flushFunction(callback) {
        // ...
    }

    return through.obj(transformFunction, flushFunction);
};
