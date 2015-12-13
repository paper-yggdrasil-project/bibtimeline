var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('iconfont', function(){
  return gulp.src(['app/styles/icons/*'])
    .pipe(gulp.dest('dist/styles/icons/'));
});

gulp.task('styles', function(){
  gulp.src('app/styles/*.scss')
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    // .pipe($.sass.sync({
    //   outputStyle: 'expanded',
    //   precision: 10,
    //   includePaths: ['.']
    // }).on('error', $.sass.logError))
    .pipe($.sass())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});
