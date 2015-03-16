'use strict';

var TimelineServerActionCreators = require('../actions/TimelineServerActionCreators');
var MemberTimelineServerActionCreators = require('../actions/MemberTimelineServerActionCreators');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var superagent = require('superagent');

function fetchHomeTimeline(page) {
  superagent
    .get('/api/v1/me/timeline')
    .set(retrieveAuthHeaders())
    .query({ page })
    .end((err, resp) => {
      if (err) {
        TimelineServerActionCreators.handleFetchTimelineError(err, resp);
      } else {
        TimelineServerActionCreators.handleFetchTimelineSuccess(JSON.parse(resp.text).items, page || 1);
      }
    });
}

function fetchMemberTimeline(userID, page) {
  superagent
    .get('/api/v1/timeline')
    .set(retrieveAuthHeaders())
    .query({ user_id: userID, page: page })
    .end((err, resp) => {
      if (err) {
        MemberTimelineServerActionCreators.handleFetchMemberTimelineError(err, resp);
      } else {
        MemberTimelineServerActionCreators.handleFetchMemberTimelineSuccess(userID, JSON.parse(resp.text).items, page || 1);
      }
    });
}

module.exports = {
  fetchHomeTimeline,
  fetchMemberTimeline
};