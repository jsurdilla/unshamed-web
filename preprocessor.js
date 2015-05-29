var ReactTools = require('react-tools');
var browserify = require('./gulp/tasks/browserify');

module.exports = {
  process: function(src) {
    return ReactTools.transform(src, { harmony: true });
  }
};