'use strict';

var PostServerActionCreators = require('../actions/PostServerActionCreators');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var PusherUtils = require("../utils/PusherUtils");
var superagent = require('superagent');

function postStatusUpdate(body) {
  superagent
    .post('/api/v1/posts')
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .send({ body: body})
    .end((err, resp) => {
      if (err) {
        PostServerActionCreators.handlePostStatusUpdateError(err, resp);
      } else {
        PostServerActionCreators.handlePostStatusUpdateSuccess(JSON.parse(resp.text).post);
      }
    });
}

function deletePost(post) {
  superagent
    .del('/api/v1/posts/' + post.id)
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        PostServerActionCreators.handleDeletePostError(err, resp);
      } else {
        PostServerActionCreators.handleDeletePostSuccess(post);
      }
    });
}

module.exports = {
  postStatusUpdate,
  deletePost
};