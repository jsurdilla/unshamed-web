/** @jsx React.DOM */

var { pluck } = require('lodash');
var classnames = require('classnames');
var ConversationActionCreators = require('../../actions/ConversationActionCreators');
var ConversationListStore = require('../../stores/ConversationListStore');
var { partipantsDisplayText } = require('../../utils/DisplayUtils');
var React = require('react');
var Router = require('react-router');
var { Link } = Router;


var ConversationItem = React.createClass({

  propTypes: {
    active: React.PropTypes.bool
  },

  mixins: [Router.State],

  render() {
    var conversation = this.props.conversation;
    var listItemClasses = classnames({
      current: this.props.active,
      unread: !conversation.get('read'),
      read: conversation.get('read')
    });

    return (
      <li className={listItemClasses}>
        <Link to='conversation' params={{ conversationID: conversation.get('id') }} onClick={ this._handleClick }>
          <div className='participants'>{ partipantsDisplayText(conversation) }</div>
          <div className='last-message'>{ conversation.get('most_recent_message') }</div>
        </Link>
      </li>
    );
  },

  _handleClick() {
    ConversationActionCreators.clickConversation(this.props.conversation.get('id'));
  }
});

module.exports = ConversationItem;