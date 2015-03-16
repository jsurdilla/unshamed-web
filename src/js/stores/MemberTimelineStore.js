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

const MemberTimelineStore = assign({
  add(item) {
    _items = _items.add(typedEntityID(item));
  },

  remove(item) {
    _items = _items.delete(typedEntityID(item));
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

MemberTimelineStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([JournalEntryStore.dispatchToken, PostStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { items, post, type } = payload;

  switch (type) {
    case ActionTypes.LOGOUT: 
      reset();
      break;

    case ActionTypes.FETCH_MEMBER_TIMELINE:
      _currentPage = 0;
      _items = OrderedSet();
      _isFetching = true;
      break;
    case ActionTypes.FETCH_MEMBER_TIMELINE_ERROR:
      _isFetching = false;
      MemberTimelineStore.emitChange();
      break;
    case ActionTypes.FETCH_MEMBER_TIMELINE_SUCCESS:
      _isFetching = false;
       if (items.length) {
        _currentPage++;
        each(items, MemberTimelineStore.add);
      } else {
        _hasMore = false;
      }
      MemberTimelineStore.emitChange();
      break;

    case ActionTypes.DELETE_POST_SUCCESS:
      MemberTimelineStore.remove(post);
      MemberTimelineStore.emitChange();
      break;

    // case ActionTypes.POST_STATUS_UPDATE_SUCCESS:
    //   MemberTimelineStore.add(post);
    //   MemberTimelineStore.emitChange();
    //   break;

    // case ActionTypes.NEW_STATUS_UPDATE_PUSH_MSG:
    //   MemberTimelineStore.add(post)
    //   MemberTimelineStore.emitChange();
    //   break;
  }
});

module.exports = MemberTimelineStore;