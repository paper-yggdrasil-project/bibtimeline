var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var requireDir = require('require-dir');
var dir        = requireDir('./tasks');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy:gh-pages', ["build"], function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

gulp.task('serve', ["styles", "bibtimeline", "md"], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch("app/scss/*.scss", ['styles']);
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', reload);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});
