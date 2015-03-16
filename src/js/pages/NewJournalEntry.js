/** @jsx React.DOM */

var { assign } = require('lodash');
var AuthFilterMixin = require('../utils/AuthFilterMixin');
var AuthUtils = require('../utils/AuthUtils');
var JournalActionCreators = require('../actions/JournalActionCreators');
var JournalEntryListStore = require('../stores/JournalEntryListStore');
var JournalEntryStore = require('../stores/JournalEntryStore');
var moment = require('moment');
var { Navigation } = require('react-router');
var { partialRight } = require('lodash');
var React = require('react');
var { trimmedValue } = require('../utils/ComponentUtils');

var NewJournalEntry = React.createClass({
  mixins: [Navigation],

  getInitialState() {
    return {
      title: '',
      postedAt: new Date,
      body: '',
      private: true
    };
  },

  componentWillReceiveProps(nextProps) {
    console.log('NewJournalEntry#componentWillReceiveProps', nextProps, JournalEntryStore.inProgress());
    if (this.state.inProgress && !JournalEntryStore.inProgress()) {
      const entries = JournalEntryListStore.getAll();
      this.transitionTo('journal_entry', { journalEntryID: entries.last() });
    }
  },

  render() {
    console.log('NewJournalEntry#render');
    return (
      <form onSubmit={ this._handleSubmit }>
        <div className='row'>
          <div className='title form-group'>
            <input type='text' className='form-control' placeholder='Title' value={ this.state.title } onChange={ this._handleTitleChange } />
          </div>

          <div className='date form-group'>
            <input type='text' className='form-control' data-value={ this.state.postedAt } />
          </div>
        </div>

        <div ref='editor' className='editor' />

        <div className='actions clearfix'>
          <label>
            <input type='checkbox' checked={ this.state.private } onChange={ this._handleVisibilityChange } /> Private
          </label>

          <button className='btn btn-primary pull-right save' disabled={ this.state.inProgress }>
            { this.state.inProgress ? 'Saving...' : 'Save' }
          </button>
        </div>

        { !this.state.private &&
          <div className='visibility-warning alert alert-warning'>You opted to make this post public. All your changes are immediately visible.</div>
        }
      </form>
    );
  },

  componentDidMount() {
    console.log('NewJournalEntry#componentDidMount');
    this.editor = jQuery('.editor')
      .trumbowyg({ mobile: true, tablet: true, autogrow: true })
        .on('keyup', (e) => this.state.body = this.editor.html());

    // setup post date
    this.postDatePicker = $('.date input:first').pickadate({
      format: 'mmm dd, yyyy',
      formatSubmit: 'yyyy/mm/dd',
      onSet: (context) => this.state.postedAt = moment(context.select).toDate()
    });
  },

  componentWillUnmount() {
    console.log('NewJournalEntry#componentWillUnmount');
  },

  _handleTitleChange(e) {
    this.setState({ title: e.target.value });
  },

  _handleVisibilityChange(e) {
    this.setState({ private: e.target.checked });
  },

  _handleSubmit(e) {
    e.preventDefault();

    if (!this.state.postedAt) return alert('Post Date is required.');
    if (this.state.title.trim().length === 0) return alert('Title is required.');
    if (this.state.body.trim().length === 0) return alert('Body is required.');

    JournalActionCreators.createNewJournalEntry({
      title: this.state.title,
      body: this.state.body,
      posted_at: this.state.postedAt,
      public: !this.state.private
    });
    this.setState({ inProgress: true });
  }
});

module.exports = NewJournalEntry;