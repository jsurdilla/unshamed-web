'use strict';

const { assign } = require('lodash');
const ActionTypes = require('../constants/ActionTypes');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const ChangeAwareMixin = require('./ChangeAwareMixin');
const { createStore } = require('../utils/StoreUtils');
const HomeTimelineStore = require('./HomeTimelineStore');
const { Map } = require('immutable');

let _summaries = Map();

const ItemSupportSummary = assign({
  increment(itemType, itemID, delta, updateSupporterFlag) {
    const count = _summaries.getIn([itemType, '' + itemID, 'count']) || 0;
    _summaries = _summaries.setIn([itemType, '' + itemID, 'count'], count + delta);

    if (updateSupporterFlag) {
      _summaries = _summaries.setIn([itemType, '' + itemID, 'is_supporter'], delta > 0);
    }
  },

  getAll() {
    return _summaries;
  },

  get(itemType, itemID) {
    return _summaries.getIn([itemType, '' + itemID]);
  }
}, ChangeAwareMixin);

ItemSupportSummary.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([HomeTimelineStore.dispatchToken]);

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { type, support_summaries, item, result, message } = payload;

  switch (type) {
    case ActionTypes.LOGOUT: 
      _summaries = Map();
      break;

    case ActionTypes.FETCH_ITEM_SUPPORT_SUMMARIES_SUCCESS:
      _summaries = _summaries.mergeDeep(support_summaries);
      ItemSupportSummary.emitChange();
      break;

    case ActionTypes.TOGGLE_ITEM_SUPPORT_SUCCESS:
      ItemSupportSummary.increment(item.get('type'), item.get('id'), result === 'created' ? 1 : -1, true);
      ItemSupportSummary.emitChange();
      break;

    case ActionTypes.SUPPORT_COUNT_CHANGE_PUSH_MSG:
      ItemSupportSummary.increment(message.supportable_type, message.supportable_id, message.increment);
      ItemSupportSummary.emitChange();
      break;
  }
});

module.exports = ItemSupportSummary;