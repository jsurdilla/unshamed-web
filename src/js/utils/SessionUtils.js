'use strict';

var { Cookies } = require('cookies-js');
var { pick } = require('lodash');

var AUTH_HEADERS_KEY = 'auth_headers';
var HEADER_KEYS = ['access-token', 'client', 'expiry', 'uid'];

function persistAuthHeadersFromResponse(err, response) {
  if (err) {
    return;
  }
  var authHeaders = pick(response.headers, HEADER_KEYS);
  Cookies.set(AUTH_HEADERS_KEY, JSON.stringify(authHeaders), { path: '/' });
}

function persistAuthHeaders(authHeaders) {
  Cookies.set(AUTH_HEADERS_KEY, JSON.stringify(authHeaders));
}

function clearAuthHeaders() {
  Cookies.expire(AUTH_HEADERS_KEY);
}

function retrieveAuthHeaders() {
  return JSON.parse(Cookies.get(AUTH_HEADERS_KEY) || '{}');
}

module.exports = {
  persistAuthHeadersFromResponse,
  persistAuthHeaders,
  retrieveAuthHeaders,
  clearAuthHeaders
}