'use strict';


const { each } = require('lodash');
const UserActions = require('../actions/UserActions');
const Reflux = require('reflux');


const UsersStore = Reflux.createStore({
	users: {},

	getInitialState() {
		return {
			users: this.users
		}
	},

	init() {
		const self = this;
		this.listenTo(UserActions.nextPageOfMHPs.completed, ((users) => {
			each(users, ((user) => {
				self.users[user.id] = user;
			}));
		}));
	}
});

module.exports = UsersStore;