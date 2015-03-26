var gulp = require('gulp');
var px2rem = require('../index');

gulp.task('px2rem', function() {
    gulp.src('./*.css')
        .pipe(px2rem())
        .pipe(gulp.dest('./dest'))
});
