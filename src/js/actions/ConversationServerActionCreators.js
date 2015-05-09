'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleReplyToConversationSuccess(conversation, message) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.REPLY_TO_CONVERSATION_SUCCESS,
    conversation,
    message
  });
}

function handleReplyToConversationError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.REPLY_TO_CONVERSATION_ERROR
  });
}

function handleFetchConversationsSuccess(response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_CONVERSATIONS_SUCCESS,
    response
  });
}

function handleFetchConversationsError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_CONVERSATIONS_ERROR
  });
}

function handleStartConversationSuccess(conversation) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.START_CONVERSATION_SUCCESS,
    conversation
  });
}

function handleStartConversationError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.START_CONVERSATION_ERROR
  });
}

function handleNewReplyPush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.NEW_REPLY_PUSH,
    message
  });
}

function handleMessageCountChangePush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.MESSAGE_COUNT_CHANGE_PUSH,
    message
  });
}

module.exports = {
  handleReplyToConversationSuccess,
  handleReplyToConversationError,

  handleFetchConversationsSuccess,
  handleFetchConversationsError,

  handleStartConversationSuccess,
  handleStartConversationError,

  handleNewReplyPush,
  handleMessageCountChangePush
};