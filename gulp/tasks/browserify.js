var browserify = require('browserify');
var es6ify = require('es6ify');
var gulp = require('gulp');
var gutil = require('gutil');
var reactify = require('reactify');
var rename = require('gulp-rename');
var watchify = require('watchify');
var sass = require('gulp-ruby-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

function browserifyTask(callback, devMode) {

  var browserifyThis = function() {
    gutil.log('Running compileScripts');

    var entryFile = './src/js/index.js';

    watchify.args.debug = true;

    var b = devMode ? watchify(browserify(watchify.args)) : browserify(watchify.args);
    b.add(entryFile);

    b.transform(reactify);
    b.transform(es6ify);

    b.on('update', bundle);
    b.on('log', gutil.log);

    function bundle() {
      gutil.log('Running bundle...');
      return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(source(entryFile))
        .pipe(rename('index.js'))
              .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write()) // writes .map file
        .pipe(gulp.dest('dist'));
    }

    callback();

    return bundle();
  }

  browserifyThis();
}

gulp.task('browserify', browserifyTask);

module.exports = browserifyTask;