'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleCreateNewJournalEntrySuccess(journalEntry) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.CREATE_NEW_JOURNAL_ENTRY_SUCCESS,
    journalEntry
  });
}

function handleCreateNewJournalEntryError(err, resp) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.CREATE_NEW_JOURNAL_ENTRY_ERROR,
    err,
    resp
  });
}

function handleUpdateJournalEntrySuccess(journalEntry) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.UPDATE_JOURNAL_ENTRY_SUCCESS,
    journalEntry
  });
}

function handleUpdateJournalEntryError(err, resp) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.UPDATE_JOURNAL_ENTRY_ERROR,
    err,
    resp
  });
}

function handleFetchJournalEntriesSuccess(journalEntries) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_JOURNAL_ENTRIES_SUCCESS,
    journalEntries
  });
}

function handleFetchJournalEntriesError(err, resp) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_JOURNAL_ENTRIES_ERROR,
    err,
    resp
  });
}

function handleDeleteJournalEntrySuccess(journalEntryID) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.DELETE_JOURNAL_ENTRY_SUCCESS,
    journalEntryID
  });
}

function handleDeleteJournalEntryError(err, resp) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.DELETE_JOURNAL_ENTRY_ERROR,
    err,
    resp
  });
}

module.exports = {
  handleCreateNewJournalEntrySuccess,
  handleCreateNewJournalEntryError,

  handleUpdateJournalEntrySuccess,
  handleUpdateJournalEntryError,

  handleFetchJournalEntriesSuccess,
  handleFetchJournalEntriesError,

  handleDeleteJournalEntrySuccess,
  handleDeleteJournalEntryError
}