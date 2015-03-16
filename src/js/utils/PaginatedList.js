'use strict';

var { each } = require('lodash');
var invariant = require('react/lib/invariant');
var { OrderedSet } = require('immutable');

class PaginatedList {
  constructor(ids) {
    this._ids = OrderedSet(ids);
    this._isExpectingPage = false;
    this._hasMore = true;
    this._currentPage = 1;
  }

  getIds() {
    return this._ids;
  }

  isExpectingPage() {
    return this._isExpectingPage;
  }

  hasMore() {
    return this._hasMore;
  }

  getCurrentPage() {
    return this._currentPage;
  }

  add(id) {
    _ids = _ids.add(id);
  }

  remove(id) {
    _ids = _ids.remove(id);
  }

  expectPage() {
    invariant(!this._isExpectingPage, 'Cannot call expectPage twice without prior cancelPage or receivePage call.');
    this._isExpectingPage = true;
  }

  cancelPage() {
    invariant(this._isExpectingPage, 'Cannot call cancelPage without prior expectPage call.');
    this._isExpectingPage = false;
  }

  receivePage(newIds, page) {
    invariant(this._isExpectingPage || page === 1, 'Cannot call receivePage without prior expectPage call.');

    if (newIds.length) {
      each(newIds, (id) => this._ids = this._ids.add(id));
    } else {
      _hasMore = false;
    }

    this._currentPage++;
    this._isExpectingPage = false;
  }
}

module.exports = PaginatedList;