/** @jsx React.DOM */

var _ = require('lodash');
var classnames = require('classnames');
var React = require('react');
var { PropTypes } = React;

var ConversationReply = React.createClass({
  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    areOthersValid: PropTypes.func
  },

  getInitialState() {
    return {
      reply: '',
      isValid: false
    };
  },

  componentWillReceiveProps(nextProps) {
    console.log('ConversationReply#componentWillReceiveProps', nextProps);
    if (this.state.reply === nextProps.lastReply) {
      this.setState({ busy: false, reply: '', isValid: false });
    } else {
      this.setState({ isValid: this.state.reply.trim().length > 0 && (!this.props.areOthersValid || this.props.areOthersValid()) });
    }
  },

  render() {
    console.log('ConversationReply#render()');
    return (
      <div className='reply'>
        <form>
          <textarea placeholder='Your reply' value={ this.state.reply } onChange={ this._onChange } ref='reply'></textarea>
          <div className='action clearfix'>
            <button className='btn btn-sm btn-primary pull-right' disabled={ !this.state.isValid || this.state.busy } onClick={ this._onSubmit }>
              { this.state.busy ? 'Sending...' : 'Send Reply' }
            </button>
          </div>
        </form>
      </div>
    );
  },

  _onChange(event) {
    var reply = event.target.value;
    var isValid = reply.trim().length > 0 && (!this.props.areOthersValid || this.props.areOthersValid());
    this.setState({ reply, isValid });
  },

  _onSubmit() {
    if (!this.state.isValid) {
      return;
    }
    this.setState({ busy: true });
    this.props.onSubmit(this.state.reply.trim());
  }
});

module.exports = ConversationReply;