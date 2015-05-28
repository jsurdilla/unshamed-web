'use strict';

require('traceur/bin/traceur-runtime');

var { last } = require('lodash');
var AppDispatcher = require('./dispatcher/AppDispatcher');
var UserHome = require('./pages/UserHome');
var Conversations = require('./components/conversations/Conversations');
var Conversation = require('./components/conversations/Conversation');
var JournalEntries = require('./pages/JournalEntries');
var NewJournalEntry = require('./pages/NewJournalEntry');
var JournalEntry = require('./pages/JournalEntry');
var Landing = require('./pages/Landing');
var Member = require('./pages/Member');
var Members = require('./pages/Members');
const MHPsPage = require('./reflux/views/MHPsPage');
var MyProfile = require('./pages/MyProfile');
var NewConversation = require('./components/conversations/NewConversation');
var Onboard = require('./pages/Onboard');
var PusherUtils = require('./utils/PusherUtils');
var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute } = Router;
var Unshamed = require('./components/unshamed');

var routes = (
  <Route name='root' handler={ Unshamed } path='/'>
    <DefaultRoute name='landing' handler={ Landing } />
    <Route name='onboarding' handler={ Onboard } />
    <Route name='home' handler={ UserHome } />
    <Route name='conversations' handler={ Conversations }>
      <Route name='new_conversation' path='new' handler={ NewConversation } />
      <Route name='conversation' path=':conversationID' handler={ Conversation } />
    </Route>

    <Route name='member' path='member/:userID' handler={ Member } />
    <Route name='members' handler={ Members } />
    <Route name='mhps' handler={ MHPsPage } />

    <Route name='journal_entries' handler={ JournalEntries }>
      <Route name='new_journal_entry' path='new' handler={ NewJournalEntry } />
      <Route name='journal_entry' path=':journalEntryID' handler={ JournalEntry } />
    </Route>
    <Route name='my_profile' handler={ MyProfile } />
  </Route>
);

Router.run(routes, function(Handler, state) {
  React.render(<Handler {...state} />, document.getElementById('unshamed'));
});