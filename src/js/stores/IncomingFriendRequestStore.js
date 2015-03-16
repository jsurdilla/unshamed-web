var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var FriendRequestStore = require('./FriendRequestStore');
var { OrderedSet } = require('Immutable');

var _requests = OrderedSet();

var IncomingFriendRequestStore = assign({
  add(friendRequest) {
    _requests = _requests.add(friendRequest.id);
  },

  remove(friendRequestID) {
    _requests = _requests.remove(friendRequestID);
  },

  getAll() {
    return _requests;
  }
}, ChangeAwareMixin);

IncomingFriendRequestStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([FriendRequestStore.dispatchToken]);

    // clean up later
  var { action } = payload;
  payload = action || payload;
  var { friendRequest, friendRequests, type, message } = payload;

  switch (payload.type) {
    case ActionTypes.LOGOUT: 
      _requests = OrderedSet();
      break;

    case ActionTypes.FETCH_FRIEND_REQUESTS_SUCCESS:
      each(friendRequests.incoming_friendship_requests, IncomingFriendRequestStore.add);
      IncomingFriendRequestStore.emitChange();
      break;

    case ActionTypes.REJECT_FRIEND_REQUEST_SUCCESS:
    case ActionTypes.ACCEPT_FRIEND_REQUEST_SUCCESS:
      IncomingFriendRequestStore.remove(friendRequest.get('id'));
      IncomingFriendRequestStore.emitChange();
      break;

    case ActionTypes.NEW_FRIEND_REQUEST_PUSH:
      IncomingFriendRequestStore.add(message.friendship_request);
      IncomingFriendRequestStore.emitChange();
      break;

    case ActionTypes.CANCEL_FRIEND_REQUEST_PUSH:
      IncomingFriendRequestStore.remove(message.friendship_request.id);
      IncomingFriendRequestStore.emitChange();
      break;
  }
});

module.exports = IncomingFriendRequestStore;