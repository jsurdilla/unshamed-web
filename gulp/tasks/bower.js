var bower = require('gulp-bower');
var config = require('../config');
var gulp = require('gulp');

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./dist/bower_components'));
}); 