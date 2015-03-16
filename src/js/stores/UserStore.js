'use strict';

var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AuthUtils = require('../utils/AuthUtils');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var { Map } = require('immutable');

var _users = Map();

const UserStore = assign({
  add(user) {
    _users = _users.set(user.id, createEntityWithClientID(user));
  },

  get(userID) {
    return _users.get(parseInt(userID));
  }
}, ChangeAwareMixin);

UserStore.dispatchToken = AppDispatcher.register((payload) => {
  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { type, user, users, message } = payload;

  switch (type) {
    case ActionTypes.LOGOUT: 
      _users = Map();
      break;

    case ActionTypes.FETCH_RECENT_MEMBERS:
      break;
    case ActionTypes.FETCH_RECENT_MEMBERS_ERROR:
      break;
    case ActionTypes.FETCH_FRIENDS_SUCCESS:
    case ActionTypes.FETCH_RECENT_MEMBERS_SUCCESS:
    case ActionTypes.FETCH_RECENT_MHPS_SUCCESS:
      each(users, UserStore.add);
      UserStore.emitChange();
      break;

    case ActionTypes.FETCH_USER_SUCCESS:
      UserStore.add(payload.user);
      UserStore.emitChange();
      break;

    case ActionTypes.ACCEPTED_FRIEND_REQUEST_PUSH:
      UserStore.add(message.friendship_request.user);
      UserStore.emitChange();
      break;
  }
});

module.exports = UserStore;