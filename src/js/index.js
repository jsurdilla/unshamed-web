/** @jsx React.DOM */

var Unshamed = require('./components/unshamed');
// var AppDispatcher = require('./dispatchers/app_dispatcher');
var Login = require('./components/login');
var Logout = require('./components/logout');
var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, State } = Router;
var superagent = require('superagent');
// var ActionTypes = require('./constants/action_types');

function signIn(data) {
  superagent
    .post('/auth/sign_in')
    .send(data)
    .set('Accept', 'application/json')
    .end(function(err, res) {
      console.log(err, res);
      AppDispatcher.handleViewAction({
        actionType: ActionTypes.AUTH_SIGNIN_SUCCESS,
        item: res
      }, res);
    });
};

var routes = (
  <Route handler={Unshamed}>
    <Route name='login' handler={Login} />
    <Route name='logout' handler={Logout} />
  </Route>
);

signIn({ email: 'jlsurdilla@gmail.com', password: 'password' });

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('unshamed'));
});

