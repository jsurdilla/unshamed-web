var { assign, each, pluck } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var JournalEntryStore = require('./JournalEntryStore');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { OrderedSet } = require('Immutable');

let _journalEntryIDs = OrderedSet();
let _deleted = OrderedSet();
let _isPosting = false;

const JournalEntryListStore = assign({
  add(journalEntryID) {
    _journalEntryIDs = _journalEntryIDs.add(journalEntryID);
  },

  remove(journalEntryID) {
    _journalEntryIDs = _journalEntryIDs.remove(journalEntryID);
    _deleted = _deleted.add(journalEntryID);
  },

  getAll() {
    return _journalEntryIDs;
  },

  isPosting() {
    return _isPosting;
  },

  isDeleted(journalEntryID) {
    return _deleted.has(journalEntryID);
  }
}, ChangeAwareMixin);

JournalEntryListStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([JournalEntryStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { journalEntries, journalEntry, journalEntryID } = payload;

  switch(payload.type) {
    case ActionTypes.LOGOUT: 
      _journalEntryIDs = OrderedSet();
      _deleted = OrderedSet();
      _isPosting = false;
      break;

    case ActionTypes.FETCH_JOURNAL_ENTRIES_SUCCESS:
      each(pluck(journalEntries, 'id'), JournalEntryListStore.add);
      JournalEntryListStore.emitChange();
      break;

    case ActionTypes.UPDATE_JOURNAL_ENTRY:
    case ActionTypes.CREATE_NEW_JOURNAL_ENTRY:
      _isPosting = true;
      JournalEntryListStore.emitChange();
      break;
    case ActionTypes.UPDATE_JOURNAL_ENTRY_ERROR:
    case ActionTypes.CREATE_NEW_JOURNAL_ENTRY_ERROR:
      _isPosting = false;
      JournalEntryListStore.emitChange();
      break;
    case ActionTypes.UPDATE_JOURNAL_ENTRY_SUCCESS:
    case ActionTypes.CREATE_NEW_JOURNAL_ENTRY_SUCCESS:
      _isPosting = false;
      JournalEntryListStore.add(journalEntry.id);
      JournalEntryListStore.emitChange();
      break;

    case ActionTypes.DELETE_JOURNAL_ENTRY_SUCCESS:
      JournalEntryListStore.remove(journalEntryID);
      JournalEntryListStore.emitChange();
      break;
  }
});

module.exports = JournalEntryListStore;