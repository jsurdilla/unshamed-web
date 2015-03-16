'use strict';

var { assign } = require('lodash');
var CommentServerActionCreators = require('../actions/CommentServerActionCreators');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var PusherUtils = require('../utils/PusherUtils');
var superagent = require('superagent');

function postComment(comment) {
  superagent
    .post('/api/v1/comments')
    .set(retrieveAuthHeaders())
    .send({
      comment: {
        comment: comment.body, 
        commentable_id: comment.commentableID,
        commentable_type: comment.commentableType
      }
    })
    .end((err, resp) => {
      if (err) {
        CommentServerActionCreators.handlePostCommentError(err, resp);
      } else {
        CommentServerActionCreators.handlePostCommentSuccess(JSON.parse(resp.text).comment);
      }
    });
}

function fetchTimelineItemComments(timelineItems) {
  if (!timelineItems.size) {
    return;
  }

  var grouped = timelineItems
    .groupBy(i => i.get('type'))
    .mapEntries(([ type, items ]) => {
      return [type, items.map(i => i.get('id'))];
    })
    .toJS()


  var itemIds = assign({ Post: [], JournalEntry: [] }, grouped);

  var params = {
    post_ids: itemIds.Post.join(','),
    journal_entry_ids: itemIds.JournalEntry.join(','),
    preview: true
  };

  superagent
    .get('/api/v1/comments')
    .query(params)
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        CommentServerActionCreators.handleFetchTimelineItemCommentsError(err, resp);
      } else {
        CommentServerActionCreators.handleFetchTimelineItemCommentsSuccess(JSON.parse(resp.text).items);
      }
    })
}

// Fetches more comment earlier than specified comment ID.
function fetchMoreComments(commentID) {
  superagent
    .get('/api/v1/comments/' + commentID + '/next_page')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        CommentServerActionCreators.handleFetchMoreCommentsError(err, resp);
      } else {
        CommentServerActionCreators.handleFetchMoreCommentsSuccess(JSON.parse(resp.text));
      }
    })
}

function deleteComment(comment) {
  superagent
    .del('/api/v1/comments/' + comment.id)
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        CommentServerActionCreators.handleDeleteCommentError(err, resp);
      } else {
        CommentServerActionCreators.handleDeleteCommentSuccess(comment);
      }
    });
}

module.exports = {
  postComment,
  fetchTimelineItemComments,
  fetchMoreComments,
  deleteComment
};