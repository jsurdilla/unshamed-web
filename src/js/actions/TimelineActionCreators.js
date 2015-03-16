'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var TimelineAPI = require('../api/TimelineAPI');

function fetchHomeTimeline(page) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_TIMELINE,
    page
  });

  TimelineAPI.fetchHomeTimeline(page);
}

module.exports = {
  fetchHomeTimeline
}