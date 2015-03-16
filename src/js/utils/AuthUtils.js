'use strict';   

// Achtung! I got lazy, MUST clean up this file.

var APIUtils = require('./APIUtils');
var { last } = require('lodash');
var Immutable = require('immutable');
var PusherUtils = require('./PusherUtils');
var SessionUtils = require('./SessionUtils');
var superagent = require('superagent');
var UserServerActionCreators = require('../actions/UserServerActionCreators');

var _loginAttempted = false;

function tokenHasExpired() {
  var expiry, now;
  expiry = getExpiry();
  now = new Date().getTime();
  return expiry && expiry < now;
};

function getExpiry() {
  return parseExpiry(SessionUtils.retrieveAuthHeaders() || {});
};

function parseExpiry(headers) {
  return (parseInt(headers['expiry'], 10) * 1000) || null;
};

function parseValidateTokenResponse(err, resp) {
  if (err) {
    return null;
  }
  return JSON.parse(resp.text);
}

function parseLoginResponse(err, resp) {
  if (err) {
    return null;
  }
  return JSON.parse(resp.text);
}

function signIn(credentials, callback) {
  superagent
    .post('/auth/sign_in')
    .send(credentials)
    .type('json')
    .end(function(err, resp) {
      callback(err, resp);
    });
}

// Exported
function login(email, password, callback) {
  _loginAttempted = true;
  callback = last(arguments);

  if (email && password) {
    signIn({ email: email, password: password }, (err, resp) => {
      SessionUtils.persistAuthHeadersFromResponse(err, resp);
      var data = parseLoginResponse(err, resp);
      var user = data && data.data;

      if (user) {
        user = Immutable.fromJS(user);
        UserServerActionCreators.handleCurrentUserUpdateSuccess(user);
        PusherUtils.connect(user);
        if (callback) {
          callback(true);
        }
      } else {
        var errors = JSON.parse(resp.text).errors;
        callback(false, {
          needsToConfirm: errors && errors.length === 1 && errors[0].match(/confirmation email was sent/)
        })
      }
    });
    return;
  }

  var authHeaders = SessionUtils.retrieveAuthHeaders();
  if (authHeaders['access-token']) {
    var req = superagent
      .get('/auth/validate_token')
      .set(authHeaders)
      .type('json')
      .end((err, resp) => {
        var data = parseValidateTokenResponse(err, resp);
        var user = data && data.data;
        user = Immutable.fromJS(user);
        UserServerActionCreators.handleCurrentUserUpdateSuccess(user);
        PusherUtils.connect(user);
        if (callback) {
          callback(!!user);
        }
      });
  } else {
    UserServerActionCreators.handleCurrentUserUpdateSuccess(null);
    if (callback) {
      callback(false);
    }
  }
}

function logout() {
  SessionUtils.clearAuthHeaders();
  PusherUtils.disconnect();
  _loginAttempted = false;
}

function register(email, password, passwordConfirmation, callback) {
  superagent
    .post('/auth')
    .send({ confirm_success_url: '/onboarding' })
    .send({ email: email, password: password, password_confirmation: passwordConfirmation })
    .end((err, resp) => {
      var data = parseValidateTokenResponse(err, resp);
      var user = data && data.data;

      if (user) {
        SessionUtils.persistAuthHeadersFromResponse(err, resp);
        user = Immutable.fromJS(user);
        UserServerActionCreators.handleCurrentUserUpdateSuccess(user);
        if (callback) {
          callback(true);
        }
      } else {
        callback(false, JSON.parse(resp.text).errors);
      }
    });
}

function resendConfirmation(email) {
  superagent
    .post('/api/v1/me/resend_confirmation')
    .query({ email: email })
    .end();
}

function initiatePasswordReset(email, callback) {
  const loc = window.location;

  superagent
    .post('/auth/password')
    .query({ email: email, redirect_url: loc.origin + loc.pathname })
    .end(callback);
}

function hasAttemptedLogin() {
  return _loginAttempted;
}

module.exports = {
  login,
  logout,
  resendConfirmation,
  initiatePasswordReset,
  hasAttemptedLogin,
  register
}