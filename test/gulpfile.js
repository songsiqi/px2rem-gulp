var gulp = require('gulp');
var px2rem = require('../index');

gulp.task('px2rem-1', function() {
    gulp.src('./src/**/*.css')
        .pipe(px2rem())
        .pipe(gulp.dest('./src'));
});

gulp.task('px2rem-2', function() {
    gulp.src('./*.css')
        .pipe(px2rem())
        .pipe(gulp.dest('dest'));
});
