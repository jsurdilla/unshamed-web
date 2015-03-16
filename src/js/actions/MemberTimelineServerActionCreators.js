'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchMemberTimelineSuccess(userID, items, page) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_MEMBER_TIMELINE_SUCCESS,
    userID,
    items,
    page
  });
}

function handleFetchMemberTimelineError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_MEMBER_TIMELINE_ERROR,
    response: response
  });
}

module.exports = {
  handleFetchMemberTimelineError,
  handleFetchMemberTimelineSuccess
}