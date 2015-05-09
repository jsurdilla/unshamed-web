/** @jsx React.DOM */

const { fullNameOrUsername } = require('../../utils/record_utils/UserUtils');
var { map } = require('lodash');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var { Link } = require('react-router');

/**
 * Sidebar widget that is meant to display a person's list of friends.
 */
var FriendsSidebarSection = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    friends: React.PropTypes.objectOf(List)
  },

  render() {
    return (
      <section className='friends wire-section'>
        <h3>Connections</h3>
        <div className='content'>
          <ol className="list-unstyled">
            {this.friends()}
            {!this.props.friends.size && <li>You have no connections yet. Why not say hello to someone?</li>}
          </ol>
        </div>
      </section>
    );
  },

  friends() {
    return map(this.props.friends.toArray(), (friend) => {
      return (
        <li key={friend.get('cid')}>
          <img className='rounded' src={friend.getIn(['profile_pictures','square50'])} />
          <Link to='member' params={{userID: friend.get('id')}}>{fullNameOrUsername(friend)}</Link>
        </li>
      );
    });
  }
});

module.exports = FriendsSidebarSection;