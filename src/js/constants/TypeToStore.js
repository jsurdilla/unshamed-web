'use strict';

var JournalEntryStore = require('../stores/JournalEntryStore');
var PostStore = require('../stores/PostStore');

module.exports = {
  JournalEntry: JournalEntryStore,
  Post: PostStore
}