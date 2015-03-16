/** @jsx React.DOM */

var AuthUtils = require('../../utils/AuthUtils');
var { trimmedValue } = require('../../utils/ComponentUtils');
var React = require('react');
var Router = require('react-router');
var { Navigation } = Router;

var processError = function(err) {
  if (!err) return;

  if (err.email && !!err.email[0].match(/already in use/)) {
    return "Email is already in use.";
  } else if (err.password_confirmation) {
    return "Password didn't match.";
  } else if (err.password && err.password[0].startsWith("is too short")) {
    return "Password is too short (must be at least 8 characters)."
  }
  return "Please double check your information and try again.";
}

var RegisterPanel = React.createClass({

  mixins: [Navigation],

  getInitialState() {
    return {
      badForm: false,
      inProgress: false
    }
  },

  render() {
    return (
      <div className='register'>
        <h4 className='heading'>
          Join Now <span> /&nbsp;
          <a href='#' onClick={this.props.onFormPanelFlip}>Login</a>
          </span>
        </h4>

        <form role='form' noValidate onSubmit={this._handleSubmit}>
          <div className='form-group'>
            <input type='email' ref='email' className='form-control' placeholder='Email' />
          </div>
          <div className='form-group'>
            <input type='password' ref='password' className='form-control' placeholder='Password' />
          </div>
          <div className='form-group'>
            <input type='password' ref='passwordConfirmation' className='form-control' placeholder='Confirm Password' />
          </div>
          <p>By signing up, you agree to our <a className='tos' href='./terms.html' target='_blank'>Terms of Use</a>.</p>
          <button ref='submit' type='submit' className='btn btn-primary' disabled={this.state.inProgress || this.state.success}>
            {this.state.buttonText || "Let's do it!"}
          </button>
        </form>

        {this.state.badForm &&
          <div className='result warning'>{this.state.error} </div>
        }

        {this.state.success &&
          <div className='result success'>Please check your email for confirmation.</div>
        }
      </div>
    );
  },

  trimmedValue,

  _handleSubmit(e) {
    e.preventDefault();

    if (this.state.inProgress) {
      return;
    }

    this.setState({ inProgress: true });

    const email = this.trimmedValue('email');
    const password = this.trimmedValue('password');
    const passwordConfirmation = this.trimmedValue('passwordConfirmation');

    AuthUtils.register(email, password, passwordConfirmation, ((loggedIn, err) => {
      if (loggedIn) {
        this.setState({ badForm: false, inProgress: false, success: true, buttonText: 'Success!' });
      } else {
        this.setState({ badForm: true, inProgress: false, error: processError(err) });
      }
    }).bind(this));
  }
});

module.exports = RegisterPanel;
