/** @jsx React.DOM */


const AuthFilterMixin = require('../../utils/AuthFilterMixin');
const { isEmpty, map } = require ('lodash');
const MHPListStore = require('../stores/MHPListStore');
const Nav = require('../../components/AppNav');
const React = require('react');
const Reflux = require('reflux');
const { State } = require('react-router');
const UserActions = require('../actions/UserActions');
const UsersStore = require('../stores/UsersStore');


const MHPsPage = React.createClass({
	mixins: [
		AuthFilterMixin,
		Reflux.listenTo(MHPListStore, '_onMHPListChange')
	],

	getInitialState() {
		return {
			userIDs: []
		}
	},

	componentDidMount() {
		UserActions.nextPageOfMHPs(); // initial page
	},

	render() {
		return (
			<div>
				<Nav />

				<div id='mhps' className='container'>
					{ this.state.userIDs }
				</div>
			</div>
		);
	},

	_onMHPListChange() {
		this.setState({ userIDs: MHPListStore.userIDs });
	}
});

module.exports = MHPsPage;