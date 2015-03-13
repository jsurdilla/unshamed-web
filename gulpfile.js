var browserify = require('browserify');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var es6ify = require('es6ify');
var gulp = require('gulp');
var proxy = require('proxy-middleware');
var reactify = require('reactify');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');

gulp.task('clean', function() {
  gulp.src('./dist', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('copy-html', function() {
  gulp
    .src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  var entryFile = './src/js/index.js';

  var b = browserify(entryFile, { debug: true });
  b.transform(reactify);
  b.transform(es6ify);
  var stream = b.bundle();
  stream.on('error', function(err) {
    console.error(err);
  });
  stream = stream.pipe(source(entryFile));
  stream.pipe(rename('index.js'));
  stream.pipe(gulp.dest('dist'));
});

gulp.task('connect', function() {
  connect.server({
    port: 8000,
    middleware: function(connect, o) {
      return [
        (function() {
          var url = require('url');
          var proxy = require('proxy-middleware');
          var options = url.parse('http://localhost:3000/auth');
          options.route = '/auth'
          return proxy(options);
        })()
      ];
    }
  });
});

gulp.task('default', ['clean', 'scripts', 'copy-html']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});
