var gulp = require("gulp");
var markdown = require('gulp-markdown');
var timeline2data = require("../my-gulp-plugins/timeline-to-data");
var data2js = require("../my-gulp-plugins/data-to-js");
var bib2timeline = require("../my-gulp-plugins/bib-to-timeline");

gulp.task('bib', function() {
  return gulp.src(['app/bib/*.bib'])
    .pipe(gulp.dest('dist/bib'));
});

gulp.task('pdf', function() {
  return gulp.src(['app/attachments/*.pdf'])
    .pipe(gulp.dest('dist/attachments'));
});

gulp.task('md', function() {
  return gulp.src(['app/attachments/*.md'])
    .pipe(markdown())
    .pipe(gulp.dest('.tmp/attachments'))
    .pipe(gulp.dest('dist/attachments'));
});

gulp.task('attachment', ["pdf", "md"]);

gulp.task("timeline2data", function() {
  return gulp.src(["app/bib/timeline.json", "app/bib/*.bib", "app/attachments/*"])
    .pipe(timeline2data())
    .pipe(gulp.dest('.tmp/bib'));
});

gulp.task("bibtimeline", ["timeline2data"], function() {
  return gulp.src([".tmp/bib/data.json"])
    .pipe(data2js())
    .pipe(gulp.dest(".tmp/scripts"));
})

gulp.task("timeline:generate", function() {
  return gulp.src(["app/bib/*.bib"])
    .pipe(bib2timeline())
    .pipe(gulp.dest("app/bib"));
})
