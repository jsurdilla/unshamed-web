/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, State } = Router;

var Logout = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Logout</h2>
      </div>
    );
  }
});

module.exports = Logout;
