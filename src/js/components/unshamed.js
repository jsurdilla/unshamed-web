/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, State } = Router;

var Unshamed = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Unshamed II</h1>
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Unshamed;

