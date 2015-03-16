var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var { Map, OrderedMap } = Immutable;

var CHANGE_EVENT = 'change';

var _conversations;
var _currentConversationId;

function reset() {
  _conversations = OrderedMap();
  _currentConversationId = null;
}
reset();

var ConversationStore = assign({
  getConversation: (conversationID) => _conversations.get(parseInt(conversationID)),

  getConversations: () => _conversations,

  getCurrentConversationID: () => _currentConversationId
}, ChangeAwareMixin);

ConversationStore.dispatchToken = AppDispatcher.register((payload) => {

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { comments } = payload;

  switch(action.type) {
    case ActionTypes.LOGOUT: 
      reset();
      break;

    case ActionTypes.RECEIVE_CONVERSATIONS:
      each(action.conversations, (conversation) => {
        _conversations = _conversations.set(conversation.id, Immutable.fromJS(conversation));
      });

      ConversationStore.emitChange();
      break;
    case ActionTypes.RECEIVE_CONVERSATION:
      ConversationStore.emitChange();
      break;
    case ActionTypes.CLICK_CONVERSATION:
      _currentConversationId = parseInt(action.conversationID);
      ConversationStore.emitChange();
      break;
  }
});

module.exports = ConversationStore;
