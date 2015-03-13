/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, State } = Router;

var Login = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Login</h2>
      </div>
    );
  }
});

module.exports = Login;
