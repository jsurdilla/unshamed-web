'use strict';

var { assign } = require('lodash');
var ConversationServerActionCreators = require('../actions/ConversationServerActionCreators');
var PusherUtils = require("../utils/PusherUtils");
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var superagent = require('superagent');

function fetchConversations() {
  superagent
    .get('/api/v1/conversations')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        ConversationServerActionCreators.handleFetchConversationsError(err, resp);
      } else {
        ConversationServerActionCreators.handleFetchConversationsSuccess(JSON.parse(resp.text).conversations);
      }
    })
}

function replyToConversation(conversationID, reply) {
  superagent
    .post('/api/v1/conversations/' + conversationID + '/reply')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .send({ body: reply })
    .end((err, resp) => {
      if (err) {
        ConversationServerActionCreators.handleReplyToConversationError(err, resp);
      } else {
        var data = JSON.parse(resp.text);
        ConversationServerActionCreators.handleReplyToConversationSuccess(data.conversation, data.message);
      }
    })
}

function startConversation(userIDs, message) {
  superagent
    .post('/api/v1/conversations')
    .send({ user_ids: userIDs, body: message })
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        ConversationServerActionCreators.handleStartConversationError(err, resp);
      } else {
        ConversationServerActionCreators.handleStartConversationSuccess(JSON.parse(resp.text).conversation);
      }
    })
}

module.exports = {
  fetchConversations,
  replyToConversation,
  startConversation
};