var connect = require('gulp-connect');
var gulp = require('gulp');
var proxy = require('proxy-middleware');

gulp.task('connect', function() {
  connect.server({
    root: './',
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