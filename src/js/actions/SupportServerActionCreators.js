'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchItemSupportSummariesSuccess(support_summaries) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_ITEM_SUPPORT_SUMMARIES_SUCCESS,
    support_summaries
  });
}

function handleFetchItemSupportSummariesError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_ITEM_SUPPORT_SUMMARIES_ERROR,
    response
  });
}

function handleToggleItemSupportSuccess(item, result) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.TOGGLE_ITEM_SUPPORT_SUCCESS,
    item,
    result
  });
}

function handleToggleItemSupportError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.TOGGLE_ITEM_SUPPORT_ERROR,
    response: response
  });
}

function handleSupportCountChangePush(message) {
  AppDispatcher.handlePushAction({ 
    type: ActionTypes.SUPPORT_COUNT_CHANGE_PUSH_MSG,
    message
  });
}

module.exports = {
  handleFetchItemSupportSummariesError,
  handleFetchItemSupportSummariesSuccess,

  handleToggleItemSupportError,
  handleToggleItemSupportSuccess,
  handleSupportCountChangePush
}