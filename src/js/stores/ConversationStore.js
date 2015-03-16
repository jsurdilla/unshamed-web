var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { Map } = require('Immutable');

let _conversations = Map();
let _lastReplySent;

const ConversationStore = assign({
  // TODO: merge add an update
  add(conversation) {
    _conversations = _conversations.set(conversation.id, createEntityWithClientID(conversation));
  },

  update(conversation) {
    _conversations = _conversations.set(conversation.id, _conversations.get(conversation.id).mergeDeep(conversation));
  },

  get(conversationID) {
    return _conversations.get(conversationID);
  },

  lastReplySent() {
    return _lastReplySent;
  },

  markAsRead(conversationID) {
    _conversations = _conversations.set(conversationID, _conversations.get(conversationID).set('read', true));
  },

  markAsUnread(conversationID) {
    _conversations = _conversations.set(conversationID, _conversations.get(conversationID).set('read', false));
  }
}, ChangeAwareMixin);

ConversationStore.dispatchToken = AppDispatcher.register((payload) => {

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { conversation, conversationID, conversations, comments, message } = payload;

  switch (payload.type) {
    case ActionTypes.FETCH_CONVERSATIONS_SUCCESS:
      each(conversations, ConversationStore.add);
      ConversationStore.emitChange();
      break;

    case ActionTypes.REPLY_TO_CONVERSATION_SUCCESS:
      _lastReplySent = message.body;
      ConversationStore.update(conversation);
      ConversationStore.emitChange();
      break;

    case ActionTypes.START_CONVERSATION_SUCCESS:
      ConversationStore.add(conversation);
      ConversationStore.markAsRead(conversation.id);
      ConversationStore.emitChange();
      break;

    case ActionTypes.NEW_REPLY_PUSH:
      ConversationStore.add(assign(message.conversation));
      ConversationStore.markAsUnread(message.conversation.id);
      ConversationStore.emitChange();
      break;

    case ActionTypes.CLICK_CONVERSATION:
      ConversationStore.markAsRead(conversationID);
      ConversationStore.emitChange();
      break;
  }
});

module.exports = ConversationStore;