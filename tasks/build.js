var gulp = require("gulp");
var $ = require("gulp-load-plugins")();

gulp.task('extras', function() {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('html', ['styles', "timeline2data"], function() {
  return gulp.src('app/*.html')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['html', 'images', 'iconfont', 'bib', 'attachment', 'extras'], function() {
  return gulp.src('.tmp/index.html')
    .pipe($.vulcanize({
      "excludes": ["scripts/"],
      "inlineCss": true,
      "inlineScripts": true
    }))
    .pipe(gulp.dest('dist'));
});
