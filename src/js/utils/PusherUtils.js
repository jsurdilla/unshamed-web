var Cookies = require('cookies-js');
var CommentServerActionCreators = require('../actions/CommentServerActionCreators');
var ConversationServerActionCreators = require('../actions/ConversationServerActionCreators');
var FriendServerActionCreators = require('../actions/FriendServerActionCreators');
var PostServerActionCreators = require('../actions/PostServerActionCreators');
var SessionUtils = require('../utils/SessionUtils');
var SupportServerActionCreators = require('../actions/SupportServerActionCreators');

var _socket;
var _channel;

function getSocketID() {
  return Cookies.get('pusher_socket_id');
}

function connect(user) {
  if (!user) {
    return console.info("Cannot set up Pusher because user isn't logged in.");
  }

  console.log('Setting up Pusher');

  let pusherKey;
  if (document.URL.indexOf('unshamed.com') !== -1) {
    pusherKey = '6920741a0fb1dbe72c03';
  } else if (document.URL.indexOf('localhost') !== -1) {
    pusherKey = '72fe26e940fa1cb1dd72';
  }

  _socket = new Pusher(pusherKey, {
    authEndpoint: '/api/v1/pusher/auth',
    auth: {
      headers: SessionUtils.retrieveAuthHeaders()
    }
  });

  _socket.connection.bind('connected', () => {
    Cookies.set('pusher_socket_id', _socket.connection.socket_id, { path: '/' });
  });

  _channel = _socket.subscribe('private-user' + user.get('id'));

  _channel.bind('message-count-changed', (message) => {
    ConversationServerActionCreators.handleMessageCountChangePush(message);
  });

  _channel.bind('new-reply', (message) => {
    ConversationServerActionCreators.handleNewReplyPush(message);
  });

  _channel.bind('new-post', (message) => {
    PostServerActionCreators.handleNewPostPush(message.post);
  });

  _channel.bind('new-comment', (message) => {
    CommentServerActionCreators.handleNewCommentPush(message.comment);
  });

  _channel.bind('support-count-change', (message) => {
    SupportServerActionCreators.handleSupportCountChangePush(message);
  });

  _channel.bind('new-friend-request', (message) => {
    FriendServerActionCreators.handleNewFriendRequestPush(message);
  });

  _channel.bind('cancel-friend-request', (message) => {
    FriendServerActionCreators.handleCancelFriendRequestPush(message);
  });

  _channel.bind('rejected-friend-req', (message) => {
    FriendServerActionCreators.handleRejectedFriendRequestPush(message);
  });

  _channel.bind('accepted-friend-req', (message) => {
    FriendServerActionCreators.handleAcceptedFriendRequestPush(message);
  });

  _channel.bind('unfriend', (message) => {
    FriendServerActionCreators.handleUnfriendPush(message);
  });
}

function disconnect() {
  _socket.disconnect();
}

var PusherUtils = {
  getSocketID,
  connect,
  disconnect
};

module.exports = PusherUtils;