'use strict';

var CurrentUserStore = require('../stores/CurrentUserStore');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var FriendServerActionCreators = require('../actions/FriendServerActionCreators');
var PusherUtils = require('../utils/PusherUtils');
var superagent = require('superagent');

function fetchFriends() {
  superagent
    .get('/api/v1/friends')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleFetchFriendsError(err, resp);
      } else {
        FriendServerActionCreators.handleFetchFriendsSuccess(CurrentUserStore.getCurrentUser().get('id'), JSON.parse(resp.text).users);
      }
    });
}

function fetchFriendRequests() {
  superagent
    .get('/api/v1/me/friendship_requests')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleFetchFriendRequestsError(err, resp);
      } else {
        FriendServerActionCreators.handleFetchFriendRequestsSuccess(JSON.parse(resp.text));
      }
    });
}

function sendFriendRequest(userID) {
  superagent
    .post('/api/v1/me/friendship_requests')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .send({ user_id: userID })
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleSendFriendRequestError(err, resp);
      } else {
        FriendServerActionCreators.handleSendFriendRequestSuccess(JSON.parse(resp.text).friendship_request);
      }
    });
}

function cancelFriendRequest(friendRequest) {
  superagent
    .del('/api/v1/me/friendship_requests/' + friendRequest.get('id'))
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleCancelFriendRequestError(err, resp);
      } else {
        FriendServerActionCreators.handleCancelFriendRequestSuccess(friendRequest.get('id'));
      }
    });
}

function acceptFriendRequest(friendRequest) {
  superagent
    .post('/api/v1/me/friendship_requests/' + friendRequest.get('id') + '/accept')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleAcceptFriendRequestError(err, resp);
      } else {
        FriendServerActionCreators.handleAcceptFriendRequestSuccess(friendRequest);
      }
    });
}

function rejectFriendRequest(friendRequest) {
  superagent
    .post('/api/v1/me/friendship_requests/' + friendRequest.get('id') + '/reject')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleRejectFriendRequestError(err, resp);
      } else {
        FriendServerActionCreators.handleRejectFriendRequestSuccess(friendRequest)
      }
    });
}

function unfriend(userID, friendUserID) {
  superagent
    .del('/api/v1/users/' + friendUserID + '/friendships')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        FriendServerActionCreators.handleUnfriendError(err, resp);
      } else {
        FriendServerActionCreators.handleUnfriendSuccess(userID, friendUserID);
      }
    });
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