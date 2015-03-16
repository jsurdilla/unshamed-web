/** @jsx React.DOM */

var { map } = require('lodash');
var CommentActionCreators = require('../../../actions/CommentActionCreators');
var CommentStore = require('../../../stores/CommentStore');
var CommentByStatusStore = require('../../../stores/CommentByStatusStore');
var { hydrate } = require('../../../utils/StoreHydrationUtils');
var { List } = require('immutable');
var React = require('react');
var TimelineItemCommentItem = require('./TimelineItemCommentItem');
var TimelineItemNewCommentItem = require('./timeline_item_new_comment_item');

var TimelineItemCommentItems = React.createClass({

  getInitialState() {
    return {
      comments: new List()
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.commentIDs !== nextProps.commentIDs) {
      var comments = hydrate(CommentStore, nextProps.commentIDs).sortBy(c => c.get('created_at'));
      this.setState({ comments });
    }
  },

  render() {
    var comments =  map(this.state.comments.toArray(), (comment) => {
      return <TimelineItemCommentItem key={ comment.get('cid') } comment={ comment } />
    });

    var remaining = CommentByStatusStore.getRemaining(this.props.item.get('type'), this.props.item.get('id'));

    return (
      <div className='actions clearfix'>
        { !!remaining && remaining > 0 &&
          <a className='view-more' onClick={ this._fetchMoreComments }>View { remaining > 20 ? 20 : remaining } more</a>
        }
        <ul className='comments'>
          { comments }
        </ul>
        <TimelineItemNewCommentItem item={ this.props.item } />
      </div>
    );
  },

  _fetchMoreComments() {
    CommentActionCreators.fetchMoreComments(this.state.comments.first().get('id'));
  }
});

module.exports = TimelineItemCommentItems;