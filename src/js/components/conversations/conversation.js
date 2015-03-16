/** @jsx React.DOM */

var AuthFilterMixin = require('../../utils/AuthFilterMixin');
var ConversationActionCreators = require('../../actions/ConversationActionCreators');
var ConversationListStore = require('../../stores/ConversationListStore');
var ConversationMessagesStore = require('../../stores/ConversationMessagesStore');
var ConversationReply = require('./ConversationReply');
var ConversationSection = require('./ConversationSection');
var ConversationThread = require('./ConversationThread');
var ConversationStore = require('../../stores/ConversationStore');
var { hydrate } = require('../../utils/StoreHydrationUtils');
var { partipantsDisplayText } = require('../../utils/DisplayUtils');
var { assign, map, throttle } = require('lodash');
var MessageActionCreators = require('../../actions/MessageActionCreators');
var MessageAPI = require('../../api/MessageAPI');
var MessageStore = require('../../stores/MessageStore');
var moment = require('moment');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var ReverseInfiniteScroll = require('./reverse_infinite_scroll');
var { State, Navigation } = require('react-router');

function getStateFromStores(conversationID) {
  return {
    messageIDs: ConversationMessagesStore.get(conversationID),
    hasMore: ConversationMessagesStore.hasMore()
  }
}

var Conversation = React.createClass({

  mixins: [AuthFilterMixin, State, Navigation, PureRenderMixin],

  _currentConversationDisplay: null,

  getInitialState() {
    return assign(getStateFromStores(this.getParams().conversationID), {
      conversationID: this.getParams().conversationID
    });
  },

  componentDidMount() {
    ConversationMessagesStore.addChangeListener(this._onDataChange);

    // Get initial set of messages
    MessageAPI.fetchMessages(this.getParams().conversationID);
  },

  // Called by Router when we switch between conversations, even to the same conversation (e.g., clicking
  // on the same link).
  componentWillReceiveProps(nextProps) {
    console.log('Conversation#componentWillReceiveProps', nextProps);

    if (this.state.conversationID !== this.getParams().conversationID) { // switching to a *different* conversation
      this.setState({ conversationID: this.getParams().conversationID, hasMore: true });
      MessageAPI.fetchMessages(this.getParams().conversationID);
    } else {
      this.setState(assign(getStateFromStores(this.getParams().conversationID), {
        hasMore: ConversationMessagesStore.hasMore()
      }));
    }
  },

  render() {
    console.log('Conversation#render');
    let sections;
    let messages;

    if (this.state.messageIDs) {
      messages = hydrate(MessageStore, this.state.messageIDs).sortBy(m => m.get('created_at'));
      this._earliestMessage = messages.first();
      this._currentConversationDisplay = new ConversationThread(messages.toJS());
      sections = map(this._currentConversationDisplay.sections, (section) => <ConversationSection section={ section } />);
    }

    return (
      <div>
        <header>
          <h3>{ partipantsDisplayText(ConversationStore.get(parseInt(this.getParams().conversationID))) }</h3>
        </header>

        <ReverseInfiniteScroll
          loadMore={ throttle(this._loadMessages, 2000) }
          hasMore={ this.state.hasMore }
          threshold={ 20 }
          measurableClass='messages'
          loader={ <div className='loader'>Loading ...</div> }>
          <div className='messages' ref='sectionsContainer'>
            <ul>{ sections }</ul>
          </div>
        </ReverseInfiniteScroll>

        <ConversationReply lastReply={ ConversationStore.lastReplySent() } onSubmit={ this._sendReply } />
      </div>
    );
  },

  componentDidUpdate() {
    this._scrollToBottom();
  },

  componentWillUnmount() {
    ConversationMessagesStore.removeChangeListener(this._onDataChange);
  },

  _scrollToBottom: function() {
    var sectionsContainer = this.refs.sectionsContainer.getDOMNode();
    if (this.state.previousScrollTop) {
      sectionsContainer.scrollTop = sectionsContainer.scrollHeight - this.state.previousScrollTop;
    } else {
      sectionsContainer.scrollTop = sectionsContainer.scrollHeight;
    }
  },

  _loadMessages() {
    if (ConversationMessagesStore.isFetching()) {
      return;
    }

    if (this.state.messageIDs) {
      var sectionsContainer = this.refs.sectionsContainer.getDOMNode();
      this.state.previousScrollTop = sectionsContainer.scrollHeight - sectionsContainer.scrollTop;
      MessageActionCreators.fetchMessages(this.getParams().conversationID, this._earliestMessage && this._earliestMessage.get('id'));
    }
  },

  _sendReply(reply) {
    ConversationActionCreators.replyToConversation(this.getParams().conversationID, reply);
  },

  _onDataChange() {
    this.setState(getStateFromStores(this.getParams().conversationID));
  }
});

module.exports = Conversation;