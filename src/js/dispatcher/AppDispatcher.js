var { assign } = require('lodash');
var { Dispatcher } = require('flux');
var invariant = require("react/lib/invariant");
var PayloadSources = require('../constants/PayloadSources');

module.exports = assign(new Dispatcher(), {
  handlePushAction(action) {
    console.log('PUSH action', action)

    invariant(action.type, 'Empty action.type');

    this.dispatch({
      source: PayloadSources.PUSH_ACTION,
      action
    });
  },

  handleServerAction(action) {
    console.log('SERVER action', action);

    invariant(action.type, 'Empty action.type');

    this.dispatch({
      source: PayloadSources.SERVER_ACTION,
      action
    });
  },

  handleViewAction(action) {
    console.log('VIEW action', action);

    invariant(action.type, 'Empty action.type');

    this.dispatch({
      source: PayloadSources.VIEW_ACTION,
      action
    });
  }
});
