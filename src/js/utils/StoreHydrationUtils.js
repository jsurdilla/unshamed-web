'use strict';

var { assign, each, isFunction } = require('lodash');
var EventEmitter = require('events');
var Immutable = require('immutable');
var invariant = require('react/lib/invariant');
var TypeToStore = require('../constants/TypeToStore');

var CHANGE_EVENT = 'change';

function hydrate(Store, entityIDsList) {
  return entityIDsList && entityIDsList.map(f => Store.get(f));
}

function hydrateTypedEntityIDs(typedEntityIDS) {
  return typedEntityIDS.map((typedEntityID) => {
    var [ type, id ] = typedEntityID.split('_')
    return TypeToStore[type].get(id);
  });
}

module.exports = {
  hydrate,
  hydrateTypedEntityIDs
};