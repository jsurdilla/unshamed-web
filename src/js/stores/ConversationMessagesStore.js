var { assign, pluck } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var ConversationStore = require('./ConversationStore');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var MessageStore = require('./MessageStore');
var { Map, OrderedSet } = require('Immutable');

let _currentPage;
let _hasMore;
let _isFetching;
let _conversations;

function reset() {
  _currentPage = 0;
  _hasMore = true;
  _isFetching = false;
  _conversations = Map();
}
reset();

const ConversationMessagesStore = assign({
  add(conversationID, messageIDs) {
    let currentMessageIDs = _conversations.get(conversationID) || OrderedSet();
    _conversations = _conversations.set(conversationID, currentMessageIDs.merge(messageIDs))
  },

  get(conversationID) {
    return _conversations.get(parseInt(conversationID));
  },

  hasMore() {
    return _hasMore;
  },

  isFetching() {
    return _isFetching;
  }
}, ChangeAwareMixin);

AppDispatcher.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([ConversationStore.dispatchToken, MessageStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { comments, conversations, conversationID, conversation, message } = payload;

  switch(payload.type) {
    case ActionTypes.FETCH_MESSAGES:
      _isFetching = true;
      break;
    case ActionTypes.FETCH_MESSAGES:
      _isFetching = false;
      break;
    case ActionTypes.FETCH_MESSAGES_SUCCESS:
      _isFetching = false;
      ConversationMessagesStore.add(conversation.id, pluck(conversation.messages, 'id'));
      ConversationMessagesStore.emitChange();
      break;

    case ActionTypes.REPLY_TO_CONVERSATION_SUCCESS:
      ConversationMessagesStore.add(conversation.id, [message.id]);
      ConversationMessagesStore.emitChange();
      break;

    case ActionTypes.NEW_REPLY_PUSH:
      ConversationMessagesStore.add(message.conversation.id, [message.message.id]);
      ConversationMessagesStore.emitChange();
      break;
  }
});

module.exports = ConversationMessagesStore;