'use strict';

var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { Map } = require('immutable');

var _journalEntries = Map();
var _inProgress = false;

const JournalEntryStore = assign({
  add(status) {
    if (status.type === 'JournalEntry') {
      _journalEntries = _journalEntries.set(status.id, createEntityWithClientID(status));
    }
  },

  get(id) {
    return _journalEntries.get(parseInt(id));
  },

  inProgress() {
    return _inProgress;
  }
}, ChangeAwareMixin);

JournalEntryStore.dispatchToken = AppDispatcher.register((payload) => {

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { journalEntry, journalEntries, items } = payload;

  switch(payload.type) {
    case ActionTypes.LOGOUT:
      _journalEntries = Map();
      break;

    case ActionTypes.FETCH_MEMBER_TIMELINE_SUCCESS:
    case ActionTypes.FETCH_TIMELINE_SUCCESS:
      each(items, JournalEntryStore.add);
      JournalEntryStore.emitChange();
      break;

    case ActionTypes.FETCH_JOURNAL_ENTRIES_SUCCESS:
      each(journalEntries, JournalEntryStore.add);
      JournalEntryStore.emitChange();
      break;

    case ActionTypes.UPDATE_JOURNAL_ENTRY:
    case ActionTypes.CREATE_JOURNAL_ENTRY:
      _inProgress = true;
      JournalEntryStore.emitChange();
      break;

    case ActionTypes.UPDATE_JOURNAL_ENTRY:
    case ActionTypes.CREATE_JOURNAL_ENTRY_ERROR:
      _inProgress = false;
      JournalEntryStore.emitChange();
      break;

    case ActionTypes.UPDATE_JOURNAL_ENTRY_SUCCESS:
    case ActionTypes.CREATE_NEW_JOURNAL_ENTRY_SUCCESS:
      _inProgress = false;
      JournalEntryStore.add(journalEntry);
      JournalEntryStore.emitChange();
      break;
  }
});

module.exports = JournalEntryStore;