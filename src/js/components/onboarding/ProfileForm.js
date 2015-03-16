var { checkUsername } = require('../../api/UserAPI');
var cn = require('classnames');
var CurrentUserStore = require('../../stores/CurrentUserStore');
var DatePicker = require('./date_picker');
var moment = require('moment');
var { OverlayTrigger, Tooltip } = require('react-bootstrap');
var { partialRight } = require('lodash');
var ProfilePicSelector = require('./profile_pic_selector');
var React = require('react');
var { trimmedValue } = require('../../utils/ComponentUtils');
var UserActionCreators = require('../../actions/UserActionCreators');
var CurrentUserStore = require('../../stores/CurrentUserStore');

const TextFormGroup = React.createClass({
  render() {
    return (
      <div className='form-group'>
        <label>{ this.props.label } { this.props.error && <span className='error'>{ this.props.error }</span> }</label>
        <input type='text' className='form-control' onChange={ this.props.onChange } value={ this.props.value } />
      </div>
    );
  }
});

const StrugglesSelector = React.createClass({
  getInitialState() {
    return {
      struggles: this.props.struggles || []
    };
  },

  render() {
    return (
      <ul className='list-inline list-unstyled struggles clearfix'>
        <li>
          <a className={ cn({ selected: this._strugglesWith('anxiety') }) } onClick={ this._toggle.bind(this, 'anxiety') }>Anxiety</a>
        </li>
        <li>
          <a className={ cn({ selected: this._strugglesWith('depression') }) } onClick={ this._toggle.bind(this, 'depression') }>Depression</a>
        </li>
        <li>
          <a className={ cn({ selected: this._strugglesWith('ocd') }) } onClick={ this._toggle.bind(this, 'ocd') }>OCD</a>
        </li>
        <li>
          <a className={ cn({ selected: this._strugglesWith('addiction') }) } onClick={ this._toggle.bind(this, 'addiction') }>Addiction</a>
        </li>
        <li>
          <a className={ cn({ selected: this._strugglesWith('eatingdisorder') }) } onClick={ this._toggle.bind(this, 'eatingdisorder') }>Eating Disorder</a>
        </li>
        <li>
          <OverlayTrigger placement='top' overlay={ <Tooltip>A supporter is someone who has loved ones who are struggling.</Tooltip> }>
            <a className={ cn({ selected: this._strugglesWith('supporter') }) } onClick={ this._toggle.bind(this, 'supporter') }>Supporter</a>
          </OverlayTrigger>
        </li>
      </ul>
    );
  },

  _strugglesWith(struggle) {
    return this.state.struggles.indexOf(struggle) !== -1;
  },

  _toggle(struggle) {
    var struggles = this.state.struggles;
    var index = struggles.indexOf(struggle);
    if (index === -1) {
      struggles.push(struggle);
    } else {
      struggles.splice(index, 1);
    }
    this.setState({ struggles });
    if (this.props.onChange) {
      this.props.onChange(this.state.struggles);
    }
  }
});

function getStateFromUser(user) {
  return {
    profilePic: user.profile_pictures.original,
    isProfilePicBlob: false,
    username: user.username || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    zipCode: user.zip_code || '',
    birthdate: user.birthdate && moment(user.birthdate).toDate(),
    gender: user.gender || '',
    aboutMe: user.about_me || '',
    struggles: user.struggles || []
  };
}

