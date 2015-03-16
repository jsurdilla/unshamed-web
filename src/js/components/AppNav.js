/** @jsx React.DOM */

var AuthUtils = require('../utils/AuthUtils');
var { Badge, Button, Navbar, DropdownButton, MenuItem, Nav } = require('react-bootstrap');
var CurrentUserStore = require('../stores/CurrentUserStore');
var FriendActionCreators = require('../actions/FriendActionCreators');
var FriendAPI = require('../api/FriendAPI');
var FriendRequestStore = require('../stores/FriendRequestStore');
var IncomingFriendRequestStore = require('../stores/IncomingFriendRequestStore');
var { hydrate } = require('../utils/StoreHydrationUtils');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var UserActionCreators = require('../actions/UserActionCreators');
var UserStore = require('../stores/UserStore');
var { map } = require('lodash');
var { Link, Navigation } = require('react-router');

function getDataFromStores() {
  return {
    friendRequests: IncomingFriendRequestStore.getAll(),
    user: CurrentUserStore.getCurrentUser()
  };
}

// This is necessary because the contents of what would simply be
// MenuItem is a bit complex and closing the DropdownButton would
// be impossible.
const FriendRequestMenuItem = React.createClass({
  render() {
    var friendRequest = this.props.friendRequest;

    return (
      <li className='friend-req' eventKey='1'>
        <img className='rounded' src={ friendRequest.getIn(['user', 'profile_pictures', 'square50']) } />
        
        <div className='actions'>
          <a onClick={ this._visitMemberPage } className='name'>
            { friendRequest.getIn(['user', 'full_name']) }
          </a>
          <a onClick={ this._accept }>Accept</a>
          <a onClick={ this._deny }>Deny</a>
        </div>
      </li>
    );
  },

  _visitMemberPage() {
    this.props.onSelect(this.props.friendRequest, 'visit');
  },

  _accept() {
    this.props.onSelect(this.props.friendRequest, 'confirm');
  },

  _deny() {
    this.props.onSelect(this.props.friendRequest, 'deny')
  }
});

var AppNav = React.createClass({

  mixins: [Navigation, PureRenderMixin],

  getInitialState() {
    return getDataFromStores();
  },

  componentDidMount() {
    IncomingFriendRequestStore.addChangeListener(this._handleDataChange);
    UserStore.addChangeListener(this._handleDataChange);
    FriendAPI.fetchFriendRequests();
  },

  render: function() {
    var pendingRequests = map(this._hydratedPendingFriendRequests().toArray(), ((friendRequest) => {
      return (
        <FriendRequestMenuItem onSelect={ this._handleFriendRequestMenutItemSelection } friendRequest={ friendRequest } />
      )
    }).bind(this));

    return (
    <Navbar staticTop inverse toggleNavKey={0} brand={
      <Link to='home' className='navbar-brand'><img src='/images/logo@2x.png' alt='' /></Link>
    }>
      <Nav right eventKey={0}>
        <DropdownButton eventKey={3} title={
          <span>
            <img src='/images/friend_request@2x.png' />
            { pendingRequests.length > 0 && <Badge className='friend-req-count'>{ pendingRequests.length }</Badge> }
          </span>
        } noCaret>
          { pendingRequests.length === 0 && <li className='no-friend-req text-center'>No pending friend requests</li> }
          { pendingRequests.length > 0 && pendingRequests }
        </DropdownButton>

        <DropdownButton eventKey={3} title={
          <span>
            <span className='name'>{ this.state.user.get('first_name') + ' ' + this.state.user.get('last_name') }</span>
            <img className='profile-pic' src={ this.state.user.getIn(['profile_pictures', 'square50']) }/> 
          </span>
        }>
          <MenuItem eventKey='1' onSelect={ this._myProfile }>Edit Profile</MenuItem>
          <MenuItem eventKey='2' onSelect={ this._logout }>Log out</MenuItem>
        </DropdownButton>
      </Nav>
    </Navbar>
    );
  },

  componentWillUnmount() {
    IncomingFriendRequestStore.removeChangeListener(this._handleDataChange);
    UserStore.removeChangeListener(this._handleDataChange);
  },

  _hydratedPendingFriendRequests() {
    return hydrate(FriendRequestStore, this.state.friendRequests).filter(fr => fr.get('state') === 'pending');
  },

  _handleDataChange() {
    this.setState(getDataFromStores());
  },

  _myProfile() {
    this.transitionTo('my_profile')
  },

  _logout() {
    UserActionCreators.logout();
    this.transitionTo('landing');
  },

  _handleFriendRequestMenutItemSelection(friendRequest, action) {
    if (action === 'visit') {
      this.transitionTo('member', { userID: friendRequest.getIn(['user', 'id']) });
    } else if (action === 'confirm') {
      FriendActionCreators.acceptFriendRequest(friendRequest);
    } else {
      FriendActionCreators.rejectFriendRequest(friendRequest);
    }
  }

});

module.exports = AppNav;