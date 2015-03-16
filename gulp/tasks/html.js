var gulp = require('gulp');

gulp.task('html', function() {
  gulp
    .src('src/**/*.html')
    .pipe(gulp.dest('./dist'));
});