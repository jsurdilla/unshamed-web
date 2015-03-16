/** @jsx React.DOM */

var { snakeCase} = require('lodash');
var { List, Map, OrderedSet } = require('immutable');
var React = require('react');
var ItemSupportSummaryStore = require('../../../stores/ItemSupportSummaryStore');
var TimelineItemCommentItems = require('./timeline_item_comment_items');
var TimelineItemBody = require('./timeline_item_body');
var TimelineItemHeader = require('./TimelineItemHeader');
var TimelineItemPropsCount = require('./TimelineItemPropsCount');

var TimelineItem = React.createClass({

  propTypes: {
    commentIDs: React.PropTypes.instanceOf(OrderedSet)
  },

  render() {
    var item = this.props.item;
    var supportSummary = ItemSupportSummaryStore.get(item.get('type'), item.get('id'));

    return (
      <div className={ snakeCase(item.get('type')) }>
        <TimelineItemHeader item={ item } />
        <TimelineItemBody item={ item } supportSummary={ supportSummary } />
        <TimelineItemPropsCount item={ item } supportSummary={ supportSummary } />
        <TimelineItemCommentItems item={ item } commentIDs={ this.props.commentIDs } />
      </div>
    );
  }
});

module.exports = TimelineItem;