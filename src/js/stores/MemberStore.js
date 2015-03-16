var { assign, each } = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { OrderedSet } = require('Immutable');
var UserStore = require('./UserStore');

var _members = OrderedSet();

var MemberStore = assign({
  add(user) {
    _members = _members.add(user.id);
  },

  getAll() {
    return _members;
  }
}, ChangeAwareMixin);

MemberStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([UserStore.dispatchToken])

    // clean up later
  var { action } = payload;
  payload = action || payload;
  var { users } = payload;

  switch (payload.type) {
    case ActionTypes.LOGOUT: 
      _members = OrderedSet();
      break;

    case ActionTypes.FETCH_RECENT_MEMBERS_SUCCESS:
      each(users, MemberStore.add);
      MemberStore.emitChange();
      break;
  }
});

module.exports = MemberStore;