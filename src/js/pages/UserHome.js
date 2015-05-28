/** @jsx React.DOM */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AuthFilterMixin = require('../utils/AuthFilterMixin');
var { Badge, Button, Navbar, DropdownButton, MenuItem, Nav } = require('react-bootstrap');
var ConversationActionCreators = require('../actions/ConversationActionCreators');
var ConversationStore = require('../stores/ConversationStore');
var CurrentUserStore = require('../stores/CurrentUserStore');
var FriendsSidebarSection = require('../components/home/FriendsSidebarSection');
var FriendAPI = require('../api/FriendAPI');
var FriendStore = require('../stores/FriendStore');
var { hydrate, hydrateTypedEntityIDs } = require('../utils/StoreHydrationUtils');
var MemberStore = require('../stores/MemberStore');
var MHPStore = require('../stores/MHPStore');
var Nav = require('../components/AppNav');
var NewStatusUpdate = require('../components/home/new_status_update');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var ResourceAPI = require('../api/ResourceAPI');
var ResourcesSidebarSection = require('../components/home/ResourcesSidebarSection');
var { Link } = require('react-router');
var UserAPI = require('../api/UserAPI');
var UserSidebarGrid = require('../components/home/UserSidebarGrid');
var UserStore = require('../stores/UserStore');
var Timeline = require('../components/shared/timeline/Index');
var TimelineActionCreators = require('../actions/TimelineActionCreators');
var TimelineAPI = require('../api/TimelineAPI');
var HomeTimelineStore = require('../stores/HomeTimelineStore');
var ActionTypes = require('../constants/ActionTypes');
var PayloadSources = require('../constants/PayloadSources');

function getStateFromStores() {
  var userID = CurrentUserStore.getCurrentUser();

  return {
    members: hydrate(UserStore, MemberStore.getAll()),
    mhps: hydrate(UserStore, MHPStore.getAll()),
    friends: hydrate(UserStore, FriendStore.get(CurrentUserStore.getCurrentUser().get('id'))),
    timelineIDs: HomeTimelineStore.getAll()
  }
};

var UserHome = React.createClass({

  mixins: [AuthFilterMixin, PureRenderMixin],

  getInitialState() {
    return getStateFromStores();
  },

  componentDidMount() {
    ConversationStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    FriendStore.addChangeListener(this._onChange);
    HomeTimelineStore.addChangeListener(this._onChange);

    ResourceAPI.fetchResources();
    UserAPI.fetchRecentMHPs();
    UserAPI.fetchRecentMembers();
    FriendAPI.fetchFriends(CurrentUserStore.getCurrentUser().get('id'));
    TimelineAPI.fetchHomeTimeline();

    ConversationActionCreators.fetchConversations();
  },

  render() {
    console.log('UserHome#render');
    return (
      <div>
        <Nav />
        <div id='home-timeline' className="container">
          <div className='content-area'>

            <div className='left-rail'>
              {this.state.friends && <FriendsSidebarSection friends={ this.state.friends } />}
              <ResourcesSidebarSection />
            </div>
            
            <div className='timeline'>
              <img className='hero' src='/images/community.jpg' />
              <NewStatusUpdate />
              {this.state.timelineIDs &&
                <Timeline 
                  timelineIDs={this.state.timelineIDs}
                  hasMore={HomeTimelineStore.hasMore}
                  isFetching={HomeTimelineStore.isFetching}
                  fetchTimeline={this._fetchTimeline} />
              }
            </div>

            <div className='right-rail'>
              <Link to='conversations' className='wire-btn'><img src='/images/speech-bubble@2x.png' />
                Messages 
                <Badge className='unread-message-count' bsStyle='primary'>{ConversationStore.getUnreadMessageCount()}</Badge>
              </Link>
              <Link to='new_journal_entry' className='wire-btn'><img src='/images/journal@2x.png' />Journal</Link>

              {this.state.members && 
                <UserSidebarGrid users={this.state.members} header='Members' members={true} detailsLink={<Link to='members'>Show All</Link>} />
              }

              {this.state.mhps &&
                <UserSidebarGrid users={this.state.mhps} header='Experts' experts={true} detailsLink={<Link to='mhps'>Show All</Link>} />
              }
            </div>

          </div>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    ConversationStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    FriendStore.removeChangeListener(this._onChange);
    HomeTimelineStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(getStateFromStores());
  },

  _fetchTimeline() {
    TimelineActionCreators.fetchHomeTimeline(HomeTimelineStore.getCurrentPage() + 1);
  }
});

module.exports = UserHome;