/** @jsx React.DOM */

var CurrentUserStore = require('../../../stores/CurrentUserStore');
var DeleteConfirmationModal = require('../DeleteConfirmationModal');
var { Link } = require('react-router');
var { ModalTrigger } = require('react-bootstrap');
var moment = require('moment');
var PostActionCreators = require('../../../actions/PostActionCreators');
var React = require('react');

var TimelineItemHeader = React.createClass({
  render() {
    var item = this.props.item.toJS();

    return (
      <div className='header'>
        <Link to='member' params={{ userID: item.author.id }} className='author-pic'>
          <img src={ item.author.profile_pictures.square50 } />
        </Link>
        <div>
          <Link to='member' params={{ userID: item.author.id }} className='name'>
            { item.author.full_name }
          </Link>
          <div className='time'>{ moment(item.updated_at).fromNow() }</div>
        </div>

        { (CurrentUserStore.getCurrentUser().get('id') === item.author.id && item.type === 'Post') &&
          <ModalTrigger modal={
            <DeleteConfirmationModal 
              prompt="Are you sure you want to delete this post?"
              onDelete={ this._deletePost } />
            }>
            <a className='delete'><img src='/images/close.png' /></a>
          </ModalTrigger>
        }
      </div>
    );
  },

  _deletePost() {
    PostActionCreators.deletePost(this.props.item.toJS());
  }
})

module.exports = TimelineItemHeader;