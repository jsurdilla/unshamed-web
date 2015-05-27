'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var UserAPI = require('../api/UserAPI');
var AuthUtils = require('../utils/AuthUtils');

function logout() {
  AppDispatcher.handleViewAction({
    type: ActionTypes.LOGOUT
  });
}

function fetchUser(userID) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_USER
  });
  UserAPI.fetchUser(userID);
}

function fetchRecentMHPs() {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_RECENT_MHPS
  });
  UserAPI.fetchRecentMHPs();
}

function fetchRecentMembers(page) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.FETCH_RECENT_MEMBERS
  });
  UserAPI.fetchRecentMembers(page);
}

function updateCurrentUser(user) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.UPDATE_CURRENT_USER,
    user
  });
  UserAPI.updateCurrentUser(user);
}

function resetPassword(password, confirmation, authHeaders) {
  AppDispatcher.handleViewAction({
    type: ActionTypes.RESET_PASSWORD,
    password,
    confirmation,
    authHeaders
  });
  UserAPI.resetPassword(password, confirmation, authHeaders);
}

module.exports = {
  fetchUser,
  fetchRecentMembers,
  fetchRecentMHPs,
  logout,
  updateCurrentUser,
  resetPassword
}