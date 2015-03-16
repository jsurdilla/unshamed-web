'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handlePostStatusUpdateSuccess(post) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.POST_STATUS_UPDATE_SUCCESS,
    post: post
  });
}

function handlePostStatusUpdateError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.POST_STATUS_UPDATE_ERROR,
    response: response
  });
}

function handleNewPostPush(post) {
  AppDispatcher.handlePushAction({ 
    type: ActionTypes.NEW_STATUS_UPDATE_PUSH_MSG,
    post
  });
}

function handleDeletePostSuccess(post) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.DELETE_POST_SUCCESS,
    post: post
  });
}

function handleDeletePostError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.DELETE_POST_ERROR,
    response: response
  });
}

module.exports = {
  handlePostStatusUpdateError,
  handlePostStatusUpdateSuccess,

  handleDeletePostError,
  handleDeletePostSuccess,

  handleNewPostPush
}