/** @jsx React.DOM */

var React = require('react');

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var InfiniteScroll = React.createClass({
  _hasScrollListener: false,

  displayName: 'InfiniteScroll',

  propTypes: {
    threshold: React.PropTypes.number,
    loadMore: React.PropTypes.func.isRequired,
    hasMore: React.PropTypes.bool
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
      <div>
        { this.props.children }
        { this.props.loader }
      </div>
    );
  },

  componentDidUpdate() {
    this._attachScrollListener();
  },

  componentWillUnmount() {
    this._detachScrollListener();
  },

  _scrollListener() {
    var el = this.getDOMNode();

    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
      this._detachScrollListener();
      this.props.loadMore();
    }
  },

  _attachScrollListener() {
    if (!this.props.hasMore || this._hasScrollListener) return;

    this._hasScrollListener = true;
    window.addEventListener('scroll', this._scrollListener);
    window.addEventListener('resize', this._scrollListener);
  },

  _detachScrollListener() {
    window.removeEventListener('scroll', this._scrollListener);
    window.removeEventListener('resize', this._scrollListener);
    this._hasScrollListener = false;
  }
});

module.exports = InfiniteScroll;