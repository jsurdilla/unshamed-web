/** @jsx React.DOM */

var AuthUtils = require('../../utils/AuthUtils');
var { assign } = require('lodash');
var { Button } = require('react-bootstrap');
var FriendActionCreators = require('../../actions/FriendActionCreators');
var FriendAPI = require('../../api/FriendAPI');
var FriendStore = require('../../stores/FriendStore');
var FriendRequestStore = require('../../stores/FriendRequestStore');
var { hydrate } = require('../../utils/StoreHydrationUtils');
var IncomingFriendRequestStore = require('../../stores/IncomingFriendRequestStore');
var { hydrate }  = require('../../utils/StoreHydrationUtils');
var MHPStore = require('../../stores/MHPStore');
var OutgoingFriendRequestStore = require('../../stores/OutgoingFriendRequestStore');
var React = require('react');
var UserAPI = require('../../api/UserAPI'); 
var UserSidebarGrid = require('../../components/home/user_sidebar_grid');
var UserStore = require('../../stores/UserStore');
var { State } = require('react-router');

function getStateFromStores() {
  return {
    mhps: MHPStore.getAll()
  }
}

const MHP = React.createClass({
  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    MHPStore.addChangeListener(this._onStateChange);

    UserAPI.fetchRecentMHPs();
  },

  render() {
    const u = this.props.user;
    const p = u.get('mhp_profile');

    var otherMhps = hydrate(UserStore, this.state.mhps.filterNot(m => m === u.get('id')));

    return (
      <div id='mhp-profile'>
        <div className='basic-info'>
          <div className='profile-pic'>
            <img src={ u.getIn(['profile_pictures', 'medium']) }/> 
          </div>
          <div className='background'>
            <h2>{ u.get('full_name') }</h2>
            <div><label>Qualification</label> { p.get('qualification') }</div>
            <div><label>Education</label> { p.get('education') }</div>
          </div>
        </div>
        <div className='details'>
          <div className='about-me' dangerouslySetInnerHTML={{ __html: p.get('about_me') }} />
          <div className='other-mhps right-rail'>
            { this.state.mhps && <UserSidebarGrid users={ otherMhps } header='Other Experts' experts={true} /> }
          </div>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    MHPStore.removeChangeListener(this._onStateChange);
  },

  _onStateChange() {
    this.setState(getStateFromStores());
  }
});

module.exports = MHP;