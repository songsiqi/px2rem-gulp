var gulp = require('gulp');
var px2rem = require('../index');

gulp.task('px2rem-1', function() {
    gulp.src(['./src/**/*.css', '!./src/**/*.debug.css'])
        .pipe(px2rem({remUnit: 64, threeVersion: true}))
        .pipe(gulp.dest('src'));
});

gulp.task('px2rem-2', function() {
    gulp.src('./*.css')
        .pipe(px2rem({remUnit: 64, threeVersion: true}))
        .pipe(gulp.dest('dest'));
});

gulp.task('default', ['px2rem-1', 'px2rem-2']);
