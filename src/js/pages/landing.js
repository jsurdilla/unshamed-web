/** @jsx React.DOM */

var AuthFilterMixin = require('../utils/AuthFilterMixin');
var AuthUtils = require('../utils/AuthUtils');
var LoginPanel = require('../components/landing/LoginPanel');
var ResetPasswordPanel = require('../components/landing/ResetPasswordPanel');
var RegisterPanel = require('../components/landing/RegisterPanel');
var React = require('react');
var { State, Navigation } = require('react-router');
var SessionUtils = require('../utils/SessionUtils');

var Landing = React.createClass({

  mixins: [State],

  componentWillReceiveProps(nextProps) {
    console.log('Landing#componentWillReceiveProps');
  },

  componentWillMount() {
    console.log('Landing#componentWillMount');
  },

  render: function() {
    console.log('Landing#render');

    return (
      <div id='landing'>
        <header className='intro'>
          <div className='logo'>
            <img src='./images/logo@2x.png' />
          </div>

          <h1>No Stigmas. No Shame. Just You.</h1>
          <h2>Let's conquer our mental health together</h2>

          { !this._isPasswordResetFlow() &&
            <div className='register-login-panel flip-container'>
              <div className='flipper'>
                <div className='front'>
                  <LoginPanel onFormPanelFlip={ this.onFormPanelFlip } />
                </div>
                <div className='back'>
                  <RegisterPanel onFormPanelFlip={ this.onFormPanelFlip } />
                </div>
              </div>
            </div>
          }

          { this._isPasswordResetFlow() &&
            <div className='register-login-panel flip-container'>
              <div className='flipper'>
                <div className='front'>
                  <ResetPasswordPanel />
                </div>
              </div>
            </div>
          }
        </header>

        <div className='container why'>
          <div className='row'>
            <div className='community'>
              <h1>Community</h1>
              <p>Connect with people who share your mental health struggles.</p>
            </div>
            <div className='resources'>
              <h1>Resources</h1>
              <p>Get helpful resources to learn how to deal with all aspects of your mind and well-being.</p>
            </div>
          </div>
          <div className='row'>
            <div className='support'>
              <h1>Support</h1>
              <p>Get insight from top mental health professionals.</p>
            </div>
            <div className='movement'>
              <h1>Movement</h1>
              <p>Join the revolution to help end the stigma surrounding mental health.</p>
            </div>
          </div>
        </div>

        <div className='supporters'>
          <h1>Supporters</h1>
          <p>
            Family, friends, and all those with loved ones dealing with their mental health
            can now connect with others to find support and resources.
          </p>
        </div>

        <footer>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1'>
                <ul className='list-inline text-center social-networks'>
                  <li>
                    <a href='https://twitter.com/theunshamed' target='_blank'>
                      <span className='fa-stack fa-lg'>
                        <i className='fa fa-circle fa-stack-2x'></i>
                        <i className='fa fa-twitter fa-stack-1x fa-inverse'></i>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href='https://www.facebook.com/theunshamed' target='_blank'>
                      <span className='fa-stack fa-lg'>
                        <i className='fa fa-circle fa-stack-2x'></i>
                        <i className='fa fa-facebook fa-stack-1x fa-inverse'></i>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href='https://www.instagram.com/the_unshamed' target='_blank'>
                      <span className='fa-stack fa-lg'>
                        <i className='fa fa-circle fa-stack-2x'></i>
                        <i className='fa fa-instagram fa-stack-1x fa-inverse'></i>
                      </span>
                    </a>
                  </li>
                </ul>
              <p className='copyright text-muted'>Copyright &copy; Unshamed 2015</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  },

  componentDidMount() {
    console.log('Landing#componentDidMount');
  },

  componentWillUnmount() {
    console.log('Landing#componentWillUnmount');
  },

  _isPasswordResetFlow() {
    return this.getQuery().reset_password;
  },

  onFormPanelFlip: function(event) {
    event.preventDefault();
    document.querySelector('.register-login-panel').classList.toggle('flipped')
  },
});

module.exports = Landing;