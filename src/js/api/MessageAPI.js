'use strict';

var { assign } = require('lodash');
var MessageServerActionCreators = require('../actions/MessageServerActionCreators');
var PusherUtils = require("../utils/PusherUtils");
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var superagent = require('superagent');

function fetchMessages(conversationID, earliestMessageID) {
  superagent
    .get('/api/v1/conversations/' + conversationID)
    .set(retrieveAuthHeaders())
    .query({ message_id: earliestMessageID })
    .end((err, resp) => {
      if (err) {
        MessageServerActionCreators.handleFetchMessagesError(err, resp);
      } else {
        MessageServerActionCreators.handleFetchMessagesSuccess(JSON.parse(resp.text).conversation);
      }
    })
}

module.exports = {
  fetchMessages
}