const ProfileForm = React.createClass({

  getInitialState() {
    return getStateFromUser(CurrentUserStore.getCurrentUser().toJS());
  },

  componentWillMount() {
    CurrentUserStore.addChangeListener(this._handleDataChange);
  },

  render() {
    return (
      <form role='form' name='onboardingForm' novalidate>
        <div className='col-md-9 main-content'>
          <div className='row'>
            <div className='col-md-12'>
              <h3>Basic Information</h3>
              { this._basicInformationFields() }
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <h3>Please tell us about yourself { this.state.aboutMe.length === 0 && <span className='error'>(required)</span> }</h3>
              <div className='form-group'>
                <textarea className='form-control' onChange={ partialRight(this._handleChange, 'aboutMe') } value={ this.state.aboutMe }>
                </textarea>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <h3>What are you here for? { this.state.struggles.length === 0 && <span className='error'>(please select at least one)</span> }</h3>
              <StrugglesSelector struggles={ this.state.struggles } onChange={ partialRight(this._handleChange, 'struggles') } />
            </div>
          </div>

          <div className='row action'>
            <div className='col-md-6'>
              { this.state.justSaved && 'Your changes have been saved.' }
            </div>
            <div className='col-md-6'>
              <button type='submit' className='btn btn-primary pull-right save' disabled={ !this._isValid() || this.state.inProgress } onClick={ this._handleSave }>
                { this.state.inProgress ? 'Saving...' : 'Save' }
              </button>
            </div>
        </div>
        </div>
      </form>
    );
  },

  componentWillUnmount() {
    CurrentUserStore.removeChangeListener(this._handleDataChange);
  },

  _handleDataChange() {
    this.state.inProgress = false;
    this.state.justSaved = true;
    this.setState(getStateFromUser(CurrentUserStore.getCurrentUser().toJS()));
  },

  _basicInformationFields() {
    return (
      <div className='row'>
        <div className='col-md-5'>
          <TextFormGroup label='Username' onChange={ partialRight(this._handleChange, 'username') } value={ this.state.username } 
            error={ (this.state.usernameTaken && '(already taken)') || (this.state.username.length === 0 && '(required)') } />
          <TextFormGroup label='First Name' onChange={ partialRight(this._handleChange, 'firstName') } value={ this.state.firstName } />
          <TextFormGroup label='Last Name' onChange={ partialRight(this._handleChange, 'lastName') } value={ this.state.lastName } />
          <TextFormGroup label='Zip Code' onChange={ partialRight(this._handleChange, 'zipCode') } value={ this.state.zipCode }
            error={ this.state.zipCode.length === 0 && '(required)' } />

          <div className='form-group'>
            <label>Gender { this.state.gender.length === 0 && <span className='error'>(required)</span> }</label>
            <select className='form-control' onChange={ partialRight(this._handleChange, 'gender') } value={ this.state.gender }>
              <option value=''>Select One</option>
              <option value='m'>Male</option>
              <option value='f'>Female</option>
            </select>
          </div>
        </div>

        <div className='col-md-5 col-md-offset-1'>
          <div className='form-group'>
            <label htmlFor='user-first-name'>
              Profile Picture 
              ( <ProfilePicSelector origProfilePic={ this.state.profilePic } onProfilePicChange={ this._handleProfilePicChange } /> )
            </label>
            <div className='profile-pic'><img src={ this.state.profilePic } /></div>
          </div>
          <div className='form-group'>
            <label htmlFor='user-first-name'>Birthdate { !this.state.birthdate && <span className='error'>(required)</span> }</label>
            <DatePicker ref='birthdate' initialDate={ this.state.birthdate } onChange={ partialRight(this._handleChange, 'birthdate') } />
          </div>
        </div>
      </div>
    );
  },

  _handleChange(evtOrVal, property) {
    this.state[property] = evtOrVal && evtOrVal.target ? evtOrVal.target.value : evtOrVal;
    this.forceUpdate();

    if (property === 'username') this._validateUserName(evtOrVal);
  },

  _handleProfilePicChange(pic) {
    this.setState({ profilePic: pic, isProfilePicBlob: true });
  },

  _validateUserName(event) {
    var username = event.target.value.trim();
    if (/^\w*$/.test(username)) {
      if (username.length > 0) {
        checkUsername(username).then(
          () => this.setState({ usernameTaken: false }),
          () => this.setState({ usernameTaken: true })
        );
      } else {u
        this.setState({ usernameTaken: false });
      }
    }
  },

  _isValid() {
    const s = this.state;
    return s.username.length && !s.usernameTaken && s.zipCode.length && s.gender.length && s.birthdate && s.aboutMe.length && s.struggles.length;
  },

  _handleSave() {
    if (!this._isValid()) return;

    this.setState({ inProgress: true, justSaved: false });

    const s = this.state;
    UserActionCreators.updateCurrentUser({
      username: s.username,
      first_name: s.firstName,
      last_name: s.lastName,
      zip_code: s.zipCode,
      gender: s.gender,
      birthdate: s.birthdate,
      about_me: s.aboutMe,
      struggles: s.struggles,
      profilePic: s.profilePic,
      isProfilePicBlob: s.isProfilePicBlob
    });
  }
});

module.exports = ProfileForm;