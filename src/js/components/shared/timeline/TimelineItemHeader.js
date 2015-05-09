/** @jsx React.DOM */

var CurrentUserStore = require('../../../stores/CurrentUserStore');
var DeleteConfirmationModal = require('../DeleteConfirmationModal');
var { fullNameOrUsername } = require('../../../utils/record_utils/UserUtils');
var { Link } = require('react-router');
var { ModalTrigger } = require('react-bootstrap');
var moment = require('moment');
var PostActionCreators = require('../../../actions/PostActionCreators');
var React = require('react');

var TimelineItemHeader = React.createClass({
  render() {
    var item = this.props.item.toJS();
    var author = this.props.item.get('author');

    return (
      <div className='header'>
        <Link to='member' params={{userID: author.get('id')}} className='author-pic'>
          <img src={author.getIn(['profile_pictures', 'square50'])} />
        </Link>
        <div>
          <Link to='member' params={{userID: author.get('id')}} className='name'>{fullNameOrUsername(author)}</Link>
          <div className='time'>{moment(item.updated_at).fromNow()}</div>
        </div>

        {(CurrentUserStore.getCurrentUser().get('id') === author.get('id') && item.type === 'Post') &&
          <ModalTrigger modal={
            <DeleteConfirmationModal 
              prompt="Are you sure you want to delete this post?"
              onDelete={this._deletePost} />
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