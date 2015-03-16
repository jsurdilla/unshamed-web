/** @jsx React.DOM */

var AuthUtils = require('../../utils/AuthUtils');
var CurrentUserStore = require('../../stores/CurrentUserStore');
var React = require('react');
var Router = require('react-router');
var { Navigation, State } = Router;
var { trimmedValue } = require('../../utils/ComponentUtils');
var UserActionCreators = require('../../actions/UserActionCreators');

var RegisterPanel = React.createClass({

  mixins: [Navigation, State],

  getInitialState() {
    return {
      password: '',
      confirmation: ''
    }
  },

  componentWillMount() {
    CurrentUserStore.addChangeListener(this._handleDataChange);
  },

  render() {
    console.log('**', CurrentUserStore.isResetSuccessful(), CurrentUserStore.isResetSuccessful() === false)
    return (
      <div className='register'>
        <h4 className='heading'>Reset Password</h4>

        <form role='form' noValidate onSubmit={ this._handleSubmit }>
          <div className='form-group'>
            <input type='password' className='form-control' placeholder='Password' value={ this.state.password } onChange={ this._setPassword } />
          </div>
          <div className='form-group'>
            <input type='password' className='form-control' placeholder='Confirm Password' value={ this.state.confirmation } onChange={ this._setPasswordConfirmation } />
          </div>

          <button ref='submit' type='submit' className='btn btn-primary' disabled={ CurrentUserStore.isResettingPassword() || !this._isValid() }>Reset Password</button>
        </form>

        { CurrentUserStore.isResetSuccessful() === false &&
          <div className='result warning'>Sorry, reset was unsuccessful.</div>
        }
      </div>
    );
  },

  componentWillUnmount() {
    CurrentUserStore.removeChangeListener(this._handleDataChange);
  },

  _handleDataChange() {
    if (CurrentUserStore.isResetSuccessful()) {
      this.transitionTo('landing');
    } else {
      this.forceUpdate();
    }
  },

  _setPassword(e) {
    this.setState({ password: e.target.value });
  },

  _setPasswordConfirmation(e) {
    this.setState({ confirmation: e.target.value });
  },

  _isValid() {
    const p = this.state.password.trim();
    const c = this.state.confirmation.trim();
    return p.length && p === c;
  },

  _handleSubmit(e) {
    e.preventDefault();

    if (CurrentUserStore.isResettingPassword() || !this._isValid()) {
      return;
    }

    const p = this.state.password.trim();
    const c = this.state.confirmation.trim();

    const query = this.getQuery();
    const authHeaders = { 'access-token': query.token, client: query.client_id, expire: query.expiry, uid: query.uid };
    UserActionCreators.resetPassword(p, c, authHeaders);
  }
});

module.exports = RegisterPanel;
