'use strict';


const Reflux = require('reflux');


const UserActions = Reflux.createActions({
	'nextPageOfMHPs': { asyncResult: true }
});

module.exports = UserActions;