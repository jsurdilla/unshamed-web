'use strict';

var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AuthUtils = require('../utils/AuthUtils');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { createEntityWithClientID } = require('../utils/StoreUtils');
var Immutable = require('immutable');
var { Map } = Immutable;

let _user = Map();
let _isResettingPassword = undefined;
let _isResetSuccessful = undefined;

const CurrentUserStore = assign({
  isResettingPassword() {
    return _isResettingPassword;
  },

  isResetSuccessful() {
    return _isResetSuccessful;
  },

  getCurrentUser() {
    return _user;
  }
}, ChangeAwareMixin);

CurrentUserStore.dispatchToken = AppDispatcher.register((payload) => {
  const { action } = payload;
  payload  = action || payload;
  const { type, user } = payload;

  switch (type) {
    case ActionTypes.UPDATE_CURRENT_USER_SUCCESS:
      _user = Immutable.fromJS(user);
      CurrentUserStore.emitChange();
      break;

    case ActionTypes.RESET_PASSWORD:
      _isResettingPassword = true;
      CurrentUserStore.emitChange();
      break;
    case ActionTypes.RESET_PASSWORD_ERROR:
      _isResettingPassword = false;
      _isResetSuccessful = false;
      CurrentUserStore.emitChange();
      break;
    case ActionTypes.RESET_PASSWORD_SUCCESS:
      _isResettingPassword = false;
      _isResetSuccessful = true;
      CurrentUserStore.emitChange();
      break;
  }
});

module.exports = CurrentUserStore;