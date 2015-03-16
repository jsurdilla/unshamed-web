'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

function handleFetchUserSuccess(user) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_USER_SUCCESS,
    user
  });
}

function handleFetchUserError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_USER_ERROR,
    response: response
  });
}

function handleFetchRecentMembersSuccess(users) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_RECENT_MEMBERS_SUCCESS,
    users
  });
}

function handleFetchRecentMembersError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_RECENT_MEMBERS_ERROR,
    response: response
  });
}

function handleFetchRecentMHPsSuccess(users) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_RECENT_MHPS_SUCCESS,
    users
  });
}

function handleFetchRecentMHPsError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.FETCH_RECENT_MHPS_ERROR,
    response: response
  });
}

function handleCurrentUserUpdateSuccess(user) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.UPDATE_CURRENT_USER_SUCCESS,
    user
  });
}

function handleCurrentUserUpdateError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.UPDATE_CURRENT_USER_ERROR,
    response: response
  });
}

function handleResetPasswordSuccess() {
  AppDispatcher.handleServerAction({
    type: ActionTypes.RESET_PASSWORD_SUCCESS
  });
}

function handleResetPasswordError(err, response) {
  AppDispatcher.handleServerAction({
    type: ActionTypes.RESET_PASSWORD_ERROR,
    response: response
  });
}

module.exports = {
  handleFetchUserError,
  handleFetchUserSuccess,

  handleFetchRecentMembersError,
  handleFetchRecentMembersSuccess,

  handleFetchRecentMHPsError,
  handleFetchRecentMHPsSuccess,

  handleCurrentUserUpdateError,
  handleCurrentUserUpdateSuccess,

  handleResetPasswordError,
  handleResetPasswordSuccess
}