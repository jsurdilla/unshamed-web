/** @jsx React.DOM */

var { map } = require('lodash');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var { Link } = require('react-router');

var FriendsSidebarSection = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    friends: React.PropTypes.objectOf(List)
  },

  render() {
    var friends = map(this.props.friends.toArray(), (friend) => {
      return (
        <li key={ friend.get('cid') }>
          <img className='rounded' src={ friend.getIn(['profile_pictures', 'square50']) } />
          <Link to='member' params={{ userID: friend.get('id') }}>
            { friend.get('full_name') }
          </Link>
        </li>
      );
    });

    return (
      <section className='friends wire-section'>
        <h3>Connections</h3>
        <div className='content'>
          <ol className="list-unstyled">
            { friends }

            { !friends.length &&
              <li>You have no connections yet. Why not say hello to someone?</li>
            }
          </ol>
        </div>
      </section>
    );
  }
});

module.exports = FriendsSidebarSection;