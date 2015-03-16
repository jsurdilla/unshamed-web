/** @jsx React.DOM */

var AuthFilterMixin = require('../utils/AuthFilterMixin');
var AuthUtils = require('../utils/AuthUtils');
var cn = require('classnames');
var { hydrate } = require('../utils/StoreHydrationUtils');
var JournalActionCreators = require('../actions/JournalActionCreators');
var JournalEntryListStore = require('../stores/JournalEntryListStore');
var JournalEntryStore = require('../stores/JournalEntryStore');
var { map } = require('lodash');
var moment = require('moment');
var Nav = require('../components/AppNav');
var { OrderedSet } = require('immutable');
var React = require('react');
var { Link, RouteHandler } = require('react-router');

function getStateFromStores() {
  return {
    journalEntryIDs: JournalEntryListStore.getAll()
  }
}

var Journal = React.createClass({

  mixins: [AuthFilterMixin],

  getInitialState() {
    return getStateFromStores();
  },

  componentWillMount() {
    JournalEntryListStore.addChangeListener(this._onDataChange);

    JournalActionCreators.fetchJournalEntries();
  },

  render: function() {
    console.log('Journal#render');

    const journalEntries = map(hydrate(JournalEntryStore, this.state.journalEntryIDs).toArray(), (journalEntry) => {
      return <li className={ cn({ public: journalEntry.get('public'), private: !journalEntry.get('public') }) }>
        <Link to='journal_entry' params={{ journalEntryID: journalEntry.get('id') }}className='title'>{ journalEntry.get('title') }</Link>
        <span>Created <em>{ moment(journalEntry.get('created_at')).fromNow() }</em></span>
      </li>;
    });

    return (
      <div>
        <Nav />
        <div id='journal' className='container'>
          <div className='content-area'>
            <div className='left-rail'>
              <section className='journal-entries wire-section'>
                <h3>
                  <span>Entries</span>
                  <Link className='new-entry' to='new_journal_entry'>New</Link>
                </h3>
                <div className='content'>
                  <ol className="list-unstyled">
                    { journalEntries }
                  </ol>
                </div>
              </section>
            </div>

            <div className='main-rail'>
              <RouteHandler { ...this.props } />
            </div>
          </div>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    JournalEntryListStore.removeChangeListener(this._onDataChange);
  },

  _onDataChange() {
    this.setState(getStateFromStores());
  }

});

module.exports = Journal;