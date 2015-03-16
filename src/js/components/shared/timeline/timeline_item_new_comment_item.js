/** @jsx React.DOM */

var CommentAPI = require('../../../api/CommentAPI');
var CommentStore = require('../../../stores/CommentStore');
var CurrentUserStore = require('../../../stores/CurrentUserStore');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');

var TimelineItemNewCommentItem = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var user = CurrentUserStore.getCurrentUser();
    return (
      <div className='new-comment'>
        <div className='pic'>
          <img src={ user.getIn(['profile_pictures', 'square50']) } />
        </div>

        <div className='comment-box'>
          <textarea
            ref='commentBody'
            placeholder='Write a comment...'
            onKeyDown={ this._handleKeyDown }></textarea>
        </div>
      </div>
    );
  },

  _handleKeyDown(event) {
    if (event.which === 13) {
      event.preventDefault();
      var commentBody = this.refs.commentBody.getDOMNode();
      if (commentBody.value.trim().length) {
        CommentAPI.postComment({
          body: commentBody.value.trim(),
          commentableID: this.props.item.get('id'),
          commentableType: this.props.item.get('type')
        });
        commentBody.value = '';
      }
    }
  }
});

module.exports = TimelineItemNewCommentItem;