'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchTimelineSuccess(items, page) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_TIMELINE_SUCCESS,
    items,
    page
  });
}

function handleFetchTimelineError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_TIMELINE_ERROR,
    response: response
  });
}

module.exports = {
  handleFetchTimelineError,
  handleFetchTimelineSuccess
}