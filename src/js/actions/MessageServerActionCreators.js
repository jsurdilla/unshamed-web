'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchMessagesSuccess(conversation) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_MESSAGES_SUCCESS,
    conversation
  });
}

function handleFetchMessagesError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_MESSAGES_ERROR
  });
}

module.exports = {
  handleFetchMessagesSuccess,
  handleFetchMessagesError
};