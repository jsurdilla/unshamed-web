'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handlePostCommentSuccess(comment) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.POST_COMMENT_SUCCESS,
    comment
  });
}

function handlePostCommentError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.POST_COMMENT_ERROR,
    response
  });
}

function handleDeleteCommentSuccess(comment) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.DELETE_COMMENT_SUCCESS,
    comment
  });
}

function handleDeleteCommentError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.DELETE_COMMENT_ERROR,
    response
  });
}

function handleFetchTimelineItemCommentsSuccess(comments) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_TIMELINE_ITEM_COMMENTS_SUCCESS,
    comments
  });
}

function handleFetchTimelineItemCommentsError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_TIMELINE_ITEM_COMMENTS_ERROR,
    response
  });
}

function handleFetchMoreCommentsSuccess(data) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_MORE_COMMENTS_SUCCESS,
    data
  });
}

function handleFetchMoreCommentsError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_MORE_COMMENTS_ERROR,
    response
  });
}

function handleNewCommentPush(comment) {
  AppDispatcher.handlePushAction({ 
    type: ActionTypes.NEW_COMMENT_PUSH_MSG,
    comment
  });
}

module.exports = {
  handlePostCommentError,
  handlePostCommentSuccess,
  handleNewCommentPush,

  handleFetchTimelineItemCommentsError,
  handleFetchTimelineItemCommentsSuccess,

  handleFetchMoreCommentsError,
  handleFetchMoreCommentsSuccess,

  handleDeleteCommentError,
  handleDeleteCommentSuccess
}