'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var SupportAPI = require('../api/SupportAPI');

function toggleItemSupport(item) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.TOGGLE_ITEM_SUPPORT,
    item
  });
  SupportAPI.toggleItemSupport(item);
}

function fetchItemSupportSummaries(timelineItems) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_TIMELINE_SUPPORTS_SUCCESS,
    timelineItems
  });
  SupportAPI.fetchItemSupportSummaries(timelineItems);
}

module.exports = {
  toggleItemSupport,
  fetchItemSupportSummaries
}