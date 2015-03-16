var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { OrderedSet } = require('Immutable');
var UserStore = require('./UserStore');

var _mhps = OrderedSet();

var MHPStore = assign({
  add(user) {
    _mhps = _mhps.add(user.id);
  },

  getAll() {
    return _mhps;
  }
}, ChangeAwareMixin);

MHPStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([UserStore.dispatchToken])

    // clean up later
  var { action } = payload;
  payload = action || payload;
  var { users } = payload;

  switch (payload.type) {
    case ActionTypes.LOGOUT: 
      _mhps = OrderedSet();
      break;

    case ActionTypes.FETCH_RECENT_MHPS_SUCCESS:
      each(users, MHPStore.add);
      MHPStore.emitChange();
      break;
  }
});

module.exports = MHPStore;