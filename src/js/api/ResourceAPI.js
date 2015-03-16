'use strict';

var ResourceServerActionCreators = require('../actions/ResourceServerActionCreators');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var superagent = require('superagent');

function fetchResources() {
  superagent
    .get('/api/v1/resources')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        ResourceServerActionCreators.handleFetchResourcesError(err, resp);
      } else {
        ResourceServerActionCreators.handleFetchResourcesSuccess(JSON.parse(resp.text).resources);
      }
    });
}

module.exports = {
  fetchResources
};