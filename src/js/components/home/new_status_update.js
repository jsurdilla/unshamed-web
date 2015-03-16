/** @jsx React.DOM */

var _ = require('lodash');
var PostActionCreators = require('../../actions/PostActionCreators');
var PostStore = require('../../stores/PostStore');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var React = require('react');

var NewStatusUpdate = React.createClass({
  getInitialState() {
    return {
      statusUpdate: '',
      inProgress: false
    }
  },

  componentDidMount() {
    PostStore.addChangeListener(this._handleStoreChange);
    this.refs.actionsPanel.getDOMNode().style.display = 'none'; // hide the actions bar
  },

  render() {
    return (
      <div id='status-update'>
        <textarea
          placeholder="What's on your mind?"
          value={ this.state.statusUpdate }
          onFocus={ this._showActionsPanel }
          onChange={ this._handleOnChange }>
        </textarea>

        <div className='action clearfix' ref='actionsPanel'>
          <button className='btn btn-sm btn-primary pull-right'
            disabled={ this.state.statusUpdate.trim() === '' || this.state.inProgress } 
            onClick={ this._postStatusUpdate }
            ref='submitButton'>
            Post
          </button>
        </div>
      </div>
    );
  },

  componentWillUnmount() {
    PostStore.removeChangeListener(this._handleStoreChange);
  },

  _handleStoreChange() {
    if (this.state.inProgress && !PostStore.isPosting()) {
      this.setState({ inProgress: false, statusUpdate: '' });
    }
  },

  _handleOnChange(event) {
    this.setState({ statusUpdate: event.target.value });
  },

  _showActionsPanel() {
    this.refs.actionsPanel.getDOMNode().style.display = 'block';
  },

  _postStatusUpdate() {
    this.setState({ inProgress: true });
    PostActionCreators.postStatusUpdate(this.state.statusUpdate.trim());
  }
});

module.exports = NewStatusUpdate;