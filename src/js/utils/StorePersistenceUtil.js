'use strict';

var Cookies = require('cookies-js');

function saveActiveConversation(conversationID) {
  Cookies.set('active_convo', conversationID, { path: '/' });
}

function getActiveConversation() {
  return parseInt(Cookies.get('active_convo'));
}

module.exports = {
  getActiveConversation,
  saveActiveConversation
};