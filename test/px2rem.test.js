'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var px2rem = require('..');
var gutil = require('gulp-util');

function createVinylFile(fileName, base) {
  base = base || '.';
  base = path.join(__dirname, base);
  var realFilePath = path.join(__dirname, fileName);
  var virtualFilePath = path.join(base, fileName);

  return new gutil.File({
    cwd: __dirname,
    base: base,
    path: virtualFilePath,
    contents: fs.readFileSync(realFilePath)
  });
}

describe('px2rem-gulp', function () {

  it('[default] should output right rem file', function (done) {
    var oldCssFile = createVinylFile('test.css');
    var stream = px2rem();
    stream.on('data', function (newCssFile) {
      var outputText = newCssFile.contents.toString('utf8');
      var expectedText = fs.readFileSync(path.join(__dirname, 'test.debug.css'), {encoding: 'utf8'});
      assert.equal(outputText, expectedText);
      done();
    });
    stream.write(oldCssFile);
    stream.end();
  });

  it('should output right @1x, @2x and @3x file', function (done) {
    var oldCssFile = createVinylFile('test.css');
    var stream = px2rem({threeVersion: true, remVersion: false});
    var count = 3;
    stream.on('data', function (newCssFile) {
      var dpr = newCssFile.path.match(/test(\d)x\./i)[1];
      var outputText = newCssFile.contents.toString('utf8');
      var expectedText = fs.readFileSync(path.join(__dirname, 'test' + dpr + 'x.debug.css'), {encoding: 'utf8'});
      assert.equal(outputText, expectedText);
      if (!--count) {
        done();
      }
    });
    stream.write(oldCssFile);
    stream.end();
  });

  it('should output right file cwd, base and path', function (done) {
    var base = 'vbase';
    var oldCssFile = createVinylFile('test.css', base);
    var stream = px2rem();
    stream.on('data', function (newCssFile) {
      assert.equal(newCssFile.cwd, __dirname);
      assert.equal(newCssFile.base, path.join(__dirname, base));
      assert.equal(newCssFile.path, path.join(__dirname, base, 'test.debug.css'));
      done();
    });
    stream.write(oldCssFile);
    stream.end();
  });

  it('should compile multiple css files', function (done) {
    var oldCssFiles = [
      createVinylFile('test.css'),
      createVinylFile('test.css', 'vbase')
    ];
    var count = oldCssFiles.length;
    var stream = px2rem();
    stream.on('data', function (newCssFile) {
      var outputText = newCssFile.contents.toString('utf8');
      var expectedText = fs.readFileSync(path.join(__dirname, 'test.debug.css'), {encoding: 'utf8'});
      assert.equal(outputText, expectedText);
      if (!--count) {
        done();
      }
    });
    oldCssFiles.forEach(function (oldCssFile) {
      stream.write(oldCssFile);
    });
    stream.end();
  });
});
