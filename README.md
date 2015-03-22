# gulp-px3rem

(px2rem)[https://www.npmjs.com/package/px2rem]的gulp插件

独立cli使用见(px2rem)[https://www.npmjs.com/package/px2rem]

## 使用

```
var gulp = require('gulp');
var px2rem = require('../index');

gulp.task('px2rem', function() {
    gulp.src('./*.css')
        .pipe(px2rem({output: './dest'}))
});
```

参数选项：

```
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
```
