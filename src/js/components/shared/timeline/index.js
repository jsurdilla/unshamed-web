/** @jsx React.DOM */

var cn = require('classnames');
var InfiniteScroll = require('../../shared/InfiniteScroll');
var { hydrateTypedEntityIDs } = require('../../../utils/StoreHydrationUtils');
var React = require('react');
var CommentAPI = require('../../../api/CommentAPI');
var CommentByStatusStore = require('../../../stores/CommentByStatusStore');
var CommentStore = require('../../../stores/CommentStore');
var ItemSupportSummaryStore = require('../../../stores/ItemSupportSummaryStore');
var { List } = require('immutable');
var SupportAPI = require('../../../api/SupportAPI');
var TimelineItem = require('./TimelineItem');

var Timeline = React.createClass({

  propTypes: {
    hasMore: React.PropTypes.func,
    isFetching: React.PropTypes.func,
    fetchTimeline: React.PropTypes.func
  },

  getInitialState() {
    return {
      timelineIDs: new List(),
      timeline: new List(),
      page: 1,
      hasMore: true
    };
  },

  componentDidMount() {
    CommentByStatusStore.addChangeListener(this._handleStateChange);
    ItemSupportSummaryStore.addChangeListener(this._handleStateChange);
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.timelineIDs !== nextProps.timelineIDs) {
      var timeline =  hydrateTypedEntityIDs(nextProps.timelineIDs);
      this.setState({
        timeline: timeline.sortBy(i => i.get('updated_at')).reverse()
      });
    }

    CommentAPI.fetchTimelineItemComments(timeline);
    SupportAPI.fetchItemSupportSummaries(timeline);
  },

  render() {
    var timelineItems = this.state.timeline.toArray().map((item) => {
      var commentIDs = CommentByStatusStore.getAll(item.toJS());
      return <TimelineItem key={ item.get('type') + item.get('cid') } item={ item } commentIDs={ commentIDs } />
    });

    var wrapperClasses = { items: true, 'fetching': this.state.isFetching }
    return (
      <div>
        <div className={ cn(wrapperClasses) }>
          <InfiniteScroll
            loadMore={ this._handleLoadMore }
            hasMore={ this.props.hasMore() }
            loader={<div className='loading-more'>Loading ...</div>}>
            { timelineItems }
          </InfiniteScroll>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    CommentByStatusStore.removeChangeListener(this._handleStateChange);
    ItemSupportSummaryStore.removeChangeListener(this._handleStateChange);
  },

  _handleLoadMore() {
    if (this.props.isFetching()) {
      return;
    }
    this.props.fetchTimeline();
  },

  _handleStateChange() {
    this.forceUpdate();
  }
});

module.exports = Timeline;