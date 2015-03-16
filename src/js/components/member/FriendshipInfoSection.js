/** @jsx React.DOM */

var { assign } = require('lodash');
var { Button } = require('react-bootstrap');
var CurrentUserStore = require('../../stores/CurrentUserStore');
var FriendActionCreators = require('../../actions/FriendActionCreators');
var FriendAPI = require('../../api/FriendAPI');
var FriendStore = require('../../stores/FriendStore');
var FriendRequestStore = require('../../stores/FriendRequestStore');
var IncomingFriendRequestStore = require('../../stores/IncomingFriendRequestStore');
var { hydrate }  = require('../../utils/StoreHydrationUtils');
var OutgoingFriendRequestStore = require('../../stores/OutgoingFriendRequestStore');
var React = require('react');
var { Navigation, State } = require('react-router');

const FriendshipInfoSection = React.createClass({

  mixins: [Navigation, State],

  componentDidMount() {
    IncomingFriendRequestStore.addChangeListener(this._handleDataChange);
    OutgoingFriendRequestStore.addChangeListener(this._handleDataChange);
    FriendStore.addChangeListener(this._handleDataChange);

    FriendAPI.fetchFriends(CurrentUserStore.getCurrentUser().get('id'));
  },

  render() {
    var buttons = <span />;
    if (this._isFriendsWith()) {
      buttons = <div className='friend-req'>
        <Button className='wire-btn' onClick={ this._startConversation }>Message</Button>
        <Button className='wire-btn' onClick={ this._unfriend }>Unfriend</Button>
      </div>;
    } else {
      if (this._outgoingRequest()) {
        buttons = <div className='friend-req'>
          <div>Friend Request Sent</div>
          <Button className='wire-btn' onClick={ this._cancelFriendRequest }>Cancel Request</Button>
        </div>;
      } else if (this._incomingRequest()) {
        buttons = <div className='friend-req'>
          <Button className='wire-btn' onClick={ this._acceptFriendRequest }>Accept</Button>
          <Button className='wire-btn' onClick={ this._rejectFriendRequest }>Deny</Button>
        </div>;
      } else if (CurrentUserStore.getCurrentUser().get('id') !== parseInt(this.getParams().userID)) {
        buttons = <div className='friend-req'>
         <Button className='wire-btn' onClick={ this._sendFriendRequest }>Send Friend Request</Button>
        </div>;
      }
    }
    return buttons;
  },

  componentWillUnmount() {
    IncomingFriendRequestStore.removeChangeListener(this._handleDataChange);
    OutgoingFriendRequestStore.removeChangeListener(this._handleDataChange);
    FriendStore.removeChangeListener(this._handleDataChange);
  },

  _isFriendsWith() {
    const friends = FriendStore.get(CurrentUserStore.getCurrentUser().get('id')); 
    return friends && friends.has(parseInt(this.getParams().userID));
  },

  _incomingRequest() {
    const friendReqs = hydrate(FriendRequestStore, IncomingFriendRequestStore.getAll())
    return friendReqs.find(x => x.getIn(['user', 'id']) === parseInt(this.getParams().userID) &&  x.get('state') === 'pending');
  },

  _outgoingRequest() {
    const friendReqs = hydrate(FriendRequestStore, OutgoingFriendRequestStore.getAll())
    return friendReqs.find(x => x.getIn(['receiver', 'id']) === parseInt(this.getParams().userID) && x.get('state') === 'pending');
  },

  _startConversation() {
    this.transitionTo('new_conversation', {}, { with: this.getParams().userID });
  },

  _sendFriendRequest() {
    FriendActionCreators.sendFriendRequest(this.getParams().userID);
  },

  _cancelFriendRequest() {
    FriendActionCreators.cancelFriendRequest(this._outgoingRequest());
  },

  _acceptFriendRequest() {
    FriendActionCreators.acceptFriendRequest(this._incomingRequest());
  },

  _rejectFriendRequest() {
    FriendActionCreators.rejectFriendRequest(this._incomingRequest());
  },

  _unfriend() {
    FriendActionCreators.unfriend(CurrentUserStore.getCurrentUser().get('id'), this.getParams().userID);
  },

  _handleDataChange() {
    this.forceUpdate();
  }
});

module.exports = FriendshipInfoSection;