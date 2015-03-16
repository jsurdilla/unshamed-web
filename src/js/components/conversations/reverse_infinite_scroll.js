/** @jsx React.DOM */

var React = require('react');

var ReverseInfiniteScroll = React.createClass({
  _hasScrollListener: false,

  displayName: 'ReverseInfiniteScroll',

  propTypes: {
    threshold: React.PropTypes.number,
    loadMore: React.PropTypes.func.isRequired,
    hasMore: React.PropTypes.bool,
    measurableClass: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      hasMore: false,
      threshold: 250
    };
  },

  componentDidMount() {
    this._attachScrollListener();
  },

  render() {
    return (
      <div hasMore={this.props.hasMore}>
        {this.props.children}
      </div>
    );
  },

  componentDidUpdate() {
    this._attachScrollListener();
  },

  componentWillUnmount() {
    this._detachScrollListener();
  },

  _scrollableElement() {
    var el = this.getDOMNode();
    if (this.props.measurableClass) {
      el = el.getElementsByClassName(this.props.measurableClass)[0];
    }
    return el;
  },

  _scrollListener() {
    var el = this._scrollableElement();

    if (el.scrollTop < Number(this.props.threshold)) {
      this._detachScrollListener();
      this.props.loadMore();
    }
  },

  _attachScrollListener() {
    if (!this.props.hasMore || this._hasScrollListener) return;

    this._hasScrollListener = true;
    this._scrollableElement().addEventListener('scroll', this._scrollListener);
    window.addEventListener('resize', this._scrollListener);
  },

  _detachScrollListener() {
    this._scrollableElement().removeEventListener('scroll', this._scrollListener);
    window.removeEventListener('resize', this._scrollListener);
    this._hasScrollListener = false;
  }
});

module.exports = ReverseInfiniteScroll;