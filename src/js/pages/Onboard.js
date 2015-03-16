/** @jsx React.DOM */

var AuthFilterMixin = require('../utils/AuthFilterMixin');
var CurrentUserStore = require('../stores/CurrentUserStore');
var Nav = require('../components/AppNav');
var ProfileForm = require('../components/onboarding/ProfileForm');
var React = require('react');
var { Navigation, State } = require('react-router');

var Onboard = React.createClass({

  mixins: [AuthFilterMixin, Navigation, State],

  componentWillMount() {
    console.log('Onboard#componentWillMount');
    CurrentUserStore.addChangeListener(this._onDataChange);
  },

  componentWillReceiveProps() {
    console.log('Onboard#componentWillReceiveProps');
  },

  render: function() {
    console.log('Onboard#render');

    return (
      <div>
        <Nav />
        <div id='onboard' className='container'>
          { this.getQuery().confirmed &&
            <div className='row email-confirmation'>
              <div className='col-md-12 col-centered'>
                <div className='alert alert-success text-center'>
                  Thank you for confirming your email.
                </div>
              </div>
            </div>
          }

          <div className='row'>
            <div className='col-md-3 right-rail'>
              <h1>Welcome to the Unshamed Community</h1>
              <p>
                Our goal is simple: To create a safe and healthy space for you to connect
                with those going through the same struggles you are. Your information 
                is strictly confidential and will not be shared with any third party.
                You are now one step away from joining our community of members
                and mental health professionals. Let's conquer our mental health together.
              </p>
              <img src='/images/happy_people.jpg' />
            </div>

            <ProfileForm />
          </div>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    CurrentUserStore.removeChangeListener(this._onDataChange);
  },

  _onDataChange() {
    const user = CurrentUserStore.getCurrentUser();
    if (user.get('onboarded')) {
      this.transitionTo('home');
    }
  }
});

module.exports = Onboard;