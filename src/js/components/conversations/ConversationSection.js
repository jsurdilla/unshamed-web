/** @jsx React.DOM */

var _ = require('lodash');
var ConversationSectionMessage = require('./ConversationSectionMessage');
var moment = require('moment');
var React = require('react');

var ConversationSection = React.createClass({
  render() {
    console.log('ConversationSection#render()');
    var section = this.props.section;
    var messages = section.messages.map(function(message) {
      return (
        <ConversationSectionMessage message={ message } key={ message.id } />
      );
    });

    return (
      <li className='clearfix section'>
        <h4>{ moment(section.timestamp).format('MMM D') }</h4>

        <div className='profile-pic'>
          <img src={ section.messages[0].sender.profile_pictures.square50 } />
        </div>

        <div className='msgs'>
         { messages }
        </div>
      </li>
    );
  }
});

module.exports = ConversationSection;