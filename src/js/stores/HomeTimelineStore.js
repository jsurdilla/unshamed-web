'use strict';

var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID, typedEntityID } = require('../utils/StoreUtils');
var JournalEntryStore = require('./JournalEntryStore');
var { OrderedSet } = require('immutable');
var PostStore = require('./PostStore');

var _currentPage;
var _hasMore;
var _isFetching;
var _items;

function reset() {
  _currentPage = 0;
  _hasMore = true;
  _isFetching = false;
  _items = OrderedSet();
}
reset();

const HomeTimelineStore = assign({
  add(item) {
    _items = _items.add(typedEntityID(item));
  },

  remove(post) {
    _items = _items.remove(typedEntityID(post));
  },

  getAll() {
    return _items;
  },

  getCurrentPage() {
    return _currentPage;
  },

  hasMore() {
    return _hasMore;
  },

  isFetching() {
    return _isFetching;
  }

}, ChangeAwareMixin);

HomeTimelineStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([JournalEntryStore.dispatchToken, PostStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { items, journalEntry, post, type } = payload;

  switch (type) {
    case ActionTypes.LOGOUT: 
      reset();
      break;

    case ActionTypes.FETCH_TIMELINE:
      _isFetching = true;
      break;
    case ActionTypes.FETCH_TIMELINE_ERROR:
      _isFetching = false;
      break;
    case ActionTypes.FETCH_TIMELINE_SUCCESS:
      _isFetching = false;
       if (items.length) {
        _currentPage++;
        each(items, HomeTimelineStore.add);
        HomeTimelineStore.emitChange();
      } else {
        _hasMore = false;
      }
      break;

    case ActionTypes.UPDATE_JOURNAL_ENTRY_SUCCESS:
      HomeTimelineStore.remove(journalEntry);
      HomeTimelineStore.emitChange();
      break;

    case ActionTypes.POST_STATUS_UPDATE_SUCCESS:
      HomeTimelineStore.add(post);
      HomeTimelineStore.emitChange();
      break;

    case ActionTypes.NEW_STATUS_UPDATE_PUSH_MSG:
      HomeTimelineStore.add(post)
      HomeTimelineStore.emitChange();
      break;

    case ActionTypes.DELETE_POST_SUCCESS:
      HomeTimelineStore.remove(post);
      HomeTimelineStore.emitChange();
      break;
  }
});

module.exports = HomeTimelineStore;