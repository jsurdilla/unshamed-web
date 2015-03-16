'use strict';

var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var JournalServerActionCreators = require('../actions/JournalServerActionCreators');
var PusherUtils = require('../utils/PusherUtils');
var superagent = require('superagent');

function createNewJournalEntry(journalEntry) {
  superagent
    .post('/api/v1/journal_entries')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .send(journalEntry)
    .end((err, resp) => {
      if (err) {
        JournalServerActionCreators.handleCreateNewJournalEntryError(err, resp);
      } else {
        JournalServerActionCreators.handleCreateNewJournalEntrySuccess(JSON.parse(resp.text).journal_entry);
      }
    });
}

function updateJournalEntry(journalEntryID, params) {
  superagent
    .put('/api/v1/journal_entries/' + journalEntryID)
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .send({ journal_entry: params })
    .end((err, resp) => {
      if (err) {
        JournalServerActionCreators.handleUpdateJournalEntryError(err, resp);
      } else {
        JournalServerActionCreators.handleUpdateJournalEntrySuccess(JSON.parse(resp.text).journal_entry);
      }
    });
}

function fetchJournalEntries() {
  superagent
    .get('/api/v1/journal_entries')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        JournalServerActionCreators.handleFetchJournalEntriesError(err, resp);
      } else {
        JournalServerActionCreators.handleFetchJournalEntriesSuccess(JSON.parse(resp.text).journal_entries);
      }
    });
}

function deleteJournalEntry(journalEntryID) {
  superagent
    .del('/api/v1/journal_entries/' + journalEntryID)
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        JournalServerActionCreators.handleDeleteJournalEntryError(err, resp);
      } else {
        JournalServerActionCreators.handleDeleteJournalEntrySuccess(journalEntryID);
      }
    });
}

module.exports = {
  createNewJournalEntry,
  updateJournalEntry,
  fetchJournalEntries,
  deleteJournalEntry
}