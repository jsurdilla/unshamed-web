/** @jsx React.DOM */

var moment = require('moment');
var React = require('react');

var ConversationSectionMessage = React.createClass({
  render: function() {
    console.log('ConversationSectionMessage#render()');

    var message = this.props.message;
    return (
      <div className='clearfix msg'>
        <div className='time'>{ moment(message.sentAt).format('LT') }</div>
        <div className='body'>{ message.body }</div>
      </div>
    );
  }
});

module.exports = ConversationSectionMessage;