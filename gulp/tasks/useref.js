var gulp = require('gulp');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

gulp.task("useref", function() {
  var jsFilter = filter("**/*.js");
  var cssFilter = filter("**/*.css");

  var userefAssets = useref.assets();

  gulp.src(['./dist/images/**/*'])
    .pipe(gulp.dest('../unshamed/public/images'));

  gulp.src(['./dist/fonts/**/*'])
    .pipe(gulp.dest('../unshamed/public/fonts'));

  gulp.src(['./dist/terms.html'])
    .pipe(gulp.dest('../unshamed/public'));

  return gulp.src("dist/index.html")
    .pipe(userefAssets) // Concatenate with gulp-useref
    .pipe(jsFilter)
    .pipe(uglify()) // Minify any javascript sources
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(csso()) // Minify any CSS sources
    .pipe(cssFilter.restore())
    .pipe(rev()) // Rename the concatenated files
    .pipe(userefAssets.restore())
    .pipe(useref())
    .pipe(revReplace()) // Substitute in new filenames
    .pipe(gulp.dest('../unshamed/public'));
});