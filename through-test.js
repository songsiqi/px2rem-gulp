var path = require('path');
var gulp = require('gulp');
var through2 = require('through2');
var File = require('vinyl');


function generate_two_text_files_from_one_json(){
    'use strict';
    return through2.obj(function(file, enc, next){
        var mydata = JSON.parse(file.contents.toString('utf8'));
        var base = path.join(file.path, '..');

        var first = new File({
            base: base,
            path: path.join(base, 'first.txt'),
            contents: new Buffer('First file: ' + mydata.something)
        });
        this.push(first);

        var second = new File({
            base: base,
            path: path.join(base, 'second.txt'),
            contents: new Buffer('Second file: ' + mydata.another_thing)
        });
        this.push(second);

        next();
    });
}


gulp.task('default', function(){
    'use strict';
    return gulp.src(['src/*/mydata.json'])
    .pipe(generate_two_text_files_from_one_json())
    .pipe(gulp.dest('output'));
});
