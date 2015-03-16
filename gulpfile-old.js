var autoprefix = require('gulp-autoprefixer');
var bower = require('gulp-bower');
var browserify = require('browserify');
var connect = require('gulp-connect');
var del = require('del');
var es6ify = require('es6ify');
var gulp = require('gulp');
var gutil = require('gutil');
var notify = require("gulp-notify");
var proxy = require('proxy-middleware');
var reactify = require('reactify');
var rename = require('gulp-rename');
var watchify = require('watchify');
var sass = require('gulp-ruby-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

var config = {
  sassPath: './src/scss',
  bowerDir: './bower_components'
}

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
  return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('clean', function(cb) {
  del(['./dist'], cb);
});


gulp.task('css', function() {
  return sass(config.sassPath, {
    compass: true,
    style: 'expanded',
    loadPath: [
      './src/scss',
      config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
      config.bowerDir + '/fontawesome/scss',
    ]})
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
    }))
    .pipe(autoprefix('last 2 version'))
    .pipe(gulp.dest('./dist/css'));
});








gulp.task('copy-html', function() {
  gulp
    .src('src/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-js-from-bower', function() {
  gulp
    .src([
      './bower_components/pusher/dist/pusher.js', 
      './bower_components/jquery/dist/jquery.js',
      './bower_components/trumbowyg/dist/trumbowyg.js',
      './bower_components/pickadate/lib/picker*.js'])
    .pipe(gulp.dest('./dist'));

  gulp
    .src([
      './bower_components/trumbowyg/dist/ui/trumbowyg.css'])
    .pipe(gulp.dest('./dist/css'));
  gulp.src([
    './bower_components/pickadate/lib/themes/*.css'])
    .pipe(gulp.dest('./dist/css/pickadate'));
  gulp
    .src([
      './bower_components/trumbowyg/dist/ui/images/*'])
    .pipe(gulp.dest('./dist/css/images'));
});

gulp.task('copy-images', function() {
  gulp
    .src('src/images/**/*')
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('scripts', function() {
  var entryFile = './src/js/index.js';

  var b = browserify(entryFile, {
    debug: true
  });
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
        })(),

        (function() {
          var url = require('url');
          var proxy = require('proxy-middleware');
          var options = url.parse('http://localhost:3000/api');
          options.route = '/api'
          return proxy(options);
        })(),

        (function() {
          var url = require('url');
          var proxy = require('proxy-middleware');
          var options = url.parse('http://localhost:8000/dist/images');
          options.route = '/images'
          return proxy(options);
        })()
      ];
    }
  });
});

gulp.task('default', ['bower', 'icons', 'css', 'scripts', 'copy-html', 'copy-js-from-bower', 'copy-images']);

gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/*.scss', ['css']);
  // gulp.watch('src/**/*.js', ['scripts']);
});


function compileScripts() {
  gutil.log('Running compileScripts');

  var entryFile = './src/js/index.js';


  watchify.args.debug = true;

  var b = watchify(browserify(watchify.args));
  b.add(entryFile);

  // var b = browserify(entryFile, {
  //   debug: true
  // });

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

  return bundle();
}

gulp.task('exp', function() {
  compileScripts();

  gulp.watch(config.sassPath + '/*.scss', ['css']);
});
