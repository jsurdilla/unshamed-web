/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

var ResourcesSidebarSectionItem = React.createClass({
  render() {
    var resource = this.props.resource;

    return (
      <li className={resource.get('media_type')}>
        <a href={resource.get('url')} target='resource'>{resource.get('title')}</a>
      </li>
    );
  }
});

module.exports = ResourcesSidebarSectionItem;