'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchFriendsSuccess(userID, users) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_FRIENDS_SUCCESS,
    userID,
    users
  });
}

function handleFetchFriendsError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_FRIENDS_ERROR,
    response: response
  });
}

function handleFetchFriendRequestsSuccess(friendRequests) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_FRIEND_REQUESTS_SUCCESS,
    friendRequests
  });
}

function handleFetchFriendRequestsError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_FRIEND_REQUESTS_ERROR,
    response: response
  });
}

function handleSendFriendRequestSuccess(friendRequest) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.SEND_FRIEND_REQUEST_SUCCESS,
    friendRequest
  });
}

function handleSendFriendRequestError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.SEND_FRIEND_REQUEST_ERROR,
    response: response
  });
}

function handleCancelFriendRequestSuccess(friendRequestID) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.CANCEL_FRIEND_REQUEST_SUCCESS,
    friendRequestID
  });
}

function handleCancelFriendRequestError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.CANCEL_FRIEND_REQUEST_ERROR,
    response: response
  });
}

function handleAcceptFriendRequestSuccess(friendRequest) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.ACCEPT_FRIEND_REQUEST_SUCCESS,
    friendRequest
  });
}

function handleAcceptFriendRequestError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.ACCEPT_FRIEND_REQUEST_ERROR,
    response: response
  });
}

function handleRejectFriendRequestSuccess(friendRequest) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.REJECT_FRIEND_REQUEST_SUCCESS,
    friendRequest
  });
}

function handleRejectFriendRequestError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.REJECT_FRIEND_REQUEST_ERROR,
    response: response
  });
}

function handleUnfriendSuccess(userID, friendUserID) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.UNFRIEND_SUCCESS,
    userID,
    friendUserID
  });
}

function handleUnfriendError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.UNFRIEND_ERROR,
    response: response
  });
}


// PUSH NOTIFICATIONS
function handleNewFriendRequestPush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.NEW_FRIEND_REQUEST_PUSH,
    message
  });
}

function handleCancelFriendRequestPush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.CANCEL_FRIEND_REQUEST_PUSH,
    message
  });
}

function handleRejectedFriendRequestPush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.REJECTED_FRIEND_REQUEST_PUSH,
    message
  });
}

function handleAcceptedFriendRequestPush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.ACCEPTED_FRIEND_REQUEST_PUSH,
    message
  });
}

function handleUnfriendPush(message) {
  AppDispatcher.handlePushAction({
    type: ActionTypes.UNFRIEND_PUSH,
    message
  });
}

module.exports = {
  handleFetchFriendsError,
  handleFetchFriendsSuccess,

  handleFetchFriendRequestsError,
  handleFetchFriendRequestsSuccess,

  handleSendFriendRequestError,
  handleSendFriendRequestSuccess,

  handleCancelFriendRequestSuccess,
  handleCancelFriendRequestError,

  handleAcceptFriendRequestSuccess,
  handleAcceptFriendRequestError,

  handleRejectFriendRequestSuccess,
  handleRejectFriendRequestError,

  handleUnfriendSuccess,
  handleUnfriendError,

  handleNewFriendRequestPush,
  handleCancelFriendRequestPush,
  handleRejectedFriendRequestPush,
  handleAcceptedFriendRequestPush,
  handleUnfriendPush
}