var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var ConversationStore = require('./ConversationStore');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { Map } = require('Immutable');

let _messages = Map();

const MessageStore = assign({
  add(message) {
    _messages = _messages.set(message.id, createEntityWithClientID(message));
  },

  get(messageID) {
    return _messages.get(messageID);
  }
}, ChangeAwareMixin);

MessageStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([ConversationStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { conversations, message, messages, conversation } = payload;

  switch (payload.type) {
    case ActionTypes.FETCH_MESSAGES_SUCCESS:
      each(conversation.messages, MessageStore.add);
      MessageStore.emitChange();
      break;

    case ActionTypes.REPLY_TO_CONVERSATION_SUCCESS:
      MessageStore.add(message);
      MessageStore.emitChange();
      break;

    case ActionTypes.NEW_REPLY_PUSH:
      MessageStore.add(message.message);
      MessageStore.emitChange();
      break;
  }
});

module.exports = MessageStore;