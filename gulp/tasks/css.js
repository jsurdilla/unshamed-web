var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config = require('../config');
var filter = require('gulp-filter');
var urlAdjuster = require('gulp-css-url-adjuster');

gulp.task('css', function() {
  var cssFilter = filter("trumbowyg.css");

  return gulp.src('./src/styles/**/*.css')
    .pipe(cssFilter)
    .pipe(urlAdjuster({
      prepend: '/images/trumbowyg/'
    }))
    .pipe(cssFilter.restore())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scss', function() {
  return sass('./src/styles/scss', {
    sourcemap: true,
    compass: true,
    style: 'expanded',
    loadPath: [
      './src/styles/scss',
      config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
      config.bowerDir + '/fontawesome/scss',
      ]
    })
    .on("error", handleErrors)
    .pipe(gulp.dest('./dist/css'));
});
