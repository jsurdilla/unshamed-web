/** @jsx React.DOM */

var { last, map }= require('lodash');
var AuthFilterMixin = require('../../utils/AuthFilterMixin');
var ConversationActionCreators = require('../../actions/ConversationActionCreators');
var ConversationServerActionCreators = require('../../actions/ConversationServerActionCreators');
var ConversationItem = require('./ConversationItem');
var ConversationListStore = require('../../stores/ConversationListStore');
var ConversationMessagesStore = require('../../stores/ConversationMessagesStore');
var ConversationStore = require('../../stores/ConversationStore');
var { hydrate } = require('../../utils/StoreHydrationUtils');
var { Link, RouteHandler, Navigation, State } = require('react-router');
var MessageStore = require('../../stores/MessageStore');
var Nav = require('../../components/AppNav');
var React = require('react');
var { getActiveConversation, saveActiveConversation } = require('../../utils/StorePersistenceUtil');
var { updateRootContainerHeight } = require('../../utils/DisplayUtils');

function getStateFromStores() {
  return {
    conversationIDs: ConversationListStore.getAll()
  }
};

var Conversations = React.createClass({

  mixins: [AuthFilterMixin, Navigation, State],

  getInitialState() {
    return getStateFromStores();
  },

  componentWillMount() {
    ConversationListStore.addChangeListener(this._onDataChange);
    ConversationMessagesStore.addChangeListener(this._onDataChange);

    ConversationActionCreators.fetchConversations();

    if (last(this.getRoutes()).name === 'conversation') {
      this.setState({ activeConversationID: parseInt(this.getParams().conversationID) });
    }
  },

  componentWillReceiveProps(nextProps) {
    console.log('Conversations#componentWillReceiveProps', nextProps);
    var activeConversationID = this.getParams().conversationID;
    activeConversationID = activeConversationID && parseInt(activeConversationID);
    this.setState({ activeConversationID });
  },

  render() {
    console.log('Conversations#render');
    var conversations = map(hydrate(ConversationStore, this.state.conversationIDs).toArray(), (conversation) => {
      return <ConversationItem key={ conversation.get('cid') } conversation={ conversation }
        active={ conversation.get('id') === this.state.activeConversationID } />
    });

    return (
      <div>
        <Nav />
        <div id='conversations' className='container' ref='rootContainer'>
          <div className='wrapper'>
            <div className='row'>
              <div className="col-md-4 sidebar-offcanvas left-panel">
                <header>
                  <Link to='new_conversation' className="top-link wire-btn" onClick={ this._compose }>
                    <img src="/images/compose@2x.png" />New Message
                  </Link>
                </header>
                <ul className='conversations-list'>
                  { conversations }
                </ul>
              </div>
              <div className="col-md-8 main-panel">
                <RouteHandler { ...this.props } />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  componentDidMount() {
    updateRootContainerHeight(this.refs.rootContainer.getDOMNode());
  },

  componentWillUnmount() {
    ConversationListStore.removeChangeListener(this._onDataChange);
    ConversationMessagesStore.removeChangeListener(this._onDataChange);
  },

  _onDataChange() {
    this.setState(getStateFromStores());
  },

  _compose() {
  }
});

module.exports = Conversations;