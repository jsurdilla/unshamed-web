'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchResourcesSuccess(resources) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_RESOURCES_SUCCESS,
    resources
  });
}

function handleFetchResourcesError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_RESOURCES_ERROR,
    response: response
  });
}

module.exports = {
  handleFetchResourcesError,
  handleFetchResourcesSuccess
}