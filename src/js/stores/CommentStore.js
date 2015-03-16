'use strict';

var { assign, each, flatten, pluck } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createStore, createEntityWithClientID } = require('../utils/StoreUtils');
var { Map } = require('immutable');
var HomeTimelineStore = require('./HomeTimelineStore');

var _comments;
var _isPosting;

function reset() {
  _comments = Map();
  _isPosting = false;
}
reset();

const CommentStore = assign({
  add(comment) {
    _comments = _comments.set(comment.id, createEntityWithClientID(comment));
  },

  remove(commentID) {
    _comments = _comments.delete(parseInt(commentID));
  },

  get(id) {
    return _comments.get(id);
  },

  isPosting() {
    return _isPosting;
  }
}, ChangeAwareMixin);

CommentStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([HomeTimelineStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { comments, comment } = payload;

  const { items } = payload;

  switch(payload.type) {
    case ActionTypes.LOGOUT: 
      reset();
      break;

    case ActionTypes.FETCH_TIMELINE_ITEM_COMMENTS_SUCCESS:
      each(flatten(pluck(comments, 'comments')), CommentStore.add);
      break;

    case ActionTypes.POST_COMMENT:
      _isPosting = true;
      CommentStore.emitChange();
      break;

    case ActionTypes.NEW_COMMENT_PUSH_MSG:
    case ActionTypes.POST_COMMENT_SUCCESS:
      _isPosting = false;
      CommentStore.add(payload.comment);
      CommentStore.emitChange();
      break;

    case ActionTypes.FETCH_MORE_COMMENTS_SUCCESS:
      const { data } = payload;
      each(data.comments, CommentStore.add);
      CommentStore.emitChange();
      break;

    case ActionTypes.DELETE_COMMENT_SUCCESS:
      CommentStore.remove(comment.id);
      CommentStore.emitChange();
      break;
  }
});

module.exports = CommentStore;