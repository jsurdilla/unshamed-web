/** @jsx React.DOM */

var CurrentUserStore = require('../stores/CurrentUserStore');
var React = require('react');
var Nav = require('./AppNav');
var Router = require('react-router');
var { RouteHandler } = Router;

var Unshamed = React.createClass({
  componentWillMount() {
    console.log('Unshamed#componentWillMount');
  },

  componentDidMount() {
    console.log('Unshamed#componentDidMount');
  },

  render() {
    const user = CurrentUserStore.getCurrentUser();

    return (
      <div>
        <RouteHandler { ...this.props } />
      </div>
    );
  }
});

module.exports = Unshamed;