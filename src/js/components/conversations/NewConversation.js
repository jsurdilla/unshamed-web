/** @jsx React.DOM */

var { assign, pluck, remove } = require('lodash');
var CurrentUserStore = require('../../stores/CurrentUserStore');
var ConversationActionCreators = require('../../actions/ConversationActionCreators');
var ConversationListStore = require('../../stores/ConversationListStore');
var ConversationReply = require('./ConversationReply');
var FriendAPI = require('../../api/FriendAPI');
var FriendStore = require('../../stores/FriendStore');
var { hydrate } = require('../../utils/StoreHydrationUtils');
var Tokenizer = require('react-typeahead').Tokenizer;
var UserStore = require('../../stores/UserStore');
var React = require('react');
var { Navigation, State } = require('react-router');

function getStateFromStores() {
  return {
    friendIDs: FriendStore.get(CurrentUserStore.getCurrentUser().get('id'))
  }
}

const NewConversation = React.createClass({

  mixins: [Navigation, State],

  getInitialState() {
    return assign(getStateFromStores(), { isPosting: false, recipients: [] });
  },

  componentWillMount() {
    console.log('NewConversation#componentWillMount');
    FriendStore.addChangeListener(this._onDataChange);

    FriendAPI.fetchFriends(CurrentUserStore.getCurrentUser().get('id'));
    this.setState({ isPosting: false, recipients: [] });
  },

  componentWillReceiveProps(nextProps) {
    console.log('NewConversation#componentWillReceiveProps', nextProps);
    if (this.state.isPosting && !ConversationListStore.isPosting()) {
      this.transitionTo('conversation', { conversationID: ConversationListStore.getAll().last() });
    }
  },

  render() {
    console.log('NewConversation#render');
    if (!this.state.friendIDs || this.state.friendIDs.size === 0) {
      return <div className='new-conversation' />;
    }

    var selectableIDs = this.state.friendIDs.filterNot(x => pluck(this.state.recipients, 'id').indexOf(x) >= 0);
    var friends = hydrate(UserStore, selectableIDs).toJS();

    if (this.getQuery().with) {
      this.state.recipients = remove(friends, (friend) => friend.id === parseInt(this.getQuery().with));
    }

    return (
      <div className='new-conversation'>
      <div className='recipients'>
          <label>To</label>
          <Tokenizer options={ friends }
              defaultSelected={ this.state.recipients }
              textExtractor={ (friend) => friend.first_name + ' ' + friend.last_name }
              onTokenAdd={ this._handleTokenChange }
              onTokenRemove={ this._handleTokenChange } />
      </div>
      <ConversationReply onSubmit={ this._sendMessage } areOthersValid={ this._isValid } />
    </div>
    );
  },

  componentWillUnmount() {
    FriendStore.removeChangeListener(this._onDataChange);
  },

  _onDataChange() {
    this.setState(getStateFromStores());
  },

  _handleTokenChange(recipients) {
    this.setState({ recipients: recipients });
  },

  _sendMessage(message) {
    if (!this._isValid) {
      return;
    }
    this.setState({ isPosting: true });
    ConversationActionCreators.startConversation(this.state.recipients.map(r => r.id), message);
  },

  _isValid() {
    return this.state.recipients.length > 0;
  }
});

module.exports = NewConversation;