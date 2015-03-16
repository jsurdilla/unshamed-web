'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var TimelineAPI = require('../api/TimelineAPI');

function fetchMemberTimeline(userID, page, isInitial) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_MEMBER_TIMELINE,
    userID,
    page,
    isInitial
  });

  TimelineAPI.fetchMemberTimeline(userID, page);
}

module.exports = {
  fetchMemberTimeline
}