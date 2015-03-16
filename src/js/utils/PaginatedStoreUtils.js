'use strict';

var { assign, isUndefined } = require('lodash');
var { createStore } = require('./StoreUtils');
var { Map } = require('immutable');
var PaginatedList = require('./PaginatedList');

const PROXIED_PAGINATED_LIST_METHODS = [
  'getIds', 'isExpectingPage', 'hasMore'
];

function createListStoreSpec({ getList, callListMethod }) {
  const spec = { getList };

  PROXIED_PAGINATED_LIST_METHODS.forEach(method => {
    spec[method] = function (...args) {
      return callListMethod(method, args);
    };
  });

  return spec;
}

function createListStore(spec) {
  const list = new PaginatedList();

  function getList() {
    return list;
  }

  function callListMethod(method, args) {
    return list[method].call(list, args);
  }

  return createStore(
    assign(createListStoreSpec({
      getList,
      callListMethod
    }), spec)
  );
}

function createIndexedListStore(spec) {
  let lists = Map();
  const idPrefix = 'ID_';

  function getList(id) {
    const key = idPrefix + id;

    if (!lists.get(key)) {
      lists = lists.set(key, new PaginatedList());
    }

    return lists.get(key);
  }

  function callListMethod(method, args) {
    const id = args.shift();
    invariant(isUndefined(id), 'Indexed pagination store methods expect ID as first parameter.');

    const list = getList(id);
    return list[method].call(list, args)
  }

  return createStore(
    assign(createListStoreSpec({
      getList,
      callListMethod
    }), spec)
  );
}

module.exports = {
  createListStore,
  createIndexedListStore
}