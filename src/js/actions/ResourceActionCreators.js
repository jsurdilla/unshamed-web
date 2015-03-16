'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ResourceAPI = require('../api/ResourceAPI');

function fetchResources() {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_RESOURCES
  });

  ResourceAPI.fetchResources();
}

module.exports = {
  fetchResources
}