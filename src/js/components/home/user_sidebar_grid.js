/** @jsx React.DOM */

var cn = require('classnames')
var { kebabCase } = require('lodash');
var UserSidebarGridItem = require('./user_sidebar_grid_item');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');

var UserSidebarGrid = React.createClass({

  mixins: [PureRenderMixin],

  render() {
    var userSidebarGridItems = this.props.users.toArray().map((user) => {
      return <UserSidebarGridItem key={ 'm-'+user.get('id') } user={ user } />;
    });

    const className = { 'user-bar-grid': true, experts: this.props.experts, members: this.props.members };

    return (
      <section className={cn(className)}>
        <h3>{this.props.header}</h3>
        <ul className='clearfix'>
          { userSidebarGridItems }
        </ul>
      </section>
    );
  }
});

module.exports = UserSidebarGrid;