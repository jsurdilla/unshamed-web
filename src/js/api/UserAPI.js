'use strict';

var { dataURItoBlob } = require('../utils/ComponentUtils');
var { last } = require('lodash');
var { Promise } = require('es6-promise');
var { retrieveAuthHeaders } = require('../utils/SessionUtils');
var UserServerActionCreators = require('../actions/UserServerActionCreators');
var superagent = require('superagent');

function checkUsername(username) {
  var promise = new Promise((resolve, reject) => {
    superagent
      .get('/api/v1/users/check_username')
      .set(retrieveAuthHeaders())
      .query({ username: username })
      .end((err, resp) => {
        if (err) {
          reject();
        } else {
          var resp = JSON.parse(resp.text);
          resp.exists ? reject() : resolve();
        }
      });
  });
  return promise;
}

function fetchUser(userID) {
  superagent
    .get('/api/v1/users/' + userID)
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        UserServerActionCreators.handleFetchUserError(err, resp);
      } else {
        UserServerActionCreators.handleFetchUserSuccess(JSON.parse(resp.text).user);
      }
    });
}

function fetchRecentMHPs() {
  superagent
    .get('/api/v1/mhps/most_recent')
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        UserServerActionCreators.handleFetchRecentMHPsError(err, resp);
      } else {
        UserServerActionCreators.handleFetchRecentMHPsSuccess(JSON.parse(resp.text).users);
      }
    });
}

function fetchRecentMembers(page) {
  superagent
    .get('/api/v1/users/most_recent')
    .query({ page: page })
    .set(retrieveAuthHeaders())
    .end((err, resp) => {
      if (err) {
        UserServerActionCreators.handleFetchRecentMembersError(err, resp);
      } else {
        UserServerActionCreators.handleFetchRecentMembersSuccess(JSON.parse(resp.text).users);
      }
    });
 }

function updateCurrentUser(user) {
  const request = superagent
    .put('/api/v1/me/onboard')
    .set(retrieveAuthHeaders());

  // basic user data
  for (var key in user) {
    request.field('user[' + key + ']', user[key]);
  }

  for (var i in user.struggles) {
    request.field('user[member_profile_attributes][struggles][]', user.struggles[i]);
  }

  if (user.profilePic) {
    let profilePic, extension;

    if (user.isProfilePicBlob) {
      profilePic = dataURItoBlob(user.profilePic);
      extension = last(profilePic.type.split('/'));
    } else {
      profilePic = user.profilePic;
      extension = user.profilePic.split('.').pop().match(/^[A-z]+/);
    }
    request.attach('file', profilePic, 'profile_pic.' + extension);
  }

  request.end((err, resp) => {
    if (err) {
      UserServerActionCreators.handleCurrentUserUpdateError(err, resp);
    } else {
      UserServerActionCreators.handleCurrentUserUpdateSuccess(JSON.parse(resp.text).user);
    }
  });
}

function resetPassword(password, confirmation, authHeaders) {
  superagent
    .put('/auth/password')
    .set(authHeaders)
    .send({ password, password_confirmation: confirmation })
    .end((err, resp) => {
      if (err) {
        UserServerActionCreators.handleResetPasswordError(err, resp);
      } else {
        UserServerActionCreators.handleResetPasswordSuccess(JSON.parse(resp.text).user);
      }
    });
}

module.exports = {
  checkUsername,
  fetchUser,
  fetchRecentMembers,
  fetchRecentMHPs,
  updateCurrentUser,
  resetPassword
};