'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var JournalAPI = require('../api/JournalAPI');

function createNewJournalEntry(params) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.CREATE_NEW_JOURNAL_ENTRY,
    params
  });
  JournalAPI.createNewJournalEntry(params);
}

function updateJournalEntry(journalEntryID, params) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.UPDATE_JOURNAL_ENTRY,
    journalEntryID,
    params
  });
  JournalAPI.updateJournalEntry(journalEntryID, params);
}

function fetchJournalEntries() {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_JOURNAL_ENTRIES
  });
  JournalAPI.fetchJournalEntries();
}

function deleteJournalEntry(journalEntryID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.DELETE_JOURNAL_ENTRY
  });
  JournalAPI.deleteJournalEntry(journalEntryID);
}

module.exports = {
  createNewJournalEntry,
  updateJournalEntry,
  fetchJournalEntries,
  deleteJournalEntry
}
