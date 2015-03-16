'use strict';

var { assign } = require('lodash');
var PusherUtils = require("../utils/PusherUtils");
var SupportServerActionCreators = require('../actions/SupportServerActionCreators');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var superagent = require('superagent');

function toggleItemSupport(item) {
  superagent
    .post('/api/v1/supports/toggle')
    .send({ supportable_type: item.get('type'), supportable_id: item.get('id') })
    .set(retrieveAuthHeaders())
    .set('socket_id', PusherUtils.getSocketID())
    .end((err, resp) => {
      if (err) {
        SupportServerActionCreators.handleToggleItemSupportError(err, resp);
      } else {
        SupportServerActionCreators.handleToggleItemSupportSuccess(item, JSON.parse(resp.text).result);
      }
    })
}

function fetchItemSupportSummaries(timelineItems) {
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
    journal_entry_ids: itemIds.JournalEntry.join(',')
  };

  superagent
    .get('/api/v1/supports/item_summaries')
    .query(params)
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        SupportServerActionCreators.handleFetchItemSupportSummariesError(err, resp);
      } else {
        SupportServerActionCreators.handleFetchItemSupportSummariesSuccess(JSON.parse(resp.text).support_summaries);
      }
    })
}

module.exports = {
  toggleItemSupport,
  fetchItemSupportSummaries
};