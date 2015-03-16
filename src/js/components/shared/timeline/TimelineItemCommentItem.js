/** @jsx React.DOM */

var CommentActionCreators = require('../../../actions/CommentActionCreators');
var DeleteConfirmationModal = require('../DeleteConfirmationModal');
var { Link } = require('react-router');
var { Map } = require('immutable');
var { ModalTrigger } = require('react-bootstrap');
var moment = require('moment');
var React = require('react');

var TimelineItemCommentItem = React.createClass({

  propTypes: {
    comment: React.PropTypes.instanceOf(Map)
  },

  render() {
    var comment = this.props.comment;

    return (
      <li className='clearfix comment'>
        <img src={ comment.getIn(['author', 'profile_pictures', 'square50']) } />
        <div className='name-time'>
          <Link to='member' params={{ userID: comment.getIn(['author', 'id']) }} className='name'>
            { comment.getIn(['author', 'full_name']) }
          </Link>
          <br />
          <span className='time'>{ moment(comment.get('updated_at')).fromNow() }</span>
        </div>
        <div className='comment-body'>{ comment.get('comment') } </div>
        <ModalTrigger modal={
          <DeleteConfirmationModal 
            prompt="Are you sure you want to delete this comment?"
            onDelete={ this._deleteComment } />
          }>
          <a className='delete'><img src='/images/close.png' /></a>
        </ModalTrigger>
      </li>
    );
  },

  _deleteComment() {
    CommentActionCreators.deleteComment(this.props.comment.toJS());
  }
});

module.exports = TimelineItemCommentItem;