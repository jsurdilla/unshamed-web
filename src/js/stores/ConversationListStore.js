var { assign, each, pluck } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var ConversationStore = require('./ConversationStore');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { OrderedSet } = require('Immutable');

let _conversations = OrderedSet();
let _isPosting = false;

const ConversationListStore = assign({
  add(conversationID) {
    _conversations = _conversations.add(conversationID);
  },

  getAll() {
    return _conversations;
  },

  isPosting() {
    return _isPosting;
  }
}, ChangeAwareMixin);

AppDispatcher.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([ConversationStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { comments, conversation, conversations, conversationID } = payload;

  switch(payload.type) {
    case ActionTypes.FETCH_CONVERSATIONS_SUCCESS:
      conversations = payload.response.conversations;

      each(pluck(conversations, 'id'), ConversationListStore.add);
      ConversationListStore.emitChange();
      break;

    case ActionTypes.CLICK_CONVERSATION:
      ConversationListStore.markRead(conversationID);
      ConversationListStore.emitChange();
      break;

    case ActionTypes.START_CONVERSATION:
      _isPosting = true;
      break;
    case ActionTypes.START_CONVERSATION_ERROR:
      _isPosting = false;
    case ActionTypes.START_CONVERSATION_SUCCESS:
      _isPosting = false;
      ConversationListStore.add(conversation.id);
      ConversationListStore.emitChange();
      break;
  }
});

module.exports = ConversationListStore;