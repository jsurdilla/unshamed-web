var gulp = require('gulp');
var config = require('../config');

gulp.task('fonts', function() {
  return gulp.src(config.bowerDir + '/fontawesome/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
});