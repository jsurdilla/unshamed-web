'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var CommentAPI = require('../api/CommentAPI');

function postComment(comment) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.POST_COMMENT,
    comment
  });
  CommentAPI.postComment(comment);
}

function deleteComment(comment) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.DELETE_COMMENT,
    comment
  });
  CommentAPI.deleteComment(comment);
}

function fetchTimelineItemComments(timelineItems) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_TIMELINE_ITEM_COMMENTS_SUCCESS,
    timelineItems
  });
  CommentAPI.fetchTimelineItemComments(timelineItems);
}

function fetchMoreComments(commentID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_MORE_COMMENTS,
    commentID
  });
  CommentAPI.fetchMoreComments(commentID);
}

module.exports = {
  postComment,
  fetchTimelineItemComments,
  fetchMoreComments,
  deleteComment
}