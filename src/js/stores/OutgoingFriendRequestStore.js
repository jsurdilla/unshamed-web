var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var FriendRequestStore = require('./FriendRequestStore');
var { OrderedSet } = require('Immutable');

var _requests = OrderedSet();

var OutgoingFriendRequestStore = assign({
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

OutgoingFriendRequestStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([FriendRequestStore.dispatchToken]);

    // clean up later
  var { action } = payload;
  payload = action || payload;
  var { friendRequests, type, message } = payload;

  switch (payload.type) {
    case ActionTypes.LOGOUT: 
      _requests = OrderedSet();
      break;

    case ActionTypes.FETCH_FRIEND_REQUESTS_SUCCESS:
      each(friendRequests.outgoing_friendship_requests, OutgoingFriendRequestStore.add);
      OutgoingFriendRequestStore.emitChange();
      break;

    case ActionTypes.SEND_FRIEND_REQUEST_SUCCESS:
      const { friendRequest } = payload;
      OutgoingFriendRequestStore.add(friendRequest);
      OutgoingFriendRequestStore.emitChange();
      break;

    case ActionTypes.CANCEL_FRIEND_REQUEST_SUCCESS:
      const { friendRequestID } = payload;
      OutgoingFriendRequestStore.remove(friendRequestID);
      OutgoingFriendRequestStore.emitChange();
      break;

    case ActionTypes.ACCEPTED_FRIEND_REQUEST_PUSH:
    case ActionTypes.REJECTED_FRIEND_REQUEST_PUSH:
      OutgoingFriendRequestStore.remove(message.friendship_request.id);
      OutgoingFriendRequestStore.emitChange();
      break;
  }
});

module.exports = OutgoingFriendRequestStore;