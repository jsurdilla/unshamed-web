var AuthUtils = require('../utils/AuthUtils');
var SessionUtils = require('../utils/SessionUtils');
var CurrentUserStore = require('../stores/CurrentUserStore');
var { first, pick } = require('lodash');

function authDataFromUrl(query) {
  if (query['token'] && query['client_id'] && query['expiry'] && query['uid']) {
    return {
      'access-token': query['token'],
      client: query['client_id'],
      expiry: query['expiry'],
      uid: query['uid']
    }
  }
  return null;
}

module.exports = {
  statics: {
    // TODO:
    // - Only include this for pages that need authentication.
    //    - Password reset and landing will not include this.

    willTransitionTo(transition, params, query, callback) {
      console.log('Transitioning to', params, query, transition.path);

      // For Onboarding (or any request where the token information is in the URL)
      if (authDataFromUrl(query)) {
        SessionUtils.persistAuthHeaders(authDataFromUrl(query));
      }

      // avoid infinite redirects
      if (query.redirectTo && ("/?redirectTo=" + query.redirectTo === decodeURIComponent(transition.path))) {
        callback();
        return;
      }

      var handleAuthenticated = (user) => {
        const onboarded = CurrentUserStore.getCurrentUser().get('onboarded');
        var path = decodeURIComponent(transition.path);
        var paramlessPath = first(path.split('?'));
        if (!onboarded && paramlessPath !== '/onboarding') {
          transition.redirect('onboarding');
        } else if ((onboarded && paramlessPath === '/onboarding') || paramlessPath === '/') {
          transition.redirect('home');
        }
      }

        
      if (!AuthUtils.hasAttemptedLogin()) { // initial page load
        AuthUtils.login(null, null, (loggedIn) => {
          if (!loggedIn) {
            transition.redirect('landing', {}, {});
          } else {
            handleAuthenticated(CurrentUserStore.getCurrentUser());
          }
          callback();
        });
      } else {
        var user = CurrentUserStore.getCurrentUser();
        if (!user) {
          transition.redirect('landing', {}, { redirectTo: transition.path });  
        } else {
          handleAuthenticated(CurrentUserStore.getCurrentUser());
        }
        callback();
      }
    }
  },

  getCurrentUser() {
    return _user;
  }
};