var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { List, Map, Set } = require('Immutable');

var _requests = Map();

var FriendRequestStore = assign({
  add(friendRequest) {
    _requests = _requests.set(friendRequest.id, createEntityWithClientID(friendRequest));
  },

  get(friendRequestID) {
    return _requests.get(parseInt(friendRequestID));
  },

  remove(friendRequestID) {
    _requests = _requests.remove(friendRequestID);
  },

  accept(friendRequestID) {
    _requests = _requests.set(friendRequestID, _requests.get(friendRequestID).set('state', 'accepted'));
  },

  reject(friendRequestID) {
    _requests = _requests.set(friendRequestID, _requests.get(friendRequestID).set('state', 'rejected'));
  }
}, ChangeAwareMixin);

FriendRequestStore.dispatchToken = AppDispatcher.register((payload) => {
    // clean up later
  var { action } = payload;
  payload = action || payload;
  var { friendRequestID, friendRequest, friendRequests, type, message } = payload;

  switch (payload.type) {
    case ActionTypes.LOGOUT:
      _requests = Map();
      break;

    case ActionTypes.FETCH_FRIEND_REQUESTS_SUCCESS:
      each(friendRequests.incoming_friendship_requests, FriendRequestStore.add);
      each(friendRequests.outgoing_friendship_requests, FriendRequestStore.add);
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.SEND_FRIEND_REQUEST_SUCCESS:
      FriendRequestStore.add(friendRequest);
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.CANCEL_FRIEND_REQUEST_SUCCESS:
      FriendRequestStore.remove(friendRequestID);
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.ACCEPT_FRIEND_REQUEST_SUCCESS:
      FriendRequestStore.accept(friendRequest.get('id'));
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.REJECT_FRIEND_REQUEST_SUCCESS:
      FriendRequestStore.reject(friendRequest.get('id'));
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.NEW_FRIEND_REQUEST_PUSH:
      FriendRequestStore.add(message.friendship_request);
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.CANCEL_FRIEND_REQUEST_PUSH:
      FriendRequestStore.remove(message.friendship_request.id);
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.REJECTED_FRIEND_REQUEST_PUSH:
      FriendRequestStore.reject(message.friendship_request.id);
      FriendRequestStore.emitChange();
      break;

    case ActionTypes.ACCEPTED_FRIEND_REQUEST_PUSH:
      FriendRequestStore.accept(message.friendship_request.id);
      FriendRequestStore.emitChange();
      break;
  }
});

module.exports = FriendRequestStore;