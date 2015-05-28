'use strict';


const { pluck } = require('lodash');
const Reflux = require('reflux');
const request = require('superagent');
const { retrieveAuthHeaders } = require('../../utils/SessionUtils');
const UserActions = require('../actions/UserActions');


const MHPListStore = Reflux.createStore({
	currentPage: 0,
	userIDs: [],

	getInitialState() {
		return {
			userIDs: this.userIDs
		}
	},

	init() {
		this.listenTo(UserActions.nextPageOfMHPs, this._getNextPage);
	},

	_getNextPage() {
		this.currentPage++;

		const self = this;
		request
			.get('/api/v1/mhps/most_recent')
			.set(retrieveAuthHeaders())
			.query({ page: this.currentPage })
			.end((err, resp) => {
				console.info(err, resp);
				if (err) {
					UserActions.nextPageOfMHPs.failed(err, resp);
				} else {
					const users = JSON.parse(resp.text).users;
					self.userIDs = self.userIDs.concat(pluck(users, 'id'));

					UserActions.nextPageOfMHPs.completed(users);
					self.trigger();
				}
			});
	}
});

module.exports = MHPListStore;