/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp');
var config = require('../config');
var watch  = require('gulp-watch');
var gutil = require('gutil');

gulp.task('watch', ['watchify'], function(callback) {
  watch(config.sass.src, function() { gulp.start('scss'); });
  watch('./src/images', function() { gulp.start('images'); });
});
