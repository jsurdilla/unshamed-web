'use strict';

var { assign, each, isFunction } = require('lodash');
var EventEmitter = require('events');
var Immutable = require('immutable');
var invariant = require('react/lib/invariant');

var CHANGE_EVENT = 'change';

function createStore(spec) {
  const store = assign({
    emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  }, spec, EventEmitter.prototype);

  each(store, (val, key) => {
    if (isFunction(val)) {
      store[key] = store[key].bind(store);
    }
  });

  store.setMaxListeners(0);
  return store;
}

function createEntityWithClientID(entity) {
  invariant(!!entity.id, 'Attempted to assign a client ID to an entity with no ID.');
  return Immutable.fromJS(entity).set('cid', 'cid_' + entity.id);
}

function typedEntityID(entity) {
  return entity.type + '_' + entity.id;
}

module.exports = {
  createStore,
  createEntityWithClientID,
  typedEntityID
};