/** @jsx React.DOM */

var AuthFilterMixin = require('../utils/AuthFilterMixin');
var MemberStore = require('../stores/MemberStore');
var Nav = require('../components/AppNav');
var React = require('react');
var { State } = require('react-router');
var UserActionCreators = require('../actions/UserActionCreators');

var Members = React.createClass({
  mixins: [AuthFilterMixin, State],

  componentDidMount() {
    MemberStore.addChangeListener(this._handleStoreStateChange);

    UserActionCreators.fetchRecentMembers(MemberStore.getCurrentPage());
  },

  render() {
    const members = MemberStore.getAll();

    return <div>
        <Nav />
        <div id='members' className='container'>

        </div>
      </div>
  },

  _handleStoreStateChange() {
    debugger
    console.log(MemberStore.getAll());
  }
});

module.exports = Members;