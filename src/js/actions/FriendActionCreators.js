'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var FriendAPI = require('../api/FriendAPI');

function fetchFriends(userID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_FRIENDS
  });
  FriendAPI.fetchFriends(userID);
}

function fetchFriendRequests() {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_FRIEND_REQUESTS
  });
  FriendAPI.fetchFriendRequests();
}

function sendFriendRequest(userID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.SEND_FRIEND_REQUEST
  });
  FriendAPI.sendFriendRequest(userID);
}

function cancelFriendRequest(friendRequest) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.CANCEL_FRIEND_REQUEST
  });
  FriendAPI.cancelFriendRequest(friendRequest);
}

function acceptFriendRequest(friendRequest) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.ACCEPT_FRIEND_REQUEST
  });
  FriendAPI.acceptFriendRequest(friendRequest);
}

function rejectFriendRequest(friendRequest) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.REJECT_FRIEND_REQUEST
  });
  FriendAPI.rejectFriendRequest(friendRequest);
}

function unfriend(userID, friendUserID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.UNFRIEND
  });
  FriendAPI.unfriend(userID, friendUserID);
}

module.exports = {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend
}