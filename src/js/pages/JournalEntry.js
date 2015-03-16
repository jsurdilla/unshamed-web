/** @jsx React.DOM */

var { assign } = require('lodash');
var AuthFilterMixin = require('../utils/AuthFilterMixin');
var AuthUtils = require('../utils/AuthUtils');
var JournalActionCreators = require('../actions/JournalActionCreators');
var JournalEntryListStore = require('../stores/JournalEntryListStore');
var JournalEntryStore = require('../stores/JournalEntryStore');
var moment = require('moment');
var Nav = require('../components/AppNav');
var { partialRight } = require('lodash');
var React = require('react');
var { Navigation, State } = require('react-router');

var JournalEntry = React.createClass({
  mixins: [Navigation, State],

  getInitialState() {
    console.log('JournalEntry#getInitialState', this.getParams().journalEntryID);
    return {};
  },

  componentWillReceiveProps(nextProps) {
    console.log('JournalEntry#componentWillReceiveProps', nextProps, JournalEntryStore.inProgress());
    const journalEntryID = parseInt(this.getParams().journalEntryID);

    if (journalEntryID !== this.state.journalEntryID) {
      const journalEntry = JournalEntryStore.get(journalEntryID);

      this.setState({
        journalEntryID: journalEntryID,
        title: journalEntry.get('title'),
        postedAt: moment(journalEntry.get('posted_at')).toDate(),
        body: journalEntry.get('body'),
        private: !journalEntry.get('public')
      });
    } else if (this.state.inProgress && !JournalEntryStore.inProgress()) {
      this.setState({ inProgress: false });
    }
  },

  render() {
    console.log('JournalEntry#render');

    return (
      <div>
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
      </div>
    );
  },

  componentDidUpdate() {
    console.log('JournalEntry#componentDidUpdate', this.state.postedAt);
    this.editor.trumbowyg('html', this.state.body);
    this.postDatePicker.pickadate('set', { select: this.state.postedAt });
  },

  componentDidMount() {
    console.log('JournalEntry#componentDidMount', journalEntry);

    // When coming to this screen from another screen.
    const journalEntryID = parseInt(this.getParams().journalEntryID);
    const journalEntry = JournalEntryStore.get(journalEntryID);

    if (journalEntry) {
      this.setState({
        journalEntryID: journalEntryID,
        title: journalEntry.get('title'),
        postedAt: moment(journalEntry.get('posted_at')).toDate(),
        body: journalEntry.get('body'),
        private: !journalEntry.get('public')
      });
    }

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
    console.log('JournalEntry#componentWillUnmount');
    this.editor.trumbowyg('destroy');
    this.postDatePicker.pickadate('stop');
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

    JournalActionCreators.updateJournalEntry(parseInt(this.getParams().journalEntryID), {
      title: this.state.title,
      body: this.state.body,
      posted_at: this.state.postedAt,
      public: !this.state.private
    });
    this.setState({ inProgress: true });
  }
});

module.exports = JournalEntry;