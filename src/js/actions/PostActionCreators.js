'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var PostAPI = require('../api/PostAPI');

function postStatusUpdate(body) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.POST_STATUS_UPDATE,
    body
  });
  PostAPI.postStatusUpdate(body);
}

function deletePost(post) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.DELETE_POST,
    post
  })
  PostAPI.deletePost(post);
}

module.exports = {
  postStatusUpdate,
  deletePost
}