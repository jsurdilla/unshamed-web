/** @jsx React.DOM */

var cn = require('classnames')
var { kebabCase } = require('lodash');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');
var UserSidebarGridItem = require('./userSidebarGridItem');

var UserSidebarGrid = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired, // array of users
    detailsLink: React.PropTypes.node // link to the details page
  },

  render() {
    var userSidebarGridItems = this.props.users.toArray().map((user) => {
      return <UserSidebarGridItem key={ 'm-'+user.get('id') } user={ user } />;
    });

    const className = { 'user-bar-grid': true, experts: this.props.experts, members: this.props.members };

    return (
      <section className={cn(className)}>
        <h3>{this.props.header}</h3>
        <ul className='clearfix'>
          {userSidebarGridItems}
        </ul>

        {this.props.detailsLink}
      </section>
    );
  }
});

module.exports = UserSidebarGrid;