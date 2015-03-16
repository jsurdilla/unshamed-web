'use strict';

var { assign, flatten, each, pluck } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var CommentStore = require('../stores/CommentStore');
var invariant = require("react/lib/invariant");
var JournalEntryStore = require('./JournalEntryStore');
var { Map, OrderedSet } = require('immutable');
var PostStore = require('./PostStore');
var { typedEntityID } = require('../utils/StoreUtils');

const TYPE_TO_STORE = {
  JournalEntry: JournalEntryStore,
  Post: PostStore
}

var _commentLists = Map();
var _metadata = Map(); // The values are not Immutable

function commentableKey(comment) {
  return comment.commentable_type + '_' + comment.commentable_id;
}

const CommentByStatusStore = assign({
  add(comment) {
    const key = commentableKey(comment);
    var commentList = _commentLists.get(key) || OrderedSet();
    _commentLists = _commentLists.set(key, commentList.add(comment.id));
  },

  remove(comment) {
    const key = commentableKey(comment);
    var commentList = _commentLists.get(key);
    _commentLists = _commentLists.set(key, commentList.delete(comment.id));
  },

  getAll(commentable) {
    invariant(!!commentable.type, 'commentable requires a `type` key. You may have passed an Immutable object.');
    return _commentLists.get(typedEntityID(commentable));
  },

  getRemaining(commentableType, commentableId) {
    return this._getMetadata(commentableType, commentableId).get('remaining');
  },

  _updateMetadata(commentableType, commentableId, metadata) {
    const key = commentableType + '_' + commentableId;
    var existing = _metadata.get(key) || Map();
    _metadata = _metadata.set(key, existing.merge(metadata));
  },

  _getMetadata(commentableType, commentableId) {
    const key = commentableType + '_' + commentableId;
    return _metadata.get(key) || Map();
  }
}, ChangeAwareMixin);


AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([JournalEntryStore.dispatchToken, PostStore.dispatchToken, CommentStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { comment, comments } = payload;

  switch(payload.type) {
    case ActionTypes.LOGOUT: 
      _commentLists = Map();
      break;

    case ActionTypes.FETCH_TIMELINE_ITEM_COMMENTS_SUCCESS:
      // fix later! think about what we want to do with data in general when switching between pages
      _commentLists = Map();
      _metadata = Map(); // The values are not Immutable

      each(comments, (data) => {
        var aComment = data.comments[0];
        if (aComment) {
          CommentByStatusStore._updateMetadata(aComment.commentable_type, aComment.commentable_id, data._metadata);
        }
        each(data.comments, CommentByStatusStore.add);
      });
      CommentByStatusStore.emitChange();
      break;

    case ActionTypes.NEW_COMMENT_PUSH_MSG:
    case ActionTypes.POST_COMMENT_SUCCESS:
      CommentByStatusStore.add(comment);
      CommentByStatusStore.emitChange();
      break;

    case ActionTypes.FETCH_MORE_COMMENTS_SUCCESS:
      const { data } = payload;

      var aComment = data.comments[0];
      if (aComment) {
        CommentByStatusStore._updateMetadata(aComment.commentable_type, aComment.commentable_id, data._metadata);
      }
      each(data.comments, CommentByStatusStore.add);

      CommentByStatusStore.emitChange();
      break;

    case ActionTypes.DELETE_COMMENT_SUCCESS:
      CommentByStatusStore.remove(comment);
      CommentByStatusStore.emitChange();
      break;
  }
});

module.exports = CommentByStatusStore;