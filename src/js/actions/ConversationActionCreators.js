var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ConversationAPI = require('../api/ConversationAPI');

function fetchConversations() {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_CONVERSATIONS
  });
  ConversationAPI.fetchConversations();
}

function clickConversation(conversationID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.CLICK_CONVERSATION,
    conversationID
  });
}

function replyToConversation(conversationID, reply) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.REPLY_TO_CONVERSATION,
    conversationID,
    reply
  });
  ConversationAPI.replyToConversation(conversationID, reply);
}

function startConversation(userIDs, message) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.START_CONVERSATION,
    userIDs,
    message
  });
  ConversationAPI.startConversation(userIDs, message);
}

module.exports = {
  fetchConversations,
  clickConversation,
  replyToConversation,
  startConversation
}