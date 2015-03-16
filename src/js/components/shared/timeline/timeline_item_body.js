/** @jsx React.DOM */

var SupportActionCreators = require('../../../actions/SupportActionCreators');
var React = require('react');

var TimelineItemHeader = React.createClass({

  propTypes: {
    supportSummary: React.PropTypes.object
  },

  render() {
    var item = this.props.item;

    if (item.get('type') === 'Post') {
      return (
        <div className='body'>
          <div className='content'>{ item.get('body') }</div>
          <a className='support off' onClick={ this._handleSupportClick }>
            { this.props.supportSummary && this.props.supportSummary.get('is_supporter') ?
              <img src='/images/heart_filled@2x.png' /> :
              <img src='/images/heart@2x.png' /> 
            }
          </a>
        </div>
      );
    } else if (item.get('type') === 'JournalEntry') {
      return (
        <div className='body'>
          <div className='content'>
            <img className='journal-icon' src='/images/journal.png' />
            <div>
              <h3>{ item.get('title') }</h3>
              <div className='entry-body' dangerouslySetInnerHTML={{ __html: item.get('body') }}></div>
            </div>
          </div>
          <a className='support off' onClick={ this._handleSupportClick }>
            { this.props.supportSummary && this.props.supportSummary.get('is_supporter') ?
              <img src='/images/heart_filled@2x.png' /> :
              <img src='/images/heart@2x.png' /> 
            }
          </a>
        </div>
      );
    }
  },

  _handleSupportClick() {
    SupportActionCreators.toggleItemSupport(this.props.item);
  }
})

module.exports = TimelineItemHeader;