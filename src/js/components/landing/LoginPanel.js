/** @jsx React.DOM */

var AuthUtils = require('../../utils/AuthUtils');
var { assign } = require('lodash');
var { trimmedValue } = require('../../utils/ComponentUtils');
var React = require('react');
var Router = require('react-router');
var { State, Navigation } = Router;

function validateEmail(email) {
  const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

var LoginPanel = React.createClass({
  mixins: [State, Navigation],

  getInitialState() {
    return {
      inProgress: false,
      badLogin: false,
      recoverMode: false
    };
  },

  render: function() {
    console.log(this.getQuery());

    return (
      <div className='login'>
        <h4 className='heading'>
          Login
          <span> / </span>
          <a href='#' onClick={ this.props.onFormPanelFlip }>Sign Up</a>
        </h4>

        <form role='form' noValidate onSubmit={ this._handleSubmit }>
          <div className='form-group'>
            <input type='email' ref='email' className='form-control' placeholder='Email' />
          </div>
          { !this.state.recoverMode &&
            <div className='form-group'>
              <input type='password' ref='password' className='form-control' placeholder='Password' />
            </div>
          }
          <button type='submit' className='btn btn-primary' disabled={ this.state.inProgress }>
            { this.state.recoverMode ? "Reset Password" : "Login" }
          </button>
        </form>

        { this._passwordResetText() }
        { this._loginWarning() }
      </div>
    );
  },

  trimmedValue,

  _loginWarning() {
    if (this.state.badLogin) {
      if (this.state.needsToConfirm) {
        return this.state.confirmationResent ?
          <div className='result warning'>Confirmation sent. Please check your email.</div> :
          <div className='result warning'>
            Please check your email for confirmation.
            Did not receive it? <a href='#' onClick={ this._resendConfirmation }>Resend it</a>.
          </div>
      } else {
        return <div className='result warning'>Please double check your credentials and try again.</div>
      }
    }
  },

  _passwordResetText() {
    if (this.state.recoverMode) {
      if  (this.state.resetSent) {
        return <div className='result'>Please check your email.</div>;
      } else if (this.state.resetError)  {
        return <div className='result warning'>{ this.state.resetError }</div>;
      } else {
        return <div className='result'>Back to <a href='#' onClick={ this._setRecoverMode }>Login</a>.</div>;
      }
    }
    return <div className='result'>Forgot your password? <a href='#' onClick={ this._setRecoverMode }>Reset it</a>.</div>;
  },

  _handleSubmit: function(e) {
    e.preventDefault();

    if (this.state.recoverMode) {
      return this._initiatePasswordReset();
    }

    if (this.state.inProgress) {
      return;
    }

    this.setState({ inProgress: true });

    const email = this.trimmedValue('email');
    const password = this.trimmedValue('password');

    AuthUtils.login(email, password, ((loggedIn, info) => {
      if (loggedIn) {
        var redirectTo = this.getQuery().redirectTo;
        this.transitionTo(redirectTo ? redirectTo : 'home');
      } else {
        this.setState(assign({ badLogin: true, inProgress: false }, info));
      }
    }).bind(this));
  },

  _isValid() {
    const validEmail = validateEmail(this.state.email);
  },

  _resendConfirmation() {
    const email = this.trimmedValue('email');
    AuthUtils.resendConfirmation(email);
    this.setState({ confirmationResent: true })
  },

  _initiatePasswordReset() {
    const email = this.trimmedValue('email');

    this.setState({ inProgress: true });
    AuthUtils.initiatePasswordReset(email, ((err, resp) => {
      if (err) {
        const error = JSON.parse(resp.text).errors[0];

        if (error.startsWith("Unable to find user")) {
          this.setState({ resetError: "That email doesn't exist in our system.", inProgress: false });
        }
      } else {
        this.setState({ resetSent: true, inProgress: false });
      }
    }).bind(this));
  },

  _setRecoverMode() {
    this.setState({ recoverMode: !this.state.recoverMode });
  }
});

module.exports = LoginPanel;
