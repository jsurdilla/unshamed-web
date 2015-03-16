/** @jsx React.DOM */

var React = require('react');

var TimelineItemPropsCount = React.createClass({
  
  propTypes: {
    supportSummary: React.PropTypes.object
  },

  render() {
    var supportSummary = this.props.supportSummary
    return (
      <div className='props-count'>
        { supportSummary ?
          <span>{ supportSummary.get('count') } Support</span> :
          <span>Be the first to support this.</span>
        }
      </div>
    );
  }
})

module.exports = TimelineItemPropsCount;