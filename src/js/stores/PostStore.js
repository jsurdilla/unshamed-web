'use strict';

var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { Map } = require('immutable');

var _posts;
var _isPosting;

function reset() {
  _posts = Map();
  _isPosting = false;  
}
reset();

const PostStore = assign({
  add(statusUpdate) {
    if (statusUpdate.type === 'Post') {
      _posts = _posts.set(statusUpdate.id, createEntityWithClientID(statusUpdate));
    }
  },

  remove(post) {
    if (post.type === 'Post') {
      _posts = _posts.delete(post.id);
    }
  },

  get(id) {
    return _posts.get(parseInt(id));
  },

  isPosting() {
    return _isPosting;
  }
}, ChangeAwareMixin);

PostStore.dispatchToken = AppDispatcher.register((payload) => {
  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { post, items, type } = payload;

  switch(type) {
    case ActionTypes.LOGOUT: 
      reset();
      break;

    case ActionTypes.FETCH_MEMBER_TIMELINE_SUCCESS:
    case ActionTypes.FETCH_TIMELINE_SUCCESS:
      each(items, PostStore.add);
      PostStore.emitChange();
      break;
    case ActionTypes.POST_STATUS_UPDATE:
      _isPosting = true;
      PostStore.emitChange();
      break;
    case ActionTypes.POST_STATUS_UPDATE_SUCCESS:
      _isPosting = false;
      PostStore.add(post);
      PostStore.emitChange();
      break;

    case ActionTypes.NEW_STATUS_UPDATE_PUSH_MSG:
      PostStore.add(post);
      PostStore.emitChange();
      break;

    case ActionTypes.DELETE_POST_SUCCESS:
      PostStore.remove(post);
      PostStore.emitChange();
      break;
  }
});

module.exports = PostStore;