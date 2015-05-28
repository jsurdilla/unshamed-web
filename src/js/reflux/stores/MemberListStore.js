'use strict';


const Reflux = require('reflux');
const UserActions = require('../actions/UserActions');


const MemberListStore = React.createStore({
	userIDs: [],

	getInitialState() {
		return {
			userIDs: this.userIDs
		}
	}
});

module.exports = MemberListStore;