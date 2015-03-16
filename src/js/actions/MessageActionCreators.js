var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var MessageAPI = require('../api/MessageAPI');

function fetchMessages(conversationID, earliestMessageID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_MESSAGES
  });
  MessageAPI.fetchMessages(conversationID, earliestMessageID);
}

module.exports = {
  fetchMessages
}