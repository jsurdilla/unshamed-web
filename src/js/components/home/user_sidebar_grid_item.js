/** @jsx React.DOM */

var React = require('react');
var { Link } = require('react-router');

var UserSidebarGridItem = React.createClass({
  render() {
    return (
      <li>
        <Link to='member' params={{ userID: this.props.user.get('id') }}>
          <img src={ this.props.user.getIn(['profile_pictures', 'square50']) } />
        </Link>
      </li>
    )
  }
});

module.exports = UserSidebarGridItem;