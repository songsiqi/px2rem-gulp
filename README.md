# gulp-px3rem

This is a gulp plugin for [px2rem](https://www.npmjs.com/package/px2rem)

CLI tool provided in [px2rem](https://www.npmjs.com/package/px2rem)

## Usage

```
var gulp = require('gulp');
var px2rem = require('../index');

gulp.task('px2rem', function() {
    gulp.src('./*.css')
        .pipe(px2rem())
        .pipe(gulp.dest('./dest'))
});
```

### Options

```
px2rem({
    baseDpr: 2,             // base device pixel ratio (default: 2)
    threeVersion: true,     // whether to generate 3x version (default: true)
    remVersion: true,       // whether to generate rem version (default: true)
    remUnit: 64,            // rem unit value (default: 64)
    remPrecision: 6,        // rem precision (default: 6)
    forcePxComment: 'px',   // force px comment (default: `px`)
    keepComment: 'no'       // no transform value comment (default: `no`)
})
```

## License

MIT
