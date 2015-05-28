/** @jsx React.DOM */

'use strict';

const AuthFilterMixin = require('../utils/AuthFilterMixin');
const { isEmpty, map } = require ('lodash');
const Nav = require('../components/AppNav');
const React = require('react');
const Reflux = require('reflux');
const request = require('superagent');
const { retrieveAuthHeaders } = require('../utils/SessionUtils');
const { State } = require('react-router');


function displayName(user) {
	return isEmpty(user.full_name.trim()) ? user.username : user.full_name;
}


/**
 * MemberActions contains all member-related actions.
 */
const { nextPage } = Reflux.createActions([
	'nextPage'
]);


/**
 * MembersStore stores all the members (as opposed to MHPs).
 */
const MembersStore = Reflux.createStore({
	page: 0,
	hasMore: true,
	members: [],

	getInitialState() {
		return {
			members: this.members
		}
	},

	init() {
		this.listenTo(nextPage, '_getNextPage');
	},

	_getNextPage() {
		this.page++;

		const self = this;
		request
			.get('/api/v1/users/most_recent')
			.set(retrieveAuthHeaders())
			.query({ page: this.page })
			.end((err, resp) => {
				if (err) {
					console.error(err, resp);
			  } else {
			  	const users = JSON.parse(resp.text).users;
			  	if (users.length > 0) {
			  		self.members = self.members.concat(users);
			  	} else {
			  		self.hasMore = false;
			  	}
			  	self.trigger(self.members);
			  }
			});
	}
});


/**
 * MemberGridCell is the individual member cell in the MemberGrid.
 */
const MemberGridCell = React.createClass({
	propTypes: {
		user: React.PropTypes.object
	},

	render() {
		return (
			<div className='member'>
				<img src={this.props.user.profile_pictures.medium} />
				<span>{displayName(this.props.user)}</span>
			</div>
		);
	}
});


/**
 * Members grid view of the members.
 */
const Members = React.createClass({
	mixins: [AuthFilterMixin, State, Reflux.listenTo(MembersStore, '_onMembersChange')],

	getInitialState() {
		return {
			members: MembersStore.members
		};
	},

	componentDidMount() {
		nextPage();
	},

	render() {
		const members = map(this.state.members, ((member) => <MemberGridCell user={member} />));

		return (
			<div>
				<Nav />
				<div id='members' className='container'>
					<div className='members grid'>
						{members}
					</div>

					{MembersStore.hasMore &&
						<button className='btn btn-success' onClick={this._getMore}>More</button>
					}
				</div>
			</div>
		);
	},

	_onMembersChange() {
		this.setState({ members: MembersStore.members });
	},

	_getMore() {
		nextPage();
	}
});

module.exports = Members;