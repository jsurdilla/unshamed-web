'use strict';

var { assign } = require('lodash');
var SessionUtils = require('../utils/SessionUtils');
var superagent = require('superagent');

// Requests that start from root
function requestFromRoot(options) {
  var options = assign({
    type: 'json'
  }, options);

  return superagent()
    .set(SessionUtils.retrieveAuthHeaders())
    .type(options.type);
}

function request(options) {
  var options = assign({
    type: 'json'
  }, options);

  return superagent()
    .set(SessionUtils.retrieveAuthHeaders())
    .type(type);
}

module.exports = {
  requestFromRoot,
  request
};