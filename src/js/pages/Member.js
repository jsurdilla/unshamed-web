/** @jsx React.DOM */

var { assign, debounce, map } = require ('lodash');
var AuthFilterMixin = require('../utils/AuthFilterMixin');
var AuthUtils = require('../utils/AuthUtils');
var cn = require('classnames');
var FriendshipInfoSection = require('../components/member/FriendshipInfoSection');
var FriendsSidebarSection = require('../components/home/FriendsSidebarSection');
var MemberTimelineActionCreators = require('../actions/MemberTimelineActionCreators');
var MemberTimelineStore = require('../stores/MemberTimelineStore');
var MHP = require('../components/member/MHP');
var Nav = require('../components/AppNav');
var React = require('react');
var { State } = require('react-router');
var Timeline = require('../components/shared/timeline/Index');
var UserActionCreators = require('../actions/UserActionCreators');
var UserStore = require('../stores/UserStore');

function getStateFromStores(userID) {
  return {
    user: UserStore.get(userID),
    timelineIDs: MemberTimelineStore.getAll()
  }
}

var Member = React.createClass({

  mixins: [AuthFilterMixin, State],

  getInitialState() {
    var userID = this.getParams().userID;
    return assign({ userID, ready: false }, getStateFromStores(userID));
  },

  componentDidMount() {
    console.log('Member#componentDidMount');
    UserStore.addChangeListener(this._handleStoreStateChange);
    MemberTimelineStore.addChangeListener(this._handleStoreStateChange);

    UserActionCreators.fetchUser(this.getParams().userID);
    MemberTimelineActionCreators.fetchMemberTimeline(this.state.userID, 1, true);
  },

  componentWillReceiveProps(nextProps) {
    console.log('Member#componentWillReceiveProps');
    this.state.userID = this.getParams().userID;
    this.state.timelineIDs = undefined

    UserActionCreators.fetchUser(this.getParams().userID);
    MemberTimelineActionCreators.fetchMemberTimeline(this.state.userID, 1, true);
  },

  render: function() {
    var user = this.state.user;
    if (!user) {
      return <div />
    }

    if (user.get('is_mhp')) {
      return <div>
        <Nav />
        <div id='member-details' className='container'>
          <div className='row'>
            <MHP user={ user } />
          </div>
        </div>
      </div>;
    }

    return(
      <div>
        <Nav />
        <div id='member-details' className='container'>
          <div className='row'>

            <div className="left-rail">
              <div className='user-pic'>
                <img src={ this.state.user.getIn(['profile_pictures', 'medium']) } />
              </div>

              <FriendshipInfoSection user={ user } />

              <section className='user-info wire-section'>
                <h3>User Info</h3>
                <div className='content'>
                  <div className='name'>
                    <label>Name</label>
                    <div className='body'>{ this.state.user.get('full_name') }</div>
                  </div>
                  <div className='about-me'>
                    <label>About Me</label>
                    <div className='body'>{ this.state.user.get('about_me') }</div>
                  </div>
                  <div>
                    <label>Struggles</label>
                    <ul className='body'>
                      { map(this.state.user.get('struggles').toJS(), s => <li>{ s }</li>) }
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            <div className='timeline'>
              <div className={{ hidden: !this.state.ready }}>
                { (!MemberTimelineStore.isFetching() && this.state.timelineIDs && this.state.timelineIDs.size === 0) &&
                  <section>
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/CJmg5kyPWxg" frameborder="0" allowfullscreen></iframe>
                    <h4>Community Guidelines</h4>
                    <ul>
                      <li>
                        UnShamed is NOT a therapeutic or medical entity and does not take the place of
                        professional help. If you feel you are in need of professional help, please contact a 
                        medical professional in your area. UnShamed experts are here to give support and 
                        insight, NOT therapy or medical advice.
                      </li>
                      <li>
                        In the event of an emergency please call 911 or go to your nearest Emergency Room.
                      </li>
                      <li>
                        If you are experiencing suicidal thoughts, please call the National Suicide Prevention
                        Lifeline at 800-273-8255. They are available 24/7.
                      </li>
                      <li>
                        Any sort of bullying or discrimination will not be tolerated and will be ground for being
                        blocked from UnShamed.
                      </li>
                      <li>
                        If you feel a post will trigger other members, please type “TRIGGER WARNING” on top of
                        your post.
                      </li>
                      <li>
                        Any sort of advertisement post must be approved by UnShamed.
                      </li>
                      <li>
                        Do not give personal information (phone numbers, emails, etc) to anyone of the site you
                        do not know personally. Do not ask for someone’s personal information unless they 
                        voluntarily offer it.
                      </li>
                      <li>
                        You must be over 18 years of age to be an UnShamed member.
                      </li>
                    </ul>
                  </section>
                }

                { this.state.timelineIDs &&
                  <Timeline 
                    timelineIDs={ this.state.timelineIDs }
                    hasMore={ MemberTimelineStore.hasMore }
                    isFetching={ MemberTimelineStore.isFetching }
                    fetchTimeline={ this._fetchTimeline } />
                }
              </div>
            </div>

            <div className='right-rail'>
              <FriendsSidebarSection friends={ this.state.user.get('friends') } />
            </div>
          </div>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._handleStoreStateChange);
    MemberTimelineStore.removeChangeListener(this._handleStoreStateChange);
  },

  _handleStoreStateChange() {
    this.setState(getStateFromStores(this.state.userID));
  },

  _fetchTimeline() {
    MemberTimelineActionCreators.fetchMemberTimeline(this.getParams().userID, MemberTimelineStore.getCurrentPage() + 1)
  }
});

module.exports = Member;