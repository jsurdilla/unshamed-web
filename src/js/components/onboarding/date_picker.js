var cn = require('classnames');
var { map, padLeft, range } = require('lodash');
var moment = require('moment');
var React = require('react');

const MONTH_OPTIONS = map(moment.months(), (month, i) => <option value={ i }>{ month }</option>);
const DAY_OPTIONS = map(range(1,32), (day) => <option value={ day }>{ day }</option>);
const STARTING_YEAR = moment().get('y') - 16;
const YEAR_OPTIONS = map(range(STARTING_YEAR, STARTING_YEAR - 100, -1), (year) => <option value={ year }>{ year }</option>);

var DatePicker = React.createClass({
  propTypes: {
    initialDate: React.PropTypes.object,
    onChange: React.PropTypes.func
  },

  getInitialState() {
    if (this.props.initialDate) {
      const dt = moment(this.props.initialDate);
      return { year: dt.get('y'), month: dt.get('M'), day: dt.get('D') }
    } else {
      return { year: '', month: '', day: '' };
    }
  },

  render() {
    console.log('DatePicker#render');
    var classes = cn({ 'date-picker': true, valid: this.isValid(), invalid: !this.isValid() });

    return (
      <div id='user-birthdate' className={classes}>
        <select ref='month' value={ this.state.month } className='form-control month' onChange={ this._handleChange }>
          <option value=''>Month</option>
          { MONTH_OPTIONS }
        </select>

        <select ref='day' value={ this.state.day } className='form-control day' onChange={ this._handleChange }>
          <option value=''>Day</option>
          { DAY_OPTIONS }
        </select>

        <select ref='year' value={ this.state.year } className='form-control year' onChange={ this._handleChange }>
          <option value=''>Year</option>
          { YEAR_OPTIONS }
        </select>
      </div>
    );
  },

  getDate() {
    const date = this._getDateAsMoment();
    return date.isValid() ? date.toDate() : null;
  },

  /**
   * Returns whether the entered date is valid.
   */
  isValid() {
    const date = this._getDateAsMoment();
    return date && date.isValid();
  },

  _getDateAsMoment() {
    return moment([this.state.year, this.state.month, this.state.day]);
  },

  _updateState() {
    const r = this.refs;

    this.state.year = r.year.getDOMNode().value;
    this.state.month = r.month.getDOMNode().value;
    this.state.day = r.day.getDOMNode().value;

    this.forceUpdate();
  },

  _handleChange() {
    this._updateState();
    this.props.onChange && this.props.onChange(this.getDate());
  }

});

module.exports = DatePicker;